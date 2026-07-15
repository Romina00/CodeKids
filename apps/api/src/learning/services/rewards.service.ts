import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from '../entities/achievement.entity';
import { Reward } from '../entities/reward.entity';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardsRepository: Repository<Reward>,
    @InjectRepository(Achievement)
    private readonly achievementsRepository: Repository<Achievement>,
  ) {}

  findForChild(childId: number) {
    return this.rewardsRepository.find({
      where: { childId },
      relations: { achievement: true },
      order: { earnedAt: 'DESC' },
    });
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
