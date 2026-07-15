import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuizAttempts1721060000000 implements MigrationInterface {
  name = 'CreateQuizAttempts1721060000000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `quiz_attempts` (`id` int NOT NULL AUTO_INCREMENT, `childId` int NOT NULL, `quizId` int NOT NULL, `attemptNumber` int NOT NULL, `score` int NOT NULL, `passed` tinyint NOT NULL, `answers` text NOT NULL, `submittedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `UQ_quiz_attempt_child_quiz_number` (`childId`,`quizId`,`attemptNumber`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `quiz_attempts` ADD CONSTRAINT `FK_quiz_attempt_child` FOREIGN KEY (`childId`) REFERENCES `users`(`id`) ON DELETE CASCADE',
    );
    await queryRunner.query(
      'ALTER TABLE `quiz_attempts` ADD CONSTRAINT `FK_quiz_attempt_quiz` FOREIGN KEY (`quizId`) REFERENCES `quizzes`(`id`) ON DELETE CASCADE',
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `quiz_attempts`');
  }
}
