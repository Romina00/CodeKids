import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProgressResumeData1721080000000 implements MigrationInterface {
  name = 'AddProgressResumeData1721080000000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `progress` ADD `resumeData` text NULL',
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `progress` DROP COLUMN `resumeData`');
  }
}
