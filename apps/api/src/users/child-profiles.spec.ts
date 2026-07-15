import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Invitation } from '../auth/entities/invitation.entity';
import { Progress } from '../learning/entities/progress.entity';
import { Reward } from '../learning/entities/reward.entity';
import { Role, User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService child profiles', () => {
  const parent = {
    id: 10,
    role: Role.PARENT,
    email: 'parent@example.com',
  } as User;
  let service: UsersService;
  let users: jest.Mocked<Repository<User>>;
  let nextId: number;

  beforeEach(() => {
    nextId = 20;
    users = {
      findOne: jest.fn().mockResolvedValue(parent),
      find: jest.fn().mockResolvedValue([]),
      create: jest.fn((value) => value as User),
      save: jest.fn((value) =>
        Promise.resolve({ id: nextId++, ...value } as User),
      ),
    } as unknown as jest.Mocked<Repository<User>>;
    service = new UsersService(
      users,
      {} as Repository<Invitation>,
      {} as Repository<Progress>,
      {} as Repository<Reward>,
    );
  });

  it('creates multiple trimmed child profiles for one parent', async () => {
    const first = await service.createChildProfile(parent.id, {
      nickname: ' Ada ',
      avatar: ' avatar-ada ',
      birthYear: 2016,
      learningLevel: ' beginner ',
    });
    const second = await service.createChildProfile(parent.id, {
      nickname: ' Linus ',
      avatar: ' avatar-linus ',
      birthYear: 2014,
    });

    expect(first).toMatchObject({
      id: 20,
      role: Role.KID,
      parentId: 10,
      parent,
      nickname: 'Ada',
      displayName: 'Ada',
      avatar: 'avatar-ada',
      birthYear: 2016,
      learningLevel: 'beginner',
    });
    expect(second).toMatchObject({
      id: 21,
      parentId: 10,
      nickname: 'Linus',
      learningLevel: null,
    });
    expect(users.save.mock.calls).toHaveLength(2);
  });

  it('lists only KID profiles owned by the requested parent', async () => {
    const children = [
      { id: 20, role: Role.KID, parentId: parent.id },
      { id: 21, role: Role.KID, parentId: parent.id },
    ] as User[];
    users.find.mockResolvedValue(children);

    await expect(service.listChildrenForParent(parent.id)).resolves.toEqual(
      children,
    );
    expect(users.find.mock.calls[0]?.[0]).toEqual({
      where: { parentId: 10, role: Role.KID },
      order: { createdAt: 'ASC' },
    });
  });

  it('updates an owned child without changing its parent relationship', async () => {
    const child = {
      id: 20,
      role: Role.KID,
      parentId: parent.id,
      nickname: 'Ada',
      displayName: 'Ada',
      avatar: 'old-avatar',
      birthYear: 2016,
      learningLevel: null,
    } as User;
    users.findOne.mockResolvedValue(child);

    const updated = await service.updateChildProfile(parent.id, child.id, {
      nickname: ' Grace ',
      avatar: ' new-avatar ',
      learningLevel: ' intermediate ',
    });

    expect(users.findOne.mock.calls[0]?.[0]).toEqual({
      where: { id: 20, parentId: 10 },
    });
    expect(updated).toMatchObject({
      parentId: 10,
      nickname: 'Grace',
      displayName: 'Grace',
      avatar: 'new-avatar',
      learningLevel: 'intermediate',
    });
  });

  it('rejects a child that is not owned by the parent', async () => {
    users.findOne.mockResolvedValue(null);

    await expect(
      service.updateChildProfile(parent.id, 999, { nickname: 'Nope' }),
    ).rejects.toThrow(NotFoundException);
    expect(users.save.mock.calls).toHaveLength(0);
  });
});
