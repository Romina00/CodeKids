import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { Activity, ActivityType } from '../entities/activity.entity';
import { Level } from '../entities/level.entity';
import { Progress, ProgressStatus } from '../entities/progress.entity';
import { LevelsService } from './levels.service';

describe('LevelsService', () => {
  let service: LevelsService;
  let levels: jest.Mocked<Repository<Level>>;
  let activities: jest.Mocked<Repository<Activity>>;
  let progress: jest.Mocked<Repository<Progress>>;

  beforeEach(() => {
    levels = repositoryMock<Level>();
    activities = repositoryMock<Activity>();
    progress = repositoryMock<Progress>();
    service = new LevelsService(levels, activities, progress);
  });

  it('creates a level after validating its prerequisite', async () => {
    levels.findOneBy.mockResolvedValue({ id: 1 } as Level);
    levels.create.mockImplementation((value) => value as Level);
    levels.save.mockImplementation((value) =>
      Promise.resolve({ id: 2, ...value } as Level),
    );

    await expect(
      service.create({
        slug: 'loops-2',
        title: 'Loops 2',
        position: 2,
        published: true,
        prerequisiteLevelId: 1,
      }),
    ).resolves.toMatchObject({ id: 2, prerequisiteLevelId: 1 });
  });

  it('rejects self references and prerequisite cycles', async () => {
    levels.findOneBy
      .mockResolvedValueOnce({ id: 2 } as Level)
      .mockResolvedValueOnce({ id: 2 } as Level)
      .mockResolvedValueOnce({ id: 1, prerequisiteLevelId: 2 } as Level);

    await expect(service.update(2, { prerequisiteLevelId: 2 })).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.update(2, { prerequisiteLevelId: 1 })).rejects.toThrow(
      'cannot form a cycle',
    );
  });

  it('returns published levels in activity order with child state', async () => {
    levels.find.mockResolvedValue([
      {
        id: 2,
        published: true,
        prerequisiteLevelId: 1,
        activities: [
          { id: 22, position: 2 },
          { id: 21, position: 1 },
        ],
      } as Level,
    ]);
    progress.find.mockResolvedValue([
      {
        childId: 7,
        levelId: 1,
        activityId: null,
        completed: true,
        status: ProgressStatus.COMPLETED,
      },
      {
        childId: 7,
        levelId: 2,
        activityId: 21,
        completed: true,
        status: ProgressStatus.COMPLETED,
      },
    ] as Progress[]);

    await expect(service.findAll(7)).resolves.toEqual([
      expect.objectContaining({
        id: 2,
        unlocked: true,
        completed: false,
        activities: [
          expect.objectContaining({ id: 21, completed: true }),
          expect.objectContaining({ id: 22, completed: false }),
        ],
      }),
    ]);
    expect(levels.find.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({ where: { published: true } }),
    );
  });

  it('creates, updates, and removes activities only within their level', async () => {
    levels.findOneBy.mockResolvedValue({ id: 3 } as Level);
    activities.create.mockImplementation((value) => value as Activity);
    activities.save.mockImplementation((value) =>
      Promise.resolve({ id: 30, ...value } as Activity),
    );
    activities.findOneBy.mockResolvedValue({
      id: 30,
      levelId: 3,
      title: 'Start',
    } as Activity);
    activities.merge.mockImplementation((target, value) =>
      Object.assign(target, value),
    );

    await expect(
      service.createActivity(3, {
        title: 'Start',
        type: ActivityType.LESSON,
        position: 0,
        estimatedMinutes: 5,
      }),
    ).resolves.toMatchObject({ id: 30, levelId: 3 });
    await expect(
      service.updateActivity(3, 30, { title: 'Updated' }),
    ).resolves.toMatchObject({ title: 'Updated' });
    await expect(service.removeActivity(3, 30)).resolves.toEqual({
      deleted: true,
      id: 30,
    });
  });

  it('lists drafts for administrators without requesting child progress', async () => {
    levels.find.mockResolvedValue([{ id: 1, published: false }] as Level[]);
    await expect(service.findAll()).resolves.toEqual([
      { id: 1, published: false },
    ]);
    expect(levels.find.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({ where: {} }),
    );
    expect(progress.find.mock.calls).toHaveLength(0);
  });

  it('rejects duplicate slugs without saving', async () => {
    levels.findOne.mockResolvedValue({ id: 1, slug: 'loops' } as Level);
    await expect(
      service.create({
        slug: 'loops',
        title: 'Loops',
        position: 1,
        published: false,
      }),
    ).rejects.toThrow('slug already exists');
    expect(levels.save.mock.calls).toHaveLength(0);
  });

  it('preserves activity progress by rejecting deletion of used activities', async () => {
    activities.findOneBy.mockResolvedValue({ id: 30, levelId: 3 } as Activity);
    progress.existsBy.mockResolvedValue(true);
    await expect(service.removeActivity(3, 30)).rejects.toThrow(
      'Unpublish its level instead',
    );
    expect(activities.remove.mock.calls).toHaveLength(0);
  });

  it('unpublishes a level without deleting its activities or progress', async () => {
    levels.findOneBy.mockResolvedValue({
      id: 3,
      published: true,
      prerequisiteLevelId: null,
    } as Level);
    levels.merge.mockImplementation((target, changes) =>
      Object.assign(target, changes),
    );
    levels.save.mockImplementation((level) => Promise.resolve(level as Level));
    await expect(
      service.update(3, { published: false }),
    ).resolves.toMatchObject({ id: 3, published: false });
    expect(activities.remove.mock.calls).toHaveLength(0);
    expect(progress.remove.mock.calls).toHaveLength(0);
  });

  it('returns not found for unknown levels and cross-level activities', async () => {
    levels.findOne.mockResolvedValue(null);
    activities.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    await expect(service.updateActivity(1, 99, {})).rejects.toThrow(
      NotFoundException,
    );
  });
});

function repositoryMock<T extends ObjectLiteral>(): jest.Mocked<Repository<T>> {
  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    merge: jest.fn(),
    existsBy: jest.fn().mockResolvedValue(false),
    remove: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<Repository<T>>;
}
