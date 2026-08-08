import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ParentsController } from './parents.controller';
import { ParentsService } from './parents.service';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [ParentsController],
  providers: [ParentsService],
})
export class ParentsModule {}
