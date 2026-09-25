import dataSource from './data-source';
import { repairAdminSchema } from './admin/admin-schema';

async function repairSchema() {
  await dataSource.initialize();
  const queryRunner = dataSource.createQueryRunner();
  try {
    const addedColumns = await repairAdminSchema(queryRunner);
    process.stdout.write(
      addedColumns.length
        ? `Added administrator columns: ${addedColumns.join(', ')}.\n`
        : 'Administrator columns are already present.\n',
    );
  } finally {
    await queryRunner.release();
    await dataSource.destroy();
  }
}

void repairSchema().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : 'Could not repair administrator columns.'}\n`,
  );
  process.exitCode = 1;
});
