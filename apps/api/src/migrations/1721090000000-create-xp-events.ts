import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateXpEvents1721090000000 implements MigrationInterface {
  name = 'CreateXpEvents1721090000000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `xp_events` (`id` int NOT NULL AUTO_INCREMENT, `childId` int NOT NULL, `type` enum ('ACTIVITY_COMPLETED','QUIZ_PASSED') NOT NULL, `sourceKey` varchar(160) NOT NULL, `amount` int NOT NULL, `metadata` text NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `UQ_xp_event_child_source` (`childId`,`sourceKey`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'ALTER TABLE `xp_events` ADD CONSTRAINT `FK_xp_event_child` FOREIGN KEY (`childId`) REFERENCES `users`(`id`) ON DELETE CASCADE',
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `xp_events`');
  }
}
