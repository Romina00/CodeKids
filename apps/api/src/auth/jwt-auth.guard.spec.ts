import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Role } from '../users/entities/user.entity';
import { AuthenticatedRequest } from './auth.types';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtTokenService } from './jwt-token.service';

describe('JwtAuthGuard', () => {
  const payload = { sub: 1, role: Role.PARENT, type: 'access' as const };
  let tokens: jest.Mocked<JwtTokenService>;
  let guard: JwtAuthGuard;

  beforeEach(() => {
    tokens = {
      verifyAccessToken: jest.fn().mockReturnValue(payload),
    } as unknown as jest.Mocked<JwtTokenService>;
    guard = new JwtAuthGuard(tokens);
  });

  it('authenticates a bearer access token and attaches its user payload', () => {
    const request: AuthenticatedRequest = {
      headers: { authorization: 'Bearer valid-token' },
    };

    expect(guard.canActivate(makeContext(request))).toBe(true);
    expect(request.user).toEqual(payload);
  });

  it.each([undefined, 'Basic credentials', 'Bearer '])(
    'rejects an invalid authorization header: %s',
    (authorization) => {
      expect(() =>
        guard.canActivate(makeContext({ headers: { authorization } })),
      ).toThrow(UnauthorizedException);
    },
  );
});

function makeContext(request: AuthenticatedRequest) {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}
