import { BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Invitation } from '../auth/entities/invitation.entity';
import { Progress } from '../learning/entities/progress.entity';
import { Reward } from '../learning/entities/reward.entity';
import { Role, User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService parent registration', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    usersRepository = {
      findOne: jest.fn(),
      create: jest.fn((value) => value as User),
      save: jest.fn((value) => Promise.resolve(value as User)),
    } as unknown as jest.Mocked<Repository<User>>;
    service = new UsersService(
      usersRepository,
      {} as Repository<Invitation>,
      {} as Repository<Progress>,
      {} as Repository<Reward>,
    );
  });

  it('normalizes a unique email and stores a bcrypt hash', async () => {
    usersRepository.findOne.mockResolvedValue(null);

    const user = await service.createParent({
      email: ' Parent@Example.com ',
      password: 'Strong123',
    });

    expect(usersRepository.findOne.mock.calls[0]?.[0]).toEqual({
      where: { email: 'parent@example.com' },
    });
    expect(user).toMatchObject({
      email: 'parent@example.com',
      role: Role.PARENT,
      displayName: 'parent',
    });
    expect(user.passwordHash).not.toBe('Strong123');
    await expect(bcrypt.compare('Strong123', user.passwordHash!)).resolves.toBe(
      true,
    );
  });

  it('rejects a duplicate normalized email', async () => {
    usersRepository.findOne.mockResolvedValue({ id: 1 } as User);

    await expect(
      service.createParent({
        email: 'PARENT@example.com',
        password: 'Strong123',
      }),
    ).rejects.toThrow(
      new ConflictException('Email address is already registered.'),
    );
  });

  it('enforces the server-side password policy', async () => {
    await expect(
      service.createParent({
        email: 'parent@example.com',
        password: 'weakpass',
      }),
    ).rejects.toThrow(BadRequestException);
    expect(usersRepository.save.mock.calls).toHaveLength(0);
  });
});
