import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../auth/roles.guard';
import { Role } from '../../users/entities/user.entity';
import { LevelsController } from './levels.controller';

describe('learning content administration access', () => {
  const mutations = [
    'create',
    'update',
    'remove',
    'createActivity',
    'updateActivity',
    'removeActivity',
  ] as const;

  it.each(mutations)('restricts %s to administrators', (method) => {
    const guard = new RolesGuard(new Reflector());
    for (const role of [Role.ADMIN, Role.PARENT, Role.KID]) {
      const context = {
        getHandler: () => LevelsController.prototype[method],
        getClass: () => LevelsController,
        switchToHttp: () => ({ getRequest: () => ({ user: { role } }) }),
      } as unknown as ExecutionContext;
      if (role === Role.ADMIN) expect(guard.canActivate(context)).toBe(true);
      else expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    }
  });
});
