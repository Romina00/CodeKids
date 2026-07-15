import { AdminController } from '../admin/admin.controller';
import { LevelsController } from '../learning/controllers/levels.controller';
import { ProgressController } from '../learning/controllers/progress.controller';
import { QuizController } from '../learning/controllers/quiz.controller';
import { RewardsController } from '../learning/controllers/rewards.controller';
import { ParentsController } from '../parents/parents.controller';
import { UploadController } from '../upload/upload.controller';
import { Role } from '../users/entities/user.entity';
import { UsersController } from '../users/users.controller';
import { AuthController } from './auth.controller';
import { ROLES_KEY } from './roles.decorator';

describe('role access policy metadata', () => {
  it.each([
    [ParentsController, Role.PARENT],
    [AdminController, Role.ADMIN],
    [LevelsController, Role.ADMIN],
    [ProgressController, Role.KID],
    [QuizController, Role.ADMIN],
    [RewardsController, Role.KID],
    [UploadController, Role.PARENT],
  ])('%s is restricted to %s', (controller, role) => {
    expect(Reflect.getMetadata(ROLES_KEY, controller)).toEqual([role]);
  });

  it('restricts user administration at method level', () => {
    expect(
      Reflect.getMetadata(ROLES_KEY, handler(UsersController, 'findAll')),
    ).toEqual([Role.ADMIN]);
  });

  it('allows only a child token to request the Parent Mode transition', () => {
    expect(
      Reflect.getMetadata(
        ROLES_KEY,
        handler(AuthController, 'returnToParentMode'),
      ),
    ).toEqual([Role.KID]);
  });

  it('allows only a child token to submit a quiz', () => {
    expect(
      Reflect.getMetadata(ROLES_KEY, handler(QuizController, 'submit')),
    ).toEqual([Role.KID]);
  });

  it('keeps registration, login, refresh, and invitation requests public', () => {
    for (const routeHandler of [
      handler(AuthController, 'registerParent'),
      handler(AuthController, 'login'),
      handler(AuthController, 'refresh'),
      handler(AuthController, 'kidRequest'),
    ]) {
      expect(Reflect.getMetadata(ROLES_KEY, routeHandler)).toBeUndefined();
    }
  });
});

function handler<T extends object>(
  controller: { prototype: T },
  name: keyof T,
): object {
  const value = Object.getOwnPropertyDescriptor(controller.prototype, name)
    ?.value as unknown;
  if (typeof value !== 'function')
    throw new Error(`Missing handler ${String(name)}`);
  return value;
}
