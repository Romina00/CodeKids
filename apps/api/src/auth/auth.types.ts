import { Role } from '../users/entities/user.entity';

export interface AuthenticatedUser {
  sub: number;
  role: Role;
  type: 'access' | 'refresh';
  parentId?: number | null;
  email?: string | null;
  nickname?: string | null;
}

export interface AuthenticatedRequest {
  headers: Record<string, string | string[] | undefined>;
  user?: AuthenticatedUser;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface RegisterParentInput {
  displayName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginInput {
  email?: string;
  password?: string;
}

export interface RefreshSessionInput {
  refreshToken?: string;
}
