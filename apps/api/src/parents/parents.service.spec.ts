import { AuthService } from '../auth/auth.service';
import { Role, User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ParentsService } from './parents.service';

describe('ParentsService child profile API', () => {
  let service: ParentsService;
  let users: jest.Mocked<UsersService>;

  beforeEach(() => {
    users = {
      createChildProfile: jest.fn(),
      listChildrenForParent: jest.fn(),
      updateChildProfile: jest.fn(),
      markChildKidsMode: jest.fn(),
      serializeUser: jest.fn((user: User) => ({
        id: user.id,
        role: user.role,
        nickname: user.nickname,
        parentId: user.parentId,
      })),
    } as unknown as jest.Mocked<UsersService>;
    service = new ParentsService(users, {} as AuthService);
  });

  it('maps the create-child API input and returns a safe serialization', async () => {
    users.createChildProfile.mockResolvedValue({
      id: 20,
      role: Role.KID,
      parentId: 10,
      nickname: 'Ada',
      passwordHash: 'never-return-this',
    } as User);

    await expect(
      service.createChild(10, {
        nickname: 'Ada',
        avatar: 'avatar-ada',
        birthYear: 2016,
        learningLevel: 'beginner',
      }),
    ).resolves.toEqual({
      id: 20,
      role: Role.KID,
      nickname: 'Ada',
      parentId: 10,
    });
    expect(users.createChildProfile.mock.calls[0]).toEqual([
      10,
      {
        nickname: 'Ada',
        avatar: 'avatar-ada',
        birthYear: 2016,
        learningLevel: 'beginner',
        invitationToken: undefined,
      },
    ]);
  });

  it('serializes every child returned by the parent-scoped listing', async () => {
    users.listChildrenForParent.mockResolvedValue([
      { id: 20, role: Role.KID, parentId: 10, nickname: 'Ada' } as User,
      { id: 21, role: Role.KID, parentId: 10, nickname: 'Linus' } as User,
    ]);

    await expect(service.listChildren(10)).resolves.toEqual([
      { id: 20, role: Role.KID, parentId: 10, nickname: 'Ada' },
      { id: 21, role: Role.KID, parentId: 10, nickname: 'Linus' },
    ]);
  });

  it('selects an owned child and issues a restricted Kids Mode session', async () => {
    const child = {
      id: 20,
      role: Role.KID,
      parentId: 10,
      nickname: 'Ada',
      avatar: 'avatar-ada',
      learningLevel: 'beginner',
    } as User;
    users.markChildKidsMode.mockResolvedValue(child);
    const auth = {
      issueSession: jest.fn().mockResolvedValue({
        accessToken: 'kid-access',
        refreshToken: 'kid-refresh',
      }),
    } as unknown as jest.Mocked<AuthService>;
    service = new ParentsService(users, auth);

    const result = await service.openKidsMode(10, 20);

    expect(users.markChildKidsMode.mock.calls[0]).toEqual([10, 20]);
    expect(result).toMatchObject({
      child: { id: 20, nickname: 'Ada' },
      redirectTo: '/kids-panel/20',
      accessToken: 'kid-access',
      kidsMode: {
        hidden: expect.arrayContaining([
          'Parent Dashboard',
          'Admin Features',
        ]) as string[],
      },
    });
  });
});
