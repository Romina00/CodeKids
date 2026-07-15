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
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { Activity } from './entities/activity.entity';
import { Level } from './entities/level.entity';
import { Progress } from './entities/progress.entity';
import { Question } from './entities/question.entity';
import { Quiz } from './entities/quiz.entity';
import { Reward } from './entities/reward.entity';
import { QuizAttempt } from './entities/quiz-attempt.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Level,
      Activity,
      Quiz,
      Question,
      Progress,
      Achievement,
      Reward,
      QuizAttempt,
    ]),
  ],
  controllers: [
    LevelsController,
    QuizController,
    ProgressController,
    RewardsController,
  ],
  providers: [LevelsService, QuizService, ProgressService, RewardsService],
})
export class LearningModule {}
