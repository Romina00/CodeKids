import { getMetadataArgsStorage } from 'typeorm';
import { Achievement } from './achievement.entity';
import { Activity } from './activity.entity';
import { Level } from './level.entity';
import { Progress } from './progress.entity';
import { Question } from './question.entity';
import { Quiz } from './quiz.entity';
import { QuizAttempt } from './quiz-attempt.entity';
import { BlocklyWorkspace } from './blockly-workspace.entity';
import { XpEvent } from './xp-event.entity';
import { Reward } from './reward.entity';

describe('learning entity schema', () => {
  const entities = [
    Level,
    Activity,
    Quiz,
    Question,
    Progress,
    Achievement,
    Reward,
    QuizAttempt,
    BlocklyWorkspace,
    XpEvent,
  ];

  it.each(entities)(
    '%s is registered as a TypeORM entity with a primary key',
    (entity) => {
      const storage = getMetadataArgsStorage();
      expect(storage.tables.some((table) => table.target === entity)).toBe(
        true,
      );
      expect(
        storage.generations.some((column) => column.target === entity),
      ).toBe(true);
    },
  );

  it('models the required ownership and learning relationships', () => {
    const relations = getMetadataArgsStorage().relations;
    const relationNames = relations.map((relation) => {
      const target =
        typeof relation.target === 'function'
          ? relation.target.name
          : relation.target;
      return `${target}.${relation.propertyName}`;
    });

    for (const required of [
      'Level.activities',
      'Level.quizzes',
      'Activity.level',
      'Quiz.questions',
      'Question.quiz',
      'Progress.child',
      'Progress.level',
      'Reward.child',
      'Reward.achievement',
      'Achievement.rewards',
    ]) {
      expect(relationNames).toContain(required);
    }
  });

  it('does not select quiz answer keys by default', () => {
    const answerColumn = getMetadataArgsStorage().columns.find(
      (column) =>
        column.target === Question && column.propertyName === 'correctAnswers',
    );
    expect(answerColumn?.options.select).toBe(false);
  });
});
