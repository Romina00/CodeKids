import { BadRequestException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { Role, User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AdminService } from './admin.service';

describe('AdminService user controls', () => {
  let users: jest.Mocked<Repository<User>>;
  let userService: jest.Mocked<UsersService>;
  let service: AdminService;

  beforeEach(() => {
    users = repositoryMock<User>();
    userService = {
      serializeUser: jest.fn((user: User) => ({
        id: user.id,
        role: user.role,
      })),
    } as unknown as jest.Mocked<UsersService>;
    service = new AdminService(userService, users);
    users.save.mockImplementation((value) => Promise.resolve(value as User));
  });

  it('blocks a target, revokes refresh access, and persists account status', async () => {
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
    await expect(service.initiateRecovery(20)).resolves.toEqual({
      accepted: true,
      message: 'If delivery is configured, recovery instructions will be sent.',
    });
    expect(users.save.mock.calls[0]?.[0]).toMatchObject({
      refreshTokenHash: null,
    });
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
