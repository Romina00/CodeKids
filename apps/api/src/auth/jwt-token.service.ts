import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomUUID, timingSafeEqual } from 'crypto';
import { AuthenticatedUser } from './auth.types';
import { Role } from '../users/entities/user.entity';

interface JwtPayload extends AuthenticatedUser {
  exp: number;
  iat: number;
  jti: string;
}

@Injectable()
export class JwtTokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: number;
  private readonly refreshExpiresIn: number;

  constructor(configService: ConfigService) {
    this.accessSecret = configService.get<string>('jwt.secret', 'change-me');
    this.refreshSecret = configService.get<string>(
      'jwt.refreshSecret',
      'change-me-refresh',
    );
    this.accessExpiresIn = this.parseDuration(
      configService.get<string>('jwt.expiresIn', '15m'),
    );
    this.refreshExpiresIn = this.parseDuration(
      configService.get<string>('jwt.refreshExpiresIn', '7d'),
    );
  }

  signAccessToken(payload: Omit<AuthenticatedUser, 'type'>): string {
    return this.sign(
      { ...payload, type: 'access' },
      this.accessSecret,
      this.accessExpiresIn,
    );
  }

  signRefreshToken(payload: Omit<AuthenticatedUser, 'type'>): string {
    return this.sign(
      { ...payload, type: 'refresh' },
      this.refreshSecret,
      this.refreshExpiresIn,
    );
  }

  verifyAccessToken(token: string): AuthenticatedUser {
    return this.verify(token, this.accessSecret, 'access');
  }

  verifyRefreshToken(token: string): AuthenticatedUser {
    return this.verify(token, this.refreshSecret, 'refresh');
  }

  getAccessTokenTtl(): number {
    return this.accessExpiresIn;
  }

  getRefreshTokenTtl(): number {
    return this.refreshExpiresIn;
  }

  private sign(
    payload: AuthenticatedUser,
    secret: string,
    expiresInSeconds: number,
  ): string {
    const now = Math.floor(Date.now() / 1000);
    const fullPayload: JwtPayload = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
      jti: randomUUID(),
    };
    const header = this.base64UrlEncode(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    );
    const body = this.base64UrlEncode(JSON.stringify(fullPayload));
    const signature = this.base64UrlEncode(
      createHmac('sha256', secret).update(`${header}.${body}`).digest(),
    );
    return `${header}.${body}.${signature}`;
  }

  private verify(
    token: string,
    secret: string,
    expectedType: AuthenticatedUser['type'],
  ): AuthenticatedUser {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException('Invalid token format.');
    }

    const header = parts[0];
    const body = parts[1];
    const signature = parts[2];
    if (!header || !body || !signature) {
      throw new UnauthorizedException('Invalid token format.');
    }
    const expectedSignature = this.base64UrlEncode(
      createHmac('sha256', secret).update(`${header}.${body}`).digest(),
    );

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      throw new UnauthorizedException('Invalid token signature.');
    }

    const decodedPayload: unknown = JSON.parse(
      this.base64UrlDecode(body).toString('utf8'),
    );
    if (!this.isJwtPayload(decodedPayload)) {
      throw new UnauthorizedException('Invalid token payload.');
    }
    const payload = decodedPayload;

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token expired.');
    }

    if (payload.type !== expectedType) {
      throw new UnauthorizedException('Invalid token type.');
    }

    return {
      sub: payload.sub,
      role: payload.role,
      type: payload.type,
      parentId: payload.parentId,
      email: payload.email,
      nickname: payload.nickname,
    };
  }

  private base64UrlEncode(value: string | Buffer): string {
    return Buffer.from(value)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  private base64UrlDecode(value: string): Buffer {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padding =
      normalized.length % 4 === 0
        ? ''
        : '='.repeat(4 - (normalized.length % 4));
    return Buffer.from(normalized + padding, 'base64');
  }

  private parseDuration(value: string): number {
    const match = /^(\d+)([smhd])$/.exec(value);
    if (!match) {
      return Number(value) || 900;
    }

    const amountText = match[1];
    const unit = match[2];
    if (!amountText || !unit) {
      return 900;
    }
    const amount = Number(amountText);
    const multiplier =
      {
        s: 1,
        m: 60,
        h: 3600,
        d: 86400,
      }[unit] ?? 1;

    return amount * multiplier;
  }

  private isJwtPayload(value: unknown): value is JwtPayload {
    if (!this.isRecord(value)) {
      return false;
    }

    return (
      typeof value.sub === 'number' &&
      this.isRole(value.role) &&
      (value.type === 'access' || value.type === 'refresh') &&
      typeof value.exp === 'number' &&
      typeof value.iat === 'number' &&
      typeof value.jti === 'string' &&
      this.isOptionalNullableNumber(value.parentId) &&
      this.isOptionalNullableString(value.email) &&
      this.isOptionalNullableString(value.nickname)
    );
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private isRole(value: unknown): value is Role {
    return value === Role.PARENT || value === Role.KID || value === Role.ADMIN;
  }

  private isOptionalNullableNumber(value: unknown): boolean {
    return value === undefined || value === null || typeof value === 'number';
  }

  private isOptionalNullableString(value: unknown): boolean {
    return value === undefined || value === null || typeof value === 'string';
  }
}
