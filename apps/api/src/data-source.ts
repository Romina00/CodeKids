import { DataSource } from 'typeorm';
import { Invitation } from './auth/entities/invitation.entity';
import { Achievement } from './learning/entities/achievement.entity';
import { Activity } from './learning/entities/activity.entity';
import { Level } from './learning/entities/level.entity';
import { Progress } from './learning/entities/progress.entity';
import { Question } from './learning/entities/question.entity';
import { Quiz } from './learning/entities/quiz.entity';
import { Reward } from './learning/entities/reward.entity';
import { CreateCoreSchema1721030000000 } from './migrations/1721030000000-create-core-schema';
import { CreateLearningSchema1721040000000 } from './migrations/1721040000000-create-learning-schema';
import { User } from './users/entities/user.entity';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE ?? 'code_kids',
  synchronize: false,
  entities: [
    User,
    Invitation,
    Level,
    Activity,
    Quiz,
    Question,
    Progress,
    Achievement,
    Reward,
  ],
  migrations: [
    CreateCoreSchema1721030000000,
    CreateLearningSchema1721040000000,
  ],
});
