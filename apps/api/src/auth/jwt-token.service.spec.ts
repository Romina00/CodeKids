import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { Role } from '../users/entities/user.entity';
import { JwtTokenService } from './jwt-token.service';

describe('JwtTokenService', () => {
  const accessSecret = 'test-access-secret';
  let service: JwtTokenService;

  beforeEach(() => {
    const config = new ConfigService({
      jwt: {
        secret: accessSecret,
        refreshSecret: 'test-refresh-secret',
        expiresIn: '15m',
        refreshExpiresIn: '7d',
      },
    });
    service = new JwtTokenService(config);
  });

  it('round-trips a valid typed access token', () => {
    const token = service.signAccessToken({
      sub: 42,
      role: Role.PARENT,
      parentId: null,
      email: 'parent@example.com',
      nickname: null,
    });

    expect(service.verifyAccessToken(token)).toEqual({
      sub: 42,
      role: Role.PARENT,
      type: 'access',
      parentId: null,
      email: 'parent@example.com',
      nickname: null,
    });
  });

  it('rejects a correctly signed token with an invalid payload shape', () => {
    const header = encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = encode(
      JSON.stringify({
        sub: 'not-a-number',
        role: 'UNKNOWN',
        type: 'access',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60,
        jti: 'test-id',
      }),
    );
    const signature = encode(
      createHmac('sha256', accessSecret)
        .update(`${header}.${payload}`)
        .digest(),
    );

    expect(() =>
      service.verifyAccessToken(`${header}.${payload}.${signature}`),
    ).toThrow(new UnauthorizedException('Invalid token payload.'));
  });
});

function encode(value: string | Buffer): string {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}
