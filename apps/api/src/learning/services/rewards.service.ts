import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from '../entities/achievement.entity';
import { Reward } from '../entities/reward.entity';
import { XpEvent, XpEventType } from '../entities/xp-event.entity';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardsRepository: Repository<Reward>,
    @InjectRepository(Achievement)
    private readonly achievementsRepository: Repository<Achievement>,
    @InjectRepository(XpEvent)
    private readonly xpEventsRepository: Repository<XpEvent>,
  ) {}

  findForChild(childId: number) {
    return this.rewardsRepository.find({
      where: { childId },
      relations: { achievement: true },
      order: { earnedAt: 'DESC' },
    });
  }

  async recordEvent(
    childId: number,
    type: XpEventType,
    sourceKey: string,
    amount: number,
    metadata: Record<string, unknown> | null = null,
  ) {
    const existing = await this.xpEventsRepository.findOneBy({
      childId,
      sourceKey,
    });
    if (existing) return { event: existing, rewards: [] as Reward[] };
    const event = await this.xpEventsRepository.save(
      this.xpEventsRepository.create({
        childId,
        type,
        sourceKey,
        amount,
        metadata,
      }),
    );
    const rewards = await this.evaluateAchievements(childId, type);
    return { event, rewards };
  }

  async summary(childId: number) {
    const [events, rewards] = await Promise.all([
      this.xpEventsRepository.find({
        where: { childId },
        order: { createdAt: 'DESC' },
      }),
      this.findForChild(childId),
    ]);
    return {
      xp: events.reduce((sum, event) => sum + event.amount, 0),
      recentEvents: events.slice(0, 20),
      rewards,
    };
  }

  private async evaluateAchievements(childId: number, type: XpEventType) {
    const achievements = await this.achievementsRepository.find({
      where: { active: true },
    });
    const eventCount = await this.xpEventsRepository.countBy({ childId, type });
    const earned: Reward[] = [];
    for (const achievement of achievements) {
      const criteria = achievement.criteria as {
        eventType?: string;
        minCount?: number;
      };
      if (
        criteria.eventType === type &&
        Number.isInteger(criteria.minCount) &&
        eventCount >= (criteria.minCount ?? Infinity)
      ) {
        earned.push(await this.assignAchievement(childId, achievement.code));
      }
    }
    return earned;
  }

  async assignAchievement(childId: number, code: string): Promise<Reward> {
    const achievement = await this.achievementsRepository.findOne({
      where: { code, active: true },
    });
    if (!achievement) {
      throw new NotFoundException('Achievement was not found.');
    }
    const existing = await this.rewardsRepository.findOne({
      where: { childId, achievementId: achievement.id },
    });
    if (existing) return existing;

    return this.rewardsRepository.save(
      this.rewardsRepository.create({
        childId,
        achievementId: achievement.id,
        achievement,
        title: achievement.title,
        description: achievement.description,
        metadata: { code: achievement.code, points: achievement.points },
      }),
    );
  }
}
