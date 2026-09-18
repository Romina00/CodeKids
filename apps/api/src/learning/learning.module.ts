import { Module } from '@nestjs/common';
import { LevelsController } from './controllers/levels.controller';
import { ProgressController } from './controllers/progress.controller';
import { RewardsController } from './controllers/rewards.controller';
import { LevelsService } from './services/levels.service';
import { ProgressService } from './services/progress.service';
import { RewardsService } from './services/rewards.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { Activity } from './entities/activity.entity';
import { Level } from './entities/level.entity';
import { Progress } from './entities/progress.entity';
import { Reward } from './entities/reward.entity';
import { XpEvent } from './entities/xp-event.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Level,
      Activity,
      Progress,
      Achievement,
      Reward,
      XpEvent,
    ]),
  ],
  controllers: [LevelsController, ProgressController, RewardsController],
  providers: [LevelsService, ProgressService, RewardsService],
})
export class LearningModule {}
