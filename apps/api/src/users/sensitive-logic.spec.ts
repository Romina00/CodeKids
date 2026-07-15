import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  Invitation,
  InvitationStatus,
} from '../auth/entities/invitation.entity';
import { Progress } from '../learning/entities/progress.entity';
import { Reward } from '../learning/entities/reward.entity';
import {
  childFixture,
  parentFixture,
  progressFixture,
} from '../testing/fixtures';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService sensitive calculations', () => {
  let service: UsersService;
  let users: jest.Mocked<Repository<User>>;
  let invitations: jest.Mocked<Repository<Invitation>>;
  let progress: jest.Mocked<Repository<Progress>>;
  let rewards: jest.Mocked<Repository<Reward>>;

  beforeEach(() => {
    users = {
      findOne: jest.fn().mockResolvedValue(parentFixture()),
      find: jest.fn().mockResolvedValue([childFixture()]),
    } as unknown as jest.Mocked<Repository<User>>;
    invitations = {
      findOne: jest.fn(),
      save: jest.fn((value) => Promise.resolve(value as Invitation)),
    } as unknown as jest.Mocked<Repository<Invitation>>;
    progress = { find: jest.fn() } as unknown as jest.Mocked<
      Repository<Progress>
    >;
    rewards = { find: jest.fn() } as unknown as jest.Mocked<Repository<Reward>>;
    service = new UsersService(users, invitations, progress, rewards);
  });

  it('expires a stale invitation before rejecting it', async () => {
    const invitation = {
      id: 1,
      token: 'a'.repeat(48),
      status: InvitationStatus.PENDING,
      expiresAt: new Date(Date.now() - 1),
    } as Invitation;
    invitations.findOne.mockResolvedValue(invitation);

    await expect(
      service.getPendingInvitation(invitation.token),
    ).rejects.toThrow(new BadRequestException('Invitation has expired.'));
    expect(invitation.status).toBe(InvitationStatus.EXPIRED);
    expect(invitations.save.mock.calls[0]?.[0]).toBe(invitation);
  });

  it('calculates child and family progress summaries from fixtures', async () => {
    progress.find.mockResolvedValue([
      progressFixture({ completed: true, score: 100, timeSpentMinutes: 35 }),
      progressFixture({ id: 31, score: 80, timeSpentMinutes: 25 }),
    ]);
    rewards.find.mockResolvedValue([
      { id: 40, childId: 20 } as Reward,
      { id: 41, childId: 20 } as Reward,
    ]);

    const dashboard = await service.getParentDashboard(7);

    expect(dashboard.children[0]).toMatchObject({
      id: 20,
      completedLevels: 1,
      earnedRewards: 2,
      learningStatistics: { records: 2, averageScore: 90 },
      timeSpentMinutes: 60,
    });
    expect(dashboard.totals).toEqual({
      children: 1,
      completedLevels: 1,
      rewards: 2,
      timeSpentMinutes: 60,
    });
  });
});
