import type { MigrationInterface } from 'typeorm';

export const unusedTables = [
  'quiz_attempts',
  'questions',
  'quizzes',
  'blockly_workspaces',
  'invitations',
  'admin_audit_events',
  'landing_content',
] as const;

export class RemoveUnusedTables1721130000000 implements MigrationInterface {
  async up(queryRunner: {
    query(sql: string): Promise<unknown>;
  }): Promise<void> {
    // Drop dependent tables first; leave all retained tables and columns intact.
    for (const table of unusedTables) {
      await queryRunner.query(`DROP TABLE IF EXISTS \`${table}\``);
    }
  }

  down(): Promise<void> {
    return Promise.reject(
      new Error(
        'Deleted table data cannot be restored by a migration. Restore a database backup to roll back this cleanup.',
      ),
    );
  }
}
