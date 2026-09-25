import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { CreateLevelDto } from '../dto/create-level.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { UpdateLevelDto } from '../dto/update-level.dto';
import { Activity } from '../entities/activity.entity';
import { Level } from '../entities/level.entity';
import { Progress, ProgressStatus } from '../entities/progress.entity';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(Level)
    private readonly levels: Repository<Level>,
    @InjectRepository(Activity)
    private readonly activities: Repository<Activity>,
    @InjectRepository(Progress)
    private readonly progress: Repository<Progress>,
  ) {}

  async create(dto: CreateLevelDto) {
    await this.validateSlug(dto.slug);
    await this.validatePrerequisite(null, dto.prerequisiteLevelId ?? null);
    return this.levels.save(this.levels.create(dto));
  }

  async findAll(childId?: number) {
    const levels = await this.levels.find({
      where: childId ? { published: true } : {},
      relations: { activities: true, prerequisiteLevel: true },
      order: { position: 'ASC', id: 'ASC', activities: { position: 'ASC' } },
    });
    return childId ? this.withCompletionState(levels, childId) : levels;
  }

  async findOne(id: number, childId?: number) {
    const level = await this.levels.findOne({
      where: childId ? { id, published: true } : { id },
      relations: { activities: true, prerequisiteLevel: true },
      order: { activities: { position: 'ASC' } },
    });
    if (!level) throw new NotFoundException('Learning level not found.');
    if (!childId) return level;
    return (await this.withCompletionState([level], childId))[0];
  }

  async update(id: number, dto: UpdateLevelDto) {
    const level = await this.requireLevel(id);
    if (dto.slug !== undefined) await this.validateSlug(dto.slug, id);
    const prerequisiteId =
      dto.prerequisiteLevelId === undefined
        ? level.prerequisiteLevelId
        : dto.prerequisiteLevelId;
    await this.validatePrerequisite(id, prerequisiteId ?? null);
    return this.levels.save(this.levels.merge(level, dto));
  }

  async remove(id: number) {
    const level = await this.requireLevel(id);
    await this.levels.remove(level);
    return { deleted: true, id };
  }

  async createActivity(levelId: number, dto: CreateActivityDto) {
    await this.requireLevel(levelId);
    return this.activities.save(this.activities.create({ ...dto, levelId }));
  }

  async updateActivity(
    levelId: number,
    activityId: number,
    dto: UpdateActivityDto,
  ) {
    const activity = await this.requireActivity(levelId, activityId);
    return this.activities.save(this.activities.merge(activity, dto));
  }

  async removeActivity(levelId: number, activityId: number) {
    const activity = await this.requireActivity(levelId, activityId);
    if (await this.progress.existsBy({ activityId: activity.id })) {
      throw new ConflictException(
        'This activity has learning progress and cannot be deleted. Unpublish its level instead.',
      );
    }
    await this.activities.remove(activity);
    return { deleted: true, id: activityId };
  }

  private async withCompletionState(levels: Level[], childId: number) {
    const records = await this.progress.find({ where: { childId } });
    const completedLevelIds = new Set(
      records
        .filter(
          (record) =>
            record.activityId === null &&
            (record.completed || record.status === ProgressStatus.COMPLETED),
        )
        .map((record) => record.levelId),
    );
    const completedActivityIds = new Set(
      records
        .filter(
          (record) =>
            record.activityId !== null &&
            (record.completed || record.status === ProgressStatus.COMPLETED),
        )
        .map((record) => record.activityId),
    );

    return levels.map((level) => ({
      ...level,
      unlocked:
        level.prerequisiteLevelId === null ||
        completedLevelIds.has(level.prerequisiteLevelId),
      completed: completedLevelIds.has(level.id),
      activities: [...level.activities]
        .sort(
          (left, right) => left.position - right.position || left.id - right.id,
        )
        .map((activity) => ({
          ...activity,
          completed: completedActivityIds.has(activity.id),
        })),
    }));
  }

  private async validateSlug(slug: string, levelId?: number) {
    const existing = await this.levels.findOne({ where: { slug } });
    if (existing && existing.id !== levelId) {
      throw new ConflictException('A level with this slug already exists.');
    }
  }

  private async requireLevel(id: number) {
    const level = await this.levels.findOneBy({ id });
    if (!level) throw new NotFoundException('Learning level not found.');
    return level;
  }

  private async requireActivity(levelId: number, id: number) {
    const activity = await this.activities.findOneBy({ id, levelId });
    if (!activity) throw new NotFoundException('Learning activity not found.');
    return activity;
  }

  private async validatePrerequisite(
    levelId: number | null,
    prerequisiteId: number | null,
  ) {
    if (prerequisiteId === null) return;
    if (levelId === prerequisiteId) {
      throw new BadRequestException('A level cannot require itself.');
    }

    let current = await this.levels.findOneBy({ id: prerequisiteId });
    if (!current)
      throw new BadRequestException('Prerequisite level not found.');
    const visited = new Set<number>();
    while (current?.prerequisiteLevelId) {
      if (
        current.prerequisiteLevelId === levelId ||
        visited.has(current.prerequisiteLevelId)
      ) {
        throw new BadRequestException(
          'Prerequisite levels cannot form a cycle.',
        );
      }
      visited.add(current.id);
      current = await this.levels.findOneBy({
        id: current.prerequisiteLevelId,
      });
    }
  }
}
