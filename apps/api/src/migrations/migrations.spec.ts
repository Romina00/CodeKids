import { QueryRunner } from 'typeorm';
import { CreateCoreSchema1721030000000 } from './1721030000000-create-core-schema';
import { CreateLearningSchema1721040000000 } from './1721040000000-create-learning-schema';
import { AddLevelPrerequisite1721050000000 } from './1721050000000-add-level-prerequisite';
import { CreateQuizAttempts1721060000000 } from './1721060000000-create-quiz-attempts';

describe('schema migrations', () => {
  it('creates core tables and the self-referencing Parent-Child constraint first', async () => {
    const queries: string[] = [];
    const runner = captureQueries(queries);

    await new CreateCoreSchema1721030000000().up(runner);

    expect(queries.join('\n')).toContain('CREATE TABLE `users`');
    expect(queries.join('\n')).toContain('IDX_users_parent_role');
    expect(queries.join('\n')).toContain('FK_users_parent');
  });

  it('creates every reviewed learning relation, index, and constraint', async () => {
    const queries: string[] = [];
    await new CreateLearningSchema1721040000000().up(captureQueries(queries));
    const sql = queries.join('\n');

    for (const required of [
      'FK_progress_child',
      'FK_rewards_child',
      'FK_activities_level',
      'FK_questions_quiz',
      'UQ_progress_child_level_activity',
      'UQ_rewards_child_achievement',
      'IDX_activities_level_position',
      'IDX_questions_quiz_position',
    ]) {
      expect(sql).toContain(required);
    }
  });

  it('drops learning tables in reverse dependency order', async () => {
    const queries: string[] = [];
    await new CreateLearningSchema1721040000000().down(captureQueries(queries));
    expect(queries[0]).toBe('DROP TABLE `rewards`');
    expect(queries.at(-1)).toBe('DROP TABLE `levels`');
  });

  it('adds and safely removes the level prerequisite relation', async () => {
    const queries: string[] = [];
    const migration = new AddLevelPrerequisite1721050000000();
    await migration.up(captureQueries(queries));
    expect(queries.join('\n')).toContain('FK_levels_prerequisite');
    queries.length = 0;
    await migration.down(captureQueries(queries));
    expect(queries[0]).toContain('DROP FOREIGN KEY');
  });

  it('persists quiz submissions with ownership and retry numbering', async () => {
    const queries: string[] = [];
    await new CreateQuizAttempts1721060000000().up(captureQueries(queries));
    const sql = queries.join('\n');
    expect(sql).toContain('UQ_quiz_attempt_child_quiz_number');
    expect(sql).toContain('FK_quiz_attempt_child');
    expect(sql).toContain('FK_quiz_attempt_quiz');
  });
});

function captureQueries(queries: string[]): QueryRunner {
  return {
    query: jest.fn((sql: string) => {
      queries.push(sql);
      return Promise.resolve(undefined);
    }),
  } as unknown as QueryRunner;
}
