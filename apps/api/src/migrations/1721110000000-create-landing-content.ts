import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateLandingContent1721110000000 implements MigrationInterface {
  name = 'CreateLandingContent1721110000000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `landing_content` (`id` int NOT NULL AUTO_INCREMENT, `key` varchar(120) NOT NULL, `title` varchar(120) NOT NULL, `content` text NOT NULL, `position` int NOT NULL DEFAULT 0, `published` tinyint NOT NULL DEFAULT 0, `version` int NOT NULL DEFAULT 1, `updatedByAdminId` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `UQ_landing_content_key` (`key`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `landing_content`');
  }
}
