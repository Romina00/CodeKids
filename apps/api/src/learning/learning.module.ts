import { Module } from '@nestjs/common';
import { LevelsController } from './controllers/levels.controller';
import { ProgressController } from './controllers/progress.controller';
import { QuizController } from './controllers/quiz.controller';
import { RewardsController } from './controllers/rewards.controller';
import { LevelsService } from './services/levels.service';
import { ProgressService } from './services/progress.service';
import { QuizService } from './services/quiz.service';
import { RewardsService } from './services/rewards.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [
    LevelsController,
    QuizController,
    ProgressController,
    RewardsController,
  ],
  providers: [LevelsService, QuizService, ProgressService, RewardsService],
})
export class LearningModule {}
