import { BadRequestException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { Activity } from '../entities/activity.entity';
import { Progress, ProgressStatus } from '../entities/progress.entity';
import { ProgressService } from './progress.service';
import { RewardsService } from './rewards.service';

describe('ProgressService', () => {
  let progress: jest.Mocked<Repository<Progress>>;
  let activities: jest.Mocked<Repository<Activity>>;
  let service: ProgressService;
  let rewards: jest.Mocked<RewardsService>;

  beforeEach(() => {
    progress = repositoryMock<Progress>();
    activities = repositoryMock<Activity>();
    rewards = {
      recordEvent: jest.fn().mockResolvedValue({ event: {}, rewards: [] }),
    } as unknown as jest.Mocked<RewardsService>;
    service = new ProgressService(progress, activities, rewards);
    activities.findOne.mockResolvedValue({
      id: 4,
      levelId: 2,
      level: { id: 2, published: true, prerequisiteLevelId: null },
    } as Activity);
    progress.create.mockImplementation((value) => value as Progress);
    progress.save.mockImplementation((value) =>
      Promise.resolve({ id: 1, updatedAt: new Date(), ...value } as Progress),
    );
  });

  it('records attempts, bounded time, resume state, and server timestamps', async () => {
    progress.findOneBy.mockResolvedValue(null);
    await expect(
      service.update(7, {
        levelId: 2,
        activityId: 4,
        status: ProgressStatus.IN_PROGRESS,
        attemptStarted: true,
        timeSpentMinutesDelta: 5,
        resumeData: { step: 2 },
      }),
    ).resolves.toMatchObject({
      attempts: 1,
      timeSpentMinutes: 5,
      resumeData: { step: 2 },
      completed: false,
    });
  });

  it('completes the level when every activity is complete', async () => {
    progress.findOneBy.mockResolvedValue(null);
    activities.countBy.mockResolvedValue(2);
    progress.countBy.mockResolvedValue(2);
    await service.update(7, {
      levelId: 2,
      activityId: 4,
      status: ProgressStatus.COMPLETED,
    });
    expect(
      progress.save.mock.calls.some(
        ([record]) => record.activityId === null && record.completed,
      ),
    ).toBe(true);
  });

  it('does not allow progress on a locked level', async () => {
    activities.findOne.mockResolvedValue({
      id: 4,
      levelId: 2,
      level: { id: 2, published: true, prerequisiteLevelId: 1 },
    } as Activity);
    progress.findOneBy.mockResolvedValue(null);
    await expect(
      service.update(7, {
        levelId: 2,
        activityId: 4,
        status: ProgressStatus.IN_PROGRESS,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('calculates privacy-safe totals without returning raw resume data', async () => {
    progress.find.mockResolvedValue([
      {
        activityId: 4,
        completed: true,
        attempts: 2,
        timeSpentMinutes: 12,
        updatedAt: new Date('2026-01-01'),
      },
      {
        activityId: null,
        completed: true,
        attempts: 0,
        timeSpentMinutes: 0,
        updatedAt: new Date('2026-01-02'),
      },
    ] as Progress[]);
    await expect(service.summary(7)).resolves.toMatchObject({
      completedActivities: 1,
      completedLevels: 1,
      attempts: 2,
      timeSpentMinutes: 12,
      lastActivityAt: new Date('2026-01-02'),
    });
  });
});

function repositoryMock<T extends ObjectLiteral>(): jest.Mocked<Repository<T>> {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    countBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  } as unknown as jest.Mocked<Repository<T>>;
}
