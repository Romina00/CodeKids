import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLevelPrerequisite1721050000000 implements MigrationInterface {
  name = 'AddLevelPrerequisite1721050000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `levels` ADD `prerequisiteLevelId` int NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `levels` ADD CONSTRAINT `FK_levels_prerequisite` FOREIGN KEY (`prerequisiteLevelId`) REFERENCES `levels`(`id`) ON DELETE SET NULL',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `levels` DROP FOREIGN KEY `FK_levels_prerequisite`',
    );
    await queryRunner.query(
      'ALTER TABLE `levels` DROP COLUMN `prerequisiteLevelId`',
    );
  }
}
