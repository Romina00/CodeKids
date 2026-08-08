import { DataSource } from 'typeorm';
import { Invitation } from './auth/entities/invitation.entity';
import { Achievement } from './learning/entities/achievement.entity';
import { Activity } from './learning/entities/activity.entity';
import { Level } from './learning/entities/level.entity';
import { Progress } from './learning/entities/progress.entity';
import { Question } from './learning/entities/question.entity';
import { Quiz } from './learning/entities/quiz.entity';
import { QuizAttempt } from './learning/entities/quiz-attempt.entity';
import { BlocklyWorkspace } from './learning/entities/blockly-workspace.entity';
import { XpEvent } from './learning/entities/xp-event.entity';
import { Reward } from './learning/entities/reward.entity';
import { CreateCoreSchema1721030000000 } from './migrations/1721030000000-create-core-schema';
import { CreateLearningSchema1721040000000 } from './migrations/1721040000000-create-learning-schema';
import { AddLevelPrerequisite1721050000000 } from './migrations/1721050000000-add-level-prerequisite';
import { CreateQuizAttempts1721060000000 } from './migrations/1721060000000-create-quiz-attempts';
import { CreateBlocklyWorkspaces1721070000000 } from './migrations/1721070000000-create-blockly-workspaces';
import { AddProgressResumeData1721080000000 } from './migrations/1721080000000-add-progress-resume-data';
import { CreateXpEvents1721090000000 } from './migrations/1721090000000-create-xp-events';
import { AddAdminUserControls1721100000000 } from './migrations/1721100000000-add-admin-user-controls';
import { AdminAuditEvent } from './admin/admin-audit.entity';
import { LandingContent } from './admin/landing-content.entity';
import { CreateLandingContent1721110000000 } from './migrations/1721110000000-create-landing-content';
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
    QuizAttempt,
    BlocklyWorkspace,
    XpEvent,
    AdminAuditEvent,
    LandingContent,
    Question,
    Progress,
    Achievement,
    Reward,
  ],
  migrations: [
    CreateCoreSchema1721030000000,
    CreateLearningSchema1721040000000,
    AddLevelPrerequisite1721050000000,
    CreateQuizAttempts1721060000000,
    CreateBlocklyWorkspaces1721070000000,
    AddProgressResumeData1721080000000,
    CreateXpEvents1721090000000,
    AddAdminUserControls1721100000000,
    CreateLandingContent1721110000000,
  ],
});
