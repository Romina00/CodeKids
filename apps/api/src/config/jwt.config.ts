import { registerAs } from '@nestjs/config';

export const JwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET ?? 'change-me',
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-me-refresh',
  expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
}));
