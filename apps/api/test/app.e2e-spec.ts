import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AdminController } from '../src/admin/admin.controller';
import { AdminService } from '../src/admin/admin.service';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { JwtTokenService } from '../src/auth/jwt-token.service';
import { RolesGuard } from '../src/auth/roles.guard';
import { Role } from '../src/users/entities/user.entity';
import { ParentsController } from '../src/parents/parents.controller';
import { ParentsService } from '../src/parents/parents.service';

describe('core user flows (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const authService = {
      registerParent: jest.fn((input: { email: string }) => ({
        user: { id: 7, email: input.email.toLowerCase(), role: Role.PARENT },
        accessToken: 'parent-token',
        refreshToken: 'parent-refresh',
        redirectTo: '/parent-dashboard',
      })),
      login: jest.fn(() => ({
        user: { id: 7, email: 'parent@example.com', role: Role.PARENT },
        accessToken: 'parent-token',
        refreshToken: 'parent-refresh',
        redirectTo: '/parent-dashboard',
      })),
    };
    const parentsService = {
      createChild: jest.fn((parentId: number, input: { nickname: string }) => ({
        id: 20,
        role: Role.KID,
        parentId,
        nickname: input.nickname,
      })),
      openKidsMode: jest.fn(() => ({
        child: { id: 20, nickname: 'Mina' },
        accessToken: 'kid-token',
        refreshToken: 'kid-refresh',
        redirectTo: '/kids-panel/20',
      })),
    };
    const adminService = {
      getOverview: jest.fn(() => ({
        totals: { users: 3, parents: 1, children: 1, admins: 1 },
      })),
    };
    const tokenService = {
      verifyAccessToken: jest.fn((token: string) => {
        const users = {
          'parent-token': { sub: 7, role: Role.PARENT, type: 'access' },
          'kid-token': {
            sub: 20,
            role: Role.KID,
            type: 'access',
            parentId: 7,
          },
          'admin-token': { sub: 1, role: Role.ADMIN, type: 'access' },
        } as const;
        const user = users[token as keyof typeof users];
        if (!user) throw new Error('Invalid token');
        return user;
      }),
    };

    const module = await Test.createTestingModule({
      controllers: [AuthController, ParentsController, AdminController],
      providers: [
        Reflector,
        JwtAuthGuard,
        RolesGuard,
        { provide: AuthService, useValue: authService },
        { provide: ParentsService, useValue: parentsService },
        { provide: AdminService, useValue: adminService },
        { provide: JwtTokenService, useValue: tokenService },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => app.close());

  it('registers and logs in a parent through validated HTTP contracts', async () => {
    const registration = await request(app.getHttpServer())
      .post('/auth/register-parent')
      .send({
        email: 'Parent@Example.com',
        password: 'Strong123',
        confirmPassword: 'Strong123',
      })
      .expect(201);
    expect((registration.body as { accessToken: string }).accessToken).toBe(
      'parent-token',
    );

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'parent@example.com', password: 'Strong123' })
      .expect(200);
    expect((login.body as { redirectTo: string }).redirectTo).toBe(
      '/parent-dashboard',
    );
  });

  it('creates a child and starts Kids Mode as its parent', async () => {
    const child = await request(app.getHttpServer())
      .post('/parents/children')
      .set('Authorization', 'Bearer parent-token')
      .send({
        nickname: 'Mina',
        avatar: 'robot-blue',
        birthYear: 2016,
      })
      .expect(201);
    expect(child.body).toMatchObject({ id: 20, parentId: 7, role: Role.KID });

    const kidsMode = await request(app.getHttpServer())
      .post('/parents/children/20/kids-mode')
      .set('Authorization', 'Bearer parent-token')
      .expect(201);
    expect((kidsMode.body as { accessToken: string }).accessToken).toBe(
      'kid-token',
    );
  });

  it('blocks a child session from Parent and Admin routes', async () => {
    await request(app.getHttpServer())
      .get('/parents/dashboard')
      .set('Authorization', 'Bearer kid-token')
      .expect(403);
    await request(app.getHttpServer())
      .get('/admin')
      .set('Authorization', 'Bearer kid-token')
      .expect(403);
  });

  it('allows only an administrator session into Admin routes', async () => {
    await request(app.getHttpServer())
      .get('/admin')
      .set('Authorization', 'Bearer parent-token')
      .expect(403);
    const response = await request(app.getHttpServer())
      .get('/admin')
      .set('Authorization', 'Bearer admin-token')
      .expect(200);
    expect(
      (response.body as { totals: { admins: number } }).totals.admins,
    ).toBe(1);
  });
});
