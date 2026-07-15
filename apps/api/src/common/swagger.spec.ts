import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AdminController } from '../admin/admin.controller';
import { AdminService } from '../admin/admin.service';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { LevelsController } from '../learning/controllers/levels.controller';
import { ProgressController } from '../learning/controllers/progress.controller';
import { QuizController } from '../learning/controllers/quiz.controller';
import { RewardsController } from '../learning/controllers/rewards.controller';
import { BlocklyController } from '../learning/controllers/blockly.controller';
import { LevelsService } from '../learning/services/levels.service';
import { ProgressService } from '../learning/services/progress.service';
import { QuizService } from '../learning/services/quiz.service';
import { RewardsService } from '../learning/services/rewards.service';
import { BlocklyService } from '../learning/services/blockly.service';
import { ParentsController } from '../parents/parents.controller';
import { ParentsService } from '../parents/parents.service';
import { UploadController } from '../upload/upload.controller';
import { UploadService } from '../upload/upload.service';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';

describe('Swagger contract', () => {
  let app: INestApplication;
  let document: OpenAPIObject;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [
        AuthController,
        ParentsController,
        AdminController,
        UsersController,
        LevelsController,
        ProgressController,
        QuizController,
        RewardsController,
        BlocklyController,
        UploadController,
      ],
      providers: [
        AuthService,
        ParentsService,
        AdminService,
        UsersService,
        LevelsService,
        ProgressService,
        QuizService,
        RewardsService,
        BlocklyService,
        UploadService,
      ].map((provide) => ({ provide, useValue: {} })),
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();
    app = module.createNestApplication();
    document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('CodeKids API').addBearerAuth().build(),
    );
  });

  afterAll(async () => app?.close());

  it('documents every implemented controller endpoint', () => {
    expect(Object.keys(document.paths).sort()).toEqual(
      [
        '/admin',
        '/auth/kid-request',
        '/auth/login',
        '/auth/logout',
        '/auth/me',
        '/auth/parent-mode',
        '/auth/refresh',
        '/auth/register-parent',
        '/learning/levels',
        '/learning/blockly/{activityId}/workspace',
        '/learning/levels/{levelId}',
        '/learning/levels/{levelId}/activities',
        '/learning/levels/{levelId}/activities/{activityId}',
        '/learning/progress',
        '/learning/progress/summary',
        '/learning/quizzes',
        '/learning/quizzes/{quizId}',
        '/learning/quizzes/{quizId}/questions',
        '/learning/quizzes/{quizId}/questions/{questionId}',
        '/learning/quizzes/{quizId}/submissions',
        '/learning/rewards',
        '/learning/rewards/summary',
        '/parents/account/password',
        '/parents/account/profile',
        '/parents/children',
        '/parents/children/{childId}',
        '/parents/children/{childId}/kids-mode',
        '/parents/dashboard',
        '/upload/avatars',
        '/upload/avatars/defaults',
        '/upload/avatars/{fileName}',
        '/users',
      ].sort(),
    );
  });

  it('publishes request, success, error, and bearer-security contracts', () => {
    const register = document.paths['/auth/register-parent']?.post;
    expect(register?.requestBody).toBeDefined();
    expect(register?.responses['201']).toBeDefined();
    expect(register?.responses['400']).toBeDefined();

    const parentDashboard = document.paths['/parents/dashboard']?.get;
    expect(parentDashboard?.responses['200']).toBeDefined();
    expect(parentDashboard?.responses['401']).toBeDefined();
    expect(parentDashboard?.security).toEqual([{ bearer: [] }]);
  });

  it('groups endpoints by audience and domain', () => {
    expect(document.paths['/auth/login']?.post?.tags).toContain(
      'Authentication',
    );
    expect(document.paths['/parents/dashboard']?.get?.tags).toContain(
      'Parents',
    );
    expect(document.paths['/admin']?.get?.tags).toContain('Administration');
    expect(document.paths['/learning/levels']?.post?.tags).toContain(
      'Learning - Levels',
    );
    expect(document.paths['/upload/avatars']?.post?.tags).toContain('Uploads');
  });
});
