import { QueryRunner, TableColumn } from 'typeorm';

/** Repair legacy user tables without applying unrelated schema migrations. */
export async function repairAdminSchema(
  queryRunner: QueryRunner,
): Promise<string[]> {
  const usersTable = await queryRunner.getTable('users');
  if (!usersTable) {
    throw new Error(
      'The users table is missing. Initialize the database before repairing administrator columns.',
    );
  }

  const requiredColumns = [
    new TableColumn({ name: 'blockedAt', type: 'datetime', isNullable: true }),
    new TableColumn({
      name: 'blockedReason',
      type: 'varchar',
      length: '255',
      isNullable: true,
    }),
    new TableColumn({
      name: 'recoveryRequestedAt',
      type: 'datetime',
      isNullable: true,
    }),
  ];
  const missingColumns = requiredColumns.filter(
    (column) => !usersTable.findColumnByName(column.name),
  );
  if (missingColumns.length) {
    await queryRunner.addColumns(usersTable, missingColumns);
  }
  return missingColumns.map((column) => column.name);
}
