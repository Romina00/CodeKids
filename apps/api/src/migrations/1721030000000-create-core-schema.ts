import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCoreSchema1721030000000 implements MigrationInterface {
  name = 'CreateCoreSchema1721030000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `role` enum ('PARENT','KID','ADMIN') NOT NULL DEFAULT 'PARENT', `email` varchar(255) NULL, `passwordHash` varchar(255) NULL, `displayName` varchar(120) NULL, `refreshTokenHash` varchar(255) NULL, `parentId` int NULL, `nickname` varchar(50) NULL, `avatar` varchar(255) NULL, `birthYear` int NULL, `learningLevel` varchar(50) NULL, `lastKidsModeAt` datetime NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `UQ_users_email` (`email`), INDEX `IDX_users_parent_role` (`parentId`,`role`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `invitations` (`id` int NOT NULL AUTO_INCREMENT, `parentEmail` varchar(255) NOT NULL, `token` varchar(120) NOT NULL, `status` enum ('PENDING','ACCEPTED','EXPIRED') NOT NULL DEFAULT 'PENDING', `expiresAt` datetime NOT NULL, `acceptedAt` datetime NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `UQ_invitations_token` (`token`), INDEX `IDX_invitations_email_created` (`parentEmail`,`createdAt`), INDEX `IDX_invitations_status_expires` (`status`,`expiresAt`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'ALTER TABLE `users` ADD CONSTRAINT `FK_users_parent` FOREIGN KEY (`parentId`) REFERENCES `users`(`id`) ON DELETE CASCADE',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `users` DROP FOREIGN KEY `FK_users_parent`',
    );
    await queryRunner.query('DROP TABLE `invitations`');
    await queryRunner.query('DROP TABLE `users`');
  }
}
