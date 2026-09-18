// For existing databases created with DB_SYNCHRONIZE instead of migrations.
import mysql from 'mysql2/promise';
import type { RowDataPacket } from 'mysql2/promise';
import {
  RemoveUnusedTables1721130000000,
  unusedTables,
} from './migrations/1721130000000-remove-unused-tables';

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? 'code_kids',
    connectTimeout: 10000,
  });
  try {
    await new RemoveUnusedTables1721130000000().up({
      query: (sql) => connection.query(sql),
    });
    const [remaining] = await connection.query<RowDataPacket[]>(
      'SELECT TABLE_NAME AS name FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN (?)',
      [unusedTables],
    );
    if (remaining.length) throw new Error('Some unused tables still exist.');
    process.stdout.write(
      'Removed the 7 unused tables. Retained tables and columns were not changed.\n',
    );
  } finally {
    await connection.end();
  }
}
void main().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : 'Could not clean the database.'}\n`,
  );
  process.exitCode = 1;
});
