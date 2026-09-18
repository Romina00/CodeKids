import { MigrationInterface, QueryRunner } from 'typeorm';

// Each built-in game has one activity and uses the existing progress API.
export class SeedGameLevels1721120000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const titles = [
      'Tom & Jerry',
      'Pizza order',
      'Treasure loop',
      'True or false',
      'If adventure',
      'Secret gates',
      'Coin count',
      'Data types',
      'Robot Cleaner',
      'Garden Builder',
      'Connect the Path',
      'Mission Planner',
      'Build a Castle',
      'Wizard Spells',
      'Mini Game',
    ];
    let prerequisiteId: number | null = null;
    for (const [index, title] of titles.entries()) {
      const position = index + 1;
      const slug = `game-gl${position}`;
      await queryRunner.query(
        'INSERT INTO levels (slug, title, position, published, prerequisiteLevelId) VALUES (?, ?, ?, 1, ?) ON DUPLICATE KEY UPDATE slug = VALUES(slug)',
        [slug, title, position, prerequisiteId],
      );
      const levels = (await queryRunner.query(
        'SELECT id FROM levels WHERE slug = ?',
        [slug],
      )) as { id: number }[];
      const levelId = levels[0]?.id;
      if (!levelId) throw new Error(`Could not create ${slug}.`);
      const content = JSON.stringify({ game: `gl${position}` });
      await queryRunner.query(
        "INSERT INTO activities (levelId, title, type, content, position, estimatedMinutes) SELECT ?, ?, 'CHALLENGE', ?, 1, 5 WHERE NOT EXISTS (SELECT 1 FROM activities WHERE levelId = ? AND content = ?)",
        [levelId, title, content, levelId, content],
      );
      prerequisiteId = levelId;
    }
  }

  async down(): Promise<void> {
    // Keep learning content and children's progress when rolling back code.
  }
}
