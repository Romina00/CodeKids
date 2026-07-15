import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLearningSchema1721040000000 implements MigrationInterface {
  name = 'CreateLearningSchema1721040000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `levels` (`id` int NOT NULL AUTO_INCREMENT, `slug` varchar(120) NOT NULL, `title` varchar(120) NOT NULL, `description` text NULL, `position` int NOT NULL DEFAULT 0, `published` tinyint NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `UQ_levels_slug` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      "CREATE TABLE `activities` (`id` int NOT NULL AUTO_INCREMENT, `levelId` int NOT NULL, `title` varchar(120) NOT NULL, `description` text NULL, `type` enum ('LESSON','BLOCKLY','CHALLENGE') NOT NULL, `content` text NULL, `position` int NOT NULL DEFAULT 0, `estimatedMinutes` int NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX `IDX_activities_level` (`levelId`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'CREATE TABLE `quizzes` (`id` int NOT NULL AUTO_INCREMENT, `levelId` int NOT NULL, `title` varchar(120) NOT NULL, `passingScore` int NOT NULL DEFAULT 70, `maxAttempts` int NULL, `published` tinyint NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX `IDX_quizzes_level` (`levelId`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      "CREATE TABLE `questions` (`id` int NOT NULL AUTO_INCREMENT, `quizId` int NOT NULL, `prompt` text NOT NULL, `type` enum ('SINGLE_CHOICE','MULTIPLE_CHOICE') NOT NULL, `options` text NOT NULL, `correctAnswers` text NOT NULL, `explanation` text NULL, `position` int NOT NULL DEFAULT 0, `points` int NOT NULL DEFAULT 1, INDEX `IDX_questions_quiz` (`quizId`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'CREATE TABLE `achievements` (`id` int NOT NULL AUTO_INCREMENT, `code` varchar(80) NOT NULL, `title` varchar(120) NOT NULL, `description` varchar(255) NOT NULL, `icon` varchar(120) NULL, `criteria` text NOT NULL, `points` int NOT NULL DEFAULT 0, `active` tinyint NOT NULL DEFAULT 1, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `UQ_achievements_code` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      "CREATE TABLE `progress` (`id` int NOT NULL AUTO_INCREMENT, `childId` int NOT NULL, `levelId` int NOT NULL, `activityId` int NULL, `status` enum ('NOT_STARTED','IN_PROGRESS','COMPLETED') NOT NULL DEFAULT 'NOT_STARTED', `completed` tinyint NOT NULL DEFAULT 0, `score` int NOT NULL DEFAULT 0, `timeSpentMinutes` int NOT NULL DEFAULT 0, `attempts` int NOT NULL DEFAULT 0, `startedAt` datetime NULL, `completedAt` datetime NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX `IDX_progress_child_level` (`childId`,`levelId`), INDEX `IDX_progress_activity` (`activityId`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'CREATE TABLE `rewards` (`id` int NOT NULL AUTO_INCREMENT, `childId` int NOT NULL, `achievementId` int NULL, `title` varchar(120) NOT NULL, `description` varchar(255) NULL, `metadata` text NULL, `earnedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX `IDX_rewards_child` (`childId`), INDEX `IDX_rewards_achievement` (`achievementId`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `activities` ADD CONSTRAINT `FK_activities_level` FOREIGN KEY (`levelId`) REFERENCES `levels`(`id`) ON DELETE CASCADE',
    );
    await queryRunner.query(
      'ALTER TABLE `quizzes` ADD CONSTRAINT `FK_quizzes_level` FOREIGN KEY (`levelId`) REFERENCES `levels`(`id`) ON DELETE CASCADE',
    );
    await queryRunner.query(
      'ALTER TABLE `questions` ADD CONSTRAINT `FK_questions_quiz` FOREIGN KEY (`quizId`) REFERENCES `quizzes`(`id`) ON DELETE CASCADE',
    );
    await queryRunner.query(
      'ALTER TABLE `progress` ADD CONSTRAINT `FK_progress_child` FOREIGN KEY (`childId`) REFERENCES `users`(`id`) ON DELETE CASCADE',
    );
    await queryRunner.query(
      'ALTER TABLE `progress` ADD CONSTRAINT `FK_progress_level` FOREIGN KEY (`levelId`) REFERENCES `levels`(`id`) ON DELETE CASCADE',
    );
    await queryRunner.query(
      'ALTER TABLE `progress` ADD CONSTRAINT `FK_progress_activity` FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON DELETE SET NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `rewards` ADD CONSTRAINT `FK_rewards_child` FOREIGN KEY (`childId`) REFERENCES `users`(`id`) ON DELETE CASCADE',
    );
    await queryRunner.query(
      'ALTER TABLE `rewards` ADD CONSTRAINT `FK_rewards_achievement` FOREIGN KEY (`achievementId`) REFERENCES `achievements`(`id`) ON DELETE SET NULL',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `rewards`');
    await queryRunner.query('DROP TABLE `progress`');
    await queryRunner.query('DROP TABLE `achievements`');
    await queryRunner.query('DROP TABLE `questions`');
    await queryRunner.query('DROP TABLE `quizzes`');
    await queryRunner.query('DROP TABLE `activities`');
    await queryRunner.query('DROP TABLE `levels`');
  }
}
