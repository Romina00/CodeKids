import dataSource from './data-source';
import { SeedGameLevels1721120000000 } from './migrations/1721120000000-seed-game-levels';

async function seedGames() {
  await dataSource.initialize();
  try {
    await dataSource.transaction(async (manager) => {
      if (!manager.queryRunner)
        throw new Error('Missing database transaction.');
      await new SeedGameLevels1721120000000().up(manager.queryRunner);
    });
  } finally {
    await dataSource.destroy();
  }
}

void seedGames().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : 'Could not seed games.'}\n`,
  );
  process.exitCode = 1;
});
