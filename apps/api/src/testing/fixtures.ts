import { Achievement } from '../learning/entities/achievement.entity';
import { Progress, ProgressStatus } from '../learning/entities/progress.entity';
import { Role, User } from '../users/entities/user.entity';

export const parentFixture = (overrides: Partial<User> = {}) =>
  ({
    id: 7,
    role: Role.PARENT,
    email: 'parent@example.com',
    passwordHash: 'bcrypt-hash',
    displayName: 'Parent',
    ...overrides,
  }) as User;

export const childFixture = (overrides: Partial<User> = {}) =>
  ({
    id: 20,
    role: Role.KID,
    parentId: 7,
    nickname: 'Mina',
    displayName: 'Mina',
    avatar: 'robot-blue',
    birthYear: 2016,
    learningLevel: 'beginner',
    ...overrides,
  }) as User;

export const progressFixture = (overrides: Partial<Progress> = {}) =>
  ({
    id: 30,
    childId: 20,
    levelId: 1,
    activityId: null,
    status: ProgressStatus.IN_PROGRESS,
    completed: false,
    score: 80,
    timeSpentMinutes: 25,
    attempts: 1,
    ...overrides,
  }) as Progress;

export const achievementFixture = (overrides: Partial<Achievement> = {}) =>
  ({
    id: 40,
    code: 'LOOP_LEARNER',
    title: 'Loop learner',
    description: 'Completed the first loop challenge.',
    points: 50,
    active: true,
    ...overrides,
  }) as Achievement;
