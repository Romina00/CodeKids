import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../users/entities/user.entity';
import { AuthenticatedRequest } from './auth.types';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const matrix: Array<[Role, Role, boolean]> = [
    [Role.PARENT, Role.PARENT, true],
    [Role.KID, Role.KID, true],
    [Role.ADMIN, Role.ADMIN, true],
    [Role.PARENT, Role.KID, false],
    [Role.PARENT, Role.ADMIN, false],
    [Role.KID, Role.PARENT, false],
    [Role.KID, Role.ADMIN, false],
    [Role.ADMIN, Role.PARENT, false],
    [Role.ADMIN, Role.KID, false],
  ];

  it.each(matrix)(
    'allows role %s for %s-only route: %s',
    (actualRole, requiredRole, allowed) => {
      const reflector = {
        getAllAndOverride: jest.fn().mockReturnValue([requiredRole]),
      } as unknown as Reflector;
      const guard = new RolesGuard(reflector);
      const context = makeContext({
        headers: {},
        user: { sub: 1, role: actualRole, type: 'access' },
      });

      if (allowed) {
        expect(guard.canActivate(context)).toBe(true);
      } else {
        expect(() => guard.canActivate(context)).toThrow(
          new ForbiddenException('Insufficient permissions.'),
        );
      }
    },
  );

  it('allows routes without role metadata', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(undefined),
    } as unknown as Reflector;
    expect(new RolesGuard(reflector).canActivate(makeContext())).toBe(true);
  });

  it('denies a role-protected route when no user was authenticated', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Role.PARENT]),
    } as unknown as Reflector;
    expect(() => new RolesGuard(reflector).canActivate(makeContext())).toThrow(
      ForbiddenException,
    );
  });
});

function makeContext(request: AuthenticatedRequest = { headers: {} }) {
  return {
    getHandler: () => undefined,
    getClass: () => undefined,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}
