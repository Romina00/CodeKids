import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AdminAuditEvent } from './admin-audit.entity';
import { LandingContent } from './landing-content.entity';
import { LandingController } from './landing.controller';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([User, AdminAuditEvent, LandingContent]),
  ],
  controllers: [AdminController, LandingController],
  providers: [AdminService],
})
export class AdminModule {}
