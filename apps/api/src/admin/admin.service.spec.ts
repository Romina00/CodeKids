import { BadRequestException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { Role, User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AdminAuditEvent } from './admin-audit.entity';
import { AdminService } from './admin.service';
import { LandingContent } from './landing-content.entity';

describe('AdminService user controls', () => {
  let users: jest.Mocked<Repository<User>>;
  let audit: jest.Mocked<Repository<AdminAuditEvent>>;
  let userService: jest.Mocked<UsersService>;
  let service: AdminService;
  let landing: jest.Mocked<Repository<LandingContent>>;

  beforeEach(() => {
    users = repositoryMock<User>();
    audit = repositoryMock<AdminAuditEvent>();
    userService = {
      serializeUser: jest.fn((user: User) => ({
        id: user.id,
        role: user.role,
      })),
    } as unknown as jest.Mocked<UsersService>;
    landing = repositoryMock<LandingContent>();
    service = new AdminService(userService, users, audit, landing);
    users.save.mockImplementation((value) => Promise.resolve(value as User));
    audit.create.mockImplementation((value) => value as AdminAuditEvent);
    audit.save.mockImplementation((value) =>
      Promise.resolve({ id: 1, ...value } as AdminAuditEvent),
    );
  });

  it('blocks a target, revokes refresh access, and audits the actor', async () => {
    users.findOneBy.mockResolvedValue({
      id: 20,
      role: Role.PARENT,
      refreshTokenHash: 'active',
    } as User);
    await service.setBlocked(1, 20, true, 'Safety review');
    expect(users.save.mock.calls[0]?.[0]).toMatchObject({
      blockedReason: 'Safety review',
      refreshTokenHash: null,
    });
    expect(audit.create.mock.calls[0]?.[0]).toMatchObject({
      actorAdminId: 1,
      targetUserId: 20,
      action: 'ACCOUNT_BLOCKED',
    });
  });

  it('prevents an administrator from blocking their own account', async () => {
    await expect(service.setBlocked(1, 1, true)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('initiates parent recovery without returning a secret', async () => {
    users.findOneBy.mockResolvedValue({
      id: 20,
      role: Role.PARENT,
      email: 'parent@example.com',
      refreshTokenHash: 'active',
    } as User);
    await expect(service.initiateRecovery(1, 20)).resolves.toEqual({
      accepted: true,
      message: 'If delivery is configured, recovery instructions will be sent.',
    });
    expect(users.save.mock.calls[0]?.[0]).toMatchObject({
      refreshTokenHash: null,
    });
  });

  it('rejects a stale landing-content update version', async () => {
    landing.findOneBy.mockResolvedValue({
      id: 3,
      version: 2,
    } as LandingContent);
    await expect(
      service.updateContent(1, 3, { expectedVersion: 1 }),
    ).rejects.toThrow('changed; reload');
  });
});

function repositoryMock<T extends ObjectLiteral>(): jest.Mocked<Repository<T>> {
  return {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  } as unknown as jest.Mocked<Repository<T>>;
}
