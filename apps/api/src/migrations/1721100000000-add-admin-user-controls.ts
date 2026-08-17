import { MigrationInterface, QueryRunner } from 'typeorm';
export class AddAdminUserControls1721100000000 implements MigrationInterface {
  name = 'AddAdminUserControls1721100000000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `users` ADD `blockedAt` datetime NULL, ADD `blockedReason` varchar(255) NULL, ADD `recoveryRequestedAt` datetime NULL',
    );
    await queryRunner.query(
      'CREATE TABLE `admin_audit_events` (`id` int NOT NULL AUTO_INCREMENT, `actorAdminId` int NOT NULL, `targetUserId` int NOT NULL, `action` varchar(80) NOT NULL, `metadata` text NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX `IDX_admin_audit_target_created` (`targetUserId`,`createdAt`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `admin_audit_events`');
    await queryRunner.query(
      'ALTER TABLE `users` DROP COLUMN `recoveryRequestedAt`, DROP COLUMN `blockedReason`, DROP COLUMN `blockedAt`',
    );
  }
}
