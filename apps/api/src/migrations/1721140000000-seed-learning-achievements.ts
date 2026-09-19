import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedLearningAchievements1721140000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const milestones = [
      { count: 1, title: 'First coding steps' },
      { count: 5, title: 'Coding explorer' },
      { count: 10, title: 'Creative coder' },
      { count: 15, title: 'Coding adventurer' },
    ];

    for (const milestone of milestones) {
      const code = `activities-completed-${milestone.count}`;
      const description = `Completed ${milestone.count} coding activities. Keep exploring!`;
      const criteria = JSON.stringify({
        eventType: 'ACTIVITY_COMPLETED',
        minCount: milestone.count,
      });
      await queryRunner.query(
        'INSERT INTO achievements (code, title, description, criteria, points, active) VALUES (?, ?, ?, ?, 0, 1) ON DUPLICATE KEY UPDATE code = VALUES(code)',
        [code, milestone.title, description, criteria],
      );

      // Award existing learners too, without adding XP or duplicate badges.
      await queryRunner.query(
        `INSERT INTO rewards (childId, achievementId, title, description, metadata)
         SELECT earned.childId, a.id, a.title, a.description, JSON_OBJECT('code', a.code, 'points', a.points)
         FROM achievements a
         JOIN (SELECT childId FROM xp_events WHERE type = 'ACTIVITY_COMPLETED'
               GROUP BY childId HAVING COUNT(*) >= ?) earned ON 1 = 1
         WHERE a.code = ? AND a.active = 1
         AND NOT EXISTS (SELECT 1 FROM rewards r WHERE r.childId = earned.childId AND r.achievementId = a.id)`,
        [milestone.count, code],
      );
    }
  }

  async down(): Promise<void> {
    // Keep earned achievements when rolling back code.
  }
}
