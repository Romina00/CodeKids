import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBlocklyWorkspaces1721070000000 implements MigrationInterface {
  name = 'CreateBlocklyWorkspaces1721070000000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `blockly_workspaces` (`id` int NOT NULL AUTO_INCREMENT, `childId` int NOT NULL, `activityId` int NOT NULL, `workspace` text NOT NULL, `revision` int NOT NULL DEFAULT 1, `completed` tinyint NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `UQ_blockly_workspace_child_activity` (`childId`,`activityId`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `blockly_workspaces` ADD CONSTRAINT `FK_blockly_workspace_child` FOREIGN KEY (`childId`) REFERENCES `users`(`id`) ON DELETE CASCADE',
    );
    await queryRunner.query(
      'ALTER TABLE `blockly_workspaces` ADD CONSTRAINT `FK_blockly_workspace_activity` FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON DELETE CASCADE',
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `blockly_workspaces`');
  }
}
