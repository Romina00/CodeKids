import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { achievementFixture } from '../../testing/fixtures';
import { Achievement } from '../entities/achievement.entity';
import { Reward } from '../entities/reward.entity';
import { RewardsService } from './rewards.service';

describe('RewardsService', () => {
  let service: RewardsService;
  let rewards: jest.Mocked<Repository<Reward>>;
  let achievements: jest.Mocked<Repository<Achievement>>;

  beforeEach(() => {
    rewards = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn((value) => value as Reward),
      save: jest.fn((value) => Promise.resolve({ id: 50, ...value } as Reward)),
    } as unknown as jest.Mocked<Repository<Reward>>;
    achievements = { findOne: jest.fn() } as unknown as jest.Mocked<
      Repository<Achievement>
    >;
    service = new RewardsService(rewards, achievements);
  });

  it('assigns an achievement snapshot to a child', async () => {
    const achievement = achievementFixture();
    achievements.findOne.mockResolvedValue(achievement);
    rewards.findOne.mockResolvedValue(null);

    await expect(
      service.assignAchievement(20, achievement.code),
    ).resolves.toMatchObject({
      id: 50,
      childId: 20,
      achievementId: 40,
      title: 'Loop learner',
      metadata: { code: 'LOOP_LEARNER', points: 50 },
    });
  });

  it('returns an existing reward instead of creating a duplicate', async () => {
    const achievement = achievementFixture();
    const existing = { id: 50, childId: 20, achievementId: 40 } as Reward;
    achievements.findOne.mockResolvedValue(achievement);
    rewards.findOne.mockResolvedValue(existing);

    await expect(service.assignAchievement(20, achievement.code)).resolves.toBe(
      existing,
    );
    expect(rewards.save.mock.calls).toHaveLength(0);
  });

  it('rejects an unknown or inactive achievement', async () => {
    achievements.findOne.mockResolvedValue(null);
    await expect(service.assignAchievement(20, 'MISSING')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('scopes reward listing to the authenticated child', async () => {
    rewards.find.mockResolvedValue([]);
    await service.findForChild(20);
    expect(rewards.find.mock.calls[0]?.[0]).toEqual({
      where: { childId: 20 },
      relations: { achievement: true },
      order: { earnedAt: 'DESC' },
    });
  });
});
