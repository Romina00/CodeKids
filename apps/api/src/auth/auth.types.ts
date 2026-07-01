import { Role } from '../users/entities/user.entity';

export interface AuthenticatedUser {
  sub: number;
  role: Role;
  type: 'access' | 'refresh';
  parentId?: number | null;
  email?: string | null;
  nickname?: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}
