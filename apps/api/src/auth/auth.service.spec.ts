import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role, User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Invitation } from './entities/invitation.entity';
import { JwtTokenService } from './jwt-token.service';
import { Repository } from 'typeorm';

jest.mock('bcrypt', () => ({
  ...jest.requireActual<typeof import('bcrypt')>('bcrypt'),
  compare: jest.fn(),
}));

const comparePassword = bcrypt.compare as jest.MockedFunction<
  typeof bcrypt.compare
>;

describe('AuthService', () => {
  const parent = {
    id: 7,
    role: Role.PARENT,
    email: 'parent@example.com',
    passwordHash: 'stored-hash',
    parentId: null,
    nickname: null,
  } as User;
  let service: AuthService;
  let users: jest.Mocked<UsersService>;
  let tokens: jest.Mocked<JwtTokenService>;
  let invitations: jest.Mocked<Repository<Invitation>>;

  beforeEach(() => {
    comparePassword.mockReset();
    users = {
      createParent: jest.fn(),
      findByEmail: jest.fn(),
      serializeUser: jest.fn().mockReturnValue({ id: 7, role: Role.PARENT }),
      setRefreshToken: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;
    tokens = {
      signAccessToken: jest.fn().mockReturnValue('access-token'),
      signRefreshToken: jest.fn().mockReturnValue('refresh-token'),
      getAccessTokenTtl: jest.fn().mockReturnValue(900),
      getRefreshTokenTtl: jest.fn().mockReturnValue(604800),
    } as unknown as jest.Mocked<JwtTokenService>;
    invitations = {
      findOne: jest.fn().mockResolvedValue(null),
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn((value) => value as Invitation),
      save: jest.fn((value) =>
        Promise.resolve({ id: 11, ...value } as Invitation),
      ),
    } as unknown as jest.Mocked<Repository<Invitation>>;
    service = new AuthService(users, tokens, invitations);
  });

  it('registers a parent and persists a refresh session', async () => {
    users.createParent.mockResolvedValue(parent);

    const result = await service.registerParent({
      email: ' Parent@Example.com ',
      password: 'Strong123',
      confirmPassword: 'Strong123',
    });

    expect(users.createParent.mock.calls[0]?.[0]).toEqual({
      email: ' Parent@Example.com ',
      password: 'Strong123',
    });
    expect(users.setRefreshToken.mock.calls).toContainEqual([
      7,
      'refresh-token',
    ]);
    expect(result).toMatchObject({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      redirectTo: '/parent-dashboard',
    });
  });

  it('rejects mismatched registration passwords before creating a user', async () => {
    await expect(
      service.registerParent({
        email: 'parent@example.com',
        password: 'Strong123',
        confirmPassword: 'Different123',
      }),
    ).rejects.toThrow(new BadRequestException('Passwords do not match.'));
    expect(users.createParent.mock.calls).toHaveLength(0);
  });

  it('returns one generic error for an unknown email or wrong password', async () => {
    users.findByEmail.mockResolvedValueOnce(null).mockResolvedValueOnce(parent);
    comparePassword.mockResolvedValueOnce(false as never);

    for (const email of ['missing@example.com', 'parent@example.com']) {
      await expect(
        service.login({ email, password: 'Wrong123' }),
      ).rejects.toThrow(
        new UnauthorizedException('Invalid email or password.'),
      );
    }
  });

  it('logs in a parent with a valid bcrypt password', async () => {
    users.findByEmail.mockResolvedValue(parent);
    comparePassword.mockResolvedValue(true as never);

    const result = await service.login({
      email: parent.email!,
      password: 'Strong123',
    });

    expect(result.redirectTo).toBe('/parent-dashboard');
    expect(users.setRefreshToken.mock.calls).toContainEqual([
      7,
      'refresh-token',
    ]);
  });

  it('creates a seven-day invitation and an email delivery simulation', async () => {
    const before = Date.now();

    const result = await service.requestChildInvitation({
      parentEmail: ' Parent@Example.com ',
    });

    const created = invitations.create.mock.calls[0]?.[0];
    expect(created?.parentEmail).toBe('parent@example.com');
    expect(created?.token).toMatch(/^[a-f0-9]{48}$/);
    expect((created?.expiresAt as Date).getTime()).toBeGreaterThanOrEqual(
      before + 7 * 24 * 60 * 60 * 1000,
    );
    expect(result.emailPreview).toMatchObject({
      ctaLabel: 'Create Child Account',
      invitationToken: created?.token,
    });
  });

  it('rate-limits repeated invitation requests during the cooldown', async () => {
    invitations.findOne.mockResolvedValue({ id: 1 } as Invitation);

    await expect(
      service.requestChildInvitation({ parentEmail: 'parent@example.com' }),
    ).rejects.toMatchObject({ status: 429 });
    expect(invitations.save.mock.calls).toHaveLength(0);
  });

  it('caps invitation requests at three per rolling day', async () => {
    invitations.count.mockResolvedValue(3);

    await expect(
      service.requestChildInvitation({ parentEmail: 'parent@example.com' }),
    ).rejects.toMatchObject({ status: 429 });
    expect(invitations.save.mock.calls).toHaveLength(0);
  });
});
