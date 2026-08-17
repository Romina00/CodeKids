import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { UpdateProgressDto } from '../dto/update-progress.dto';
import { Activity } from '../entities/activity.entity';
import { Level } from '../entities/level.entity';
import { Progress, ProgressStatus } from '../entities/progress.entity';
import { XpEventType } from '../entities/xp-event.entity';
import { RewardsService } from './rewards.service';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress) private readonly progress: Repository<Progress>,
    @InjectRepository(Activity)
    private readonly activities: Repository<Activity>,
    private readonly rewards: RewardsService,
  ) {}

  async update(childId: number, dto: UpdateProgressDto) {
    const activity = await this.activities.findOne({
      where: { id: dto.activityId, levelId: dto.levelId },
      relations: { level: true },
    });
    if (!activity || !activity.level.published)
      throw new NotFoundException('Published learning activity not found.');
    await this.assertUnlocked(childId, activity.level);
    let record = await this.progress.findOneBy({
      childId,
      levelId: dto.levelId,
      activityId: dto.activityId,
    });
    const now = new Date();
    if (!record) {
      record = this.progress.create({
        childId,
        levelId: dto.levelId,
        activityId: dto.activityId,
        status: ProgressStatus.NOT_STARTED,
        completed: false,
        score: 0,
        timeSpentMinutes: 0,
        attempts: 0,
        startedAt: null,
        completedAt: null,
        resumeData: null,
      });
    }
    const wasCompleted = record.completed;
    if (record.completed && dto.status !== ProgressStatus.COMPLETED)
      throw new BadRequestException(
        'Completed activity progress cannot move backwards.',
      );
    record.status = dto.status;
    record.completed = dto.status === ProgressStatus.COMPLETED;
    record.startedAt ??= dto.status === ProgressStatus.NOT_STARTED ? null : now;
    record.completedAt = record.completed ? (record.completedAt ?? now) : null;
    record.attempts += dto.attemptStarted ? 1 : 0;
    record.timeSpentMinutes += dto.timeSpentMinutesDelta ?? 0;
    record.resumeData = this.sanitizeResumeData(dto.resumeData);
    const saved = await this.progress.save(record);
    if (saved.completed) {
      await this.completeLevelIfReady(childId, activity.level);
      if (!wasCompleted)
        await this.rewards.recordEvent(
          childId,
          XpEventType.ACTIVITY_COMPLETED,
          `activity:${activity.id}`,
          10,
          { activityId: activity.id, levelId: activity.levelId },
        );
    }
    return saved;
  }

  async summary(childId: number) {
    const records = await this.progress.find({ where: { childId } });
    const activityRecords = records.filter(
      (record) => record.activityId !== null,
    );
    return {
      completedActivities: activityRecords.filter((record) => record.completed)
        .length,
      completedLevels: records.filter(
        (record) => record.activityId === null && record.completed,
      ).length,
      attempts: activityRecords.reduce(
        (sum, record) => sum + record.attempts,
        0,
      ),
      timeSpentMinutes: activityRecords.reduce(
        (sum, record) => sum + record.timeSpentMinutes,
        0,
      ),
      lastActivityAt: records.reduce<Date | null>(
        (latest, record) =>
          !latest || record.updatedAt > latest ? record.updatedAt : latest,
        null,
      ),
    };
  }

  private async assertUnlocked(childId: number, level: Level) {
    if (level.prerequisiteLevelId === null) return;
    const prerequisite = await this.progress.findOneBy({
      childId,
      levelId: level.prerequisiteLevelId,
      activityId: IsNull(),
    });
    if (!prerequisite?.completed)
      throw new BadRequestException('Complete the prerequisite level first.');
  }

  private async completeLevelIfReady(childId: number, level: Level) {
    const activityCount = await this.activities.countBy({ levelId: level.id });
    const completedCount = await this.progress.countBy({
      childId,
      levelId: level.id,
      completed: true,
    });
    if (activityCount === 0 || completedCount < activityCount) return;
    let aggregate = await this.progress.findOneBy({
      childId,
      levelId: level.id,
      activityId: IsNull(),
    });
    const now = new Date();
    aggregate ??= this.progress.create({
      childId,
      levelId: level.id,
      activityId: null,
      status: ProgressStatus.COMPLETED,
      completed: true,
      score: 0,
      timeSpentMinutes: 0,
      attempts: 0,
      startedAt: now,
      completedAt: now,
      resumeData: null,
    });
    aggregate.status = ProgressStatus.COMPLETED;
    aggregate.completed = true;
    aggregate.completedAt ??= now;
    await this.progress.save(aggregate);
  }

  private sanitizeResumeData(
    value: Record<string, unknown> | null | undefined,
  ) {
    if (value == null) return value ?? null;
    const serialized = JSON.stringify(value);
    if (serialized.length > 10_000)
      throw new BadRequestException(
        'Resume state exceeds the safe size limit.',
      );
    return JSON.parse(serialized) as Record<string, unknown>;
  }
}
