import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Role, User } from '../users/entities/user.entity';
import {
  AuthenticatedUser,
  AuthTokens,
  LoginInput,
  RefreshSessionInput,
  RegisterParentInput,
} from './auth.types';
import { JwtTokenService } from './jwt-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async registerParent(input: RegisterParentInput) {
    if (!input.email || !input.password || !input.confirmPassword) {
      throw new BadRequestException(
        'Email, password, and confirmPassword are required.',
      );
    }
    if (input.password !== input.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    const parent = await this.usersService.createParent({
      displayName: input.displayName,
      email: input.email,
      password: input.password,
    });
    const tokens = await this.issueSession(parent);

    return {
      user: this.usersService.serializeUser(parent),
      ...tokens,
      redirectTo: '/parent-dashboard',
    };
  }

  async login(input: LoginInput) {
    if (!input.email || !input.password) {
      throw new BadRequestException('Email and password are required.');
    }

    const user = await this.usersService.findByEmail(input.email);
    if (user?.blockedAt) throw new UnauthorizedException('Account is blocked.');
    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.role === Role.KID) {
      throw new UnauthorizedException('Kids cannot log in directly.');
    }

    const passwordMatches = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const tokens = await this.issueSession(user);
    return {
      user: this.usersService.serializeUser(user),
      ...tokens,
      redirectTo: user.role === Role.ADMIN ? '/admin' : '/parent-dashboard',
    };
  }

  async refresh(input: RefreshSessionInput) {
    if (!input.refreshToken) {
      throw new BadRequestException('Refresh token is required.');
    }

    const payload = this.jwtTokenService.verifyRefreshToken(input.refreshToken);
    const user = await this.usersService.verifyRefreshToken(
      payload.sub,
      input.refreshToken,
    );
    const tokens = await this.issueSession(user);

    return {
      user: this.usersService.serializeUser(user),
      ...tokens,
    };
  }

  async logout(user: AuthenticatedUser) {
    await this.usersService.setRefreshToken(user.sub, null);
    return { success: true };
  }

  async getMe(user: AuthenticatedUser) {
    const dbUser = await this.usersService.findById(user.sub);
    if (!dbUser) {
      throw new UnauthorizedException('User no longer exists.');
    }

    return this.usersService.serializeUser(dbUser);
  }

  async returnToParentMode(user: AuthenticatedUser, password?: string) {
    if (user.role !== Role.KID || !password) {
      throw new UnauthorizedException('Parent re-authentication is required.');
    }

    const parent = await this.usersService.findParentForChild(user.sub);
    if (
      !parent.passwordHash ||
      !(await bcrypt.compare(password, parent.passwordHash))
    ) {
      throw new UnauthorizedException('Parent credentials are invalid.');
    }

    const tokens = await this.issueSession(parent);
    return {
      user: this.usersService.serializeUser(parent),
      ...tokens,
      redirectTo: '/parent',
    };
  }

  async issueSession(user: User): Promise<AuthTokens> {
    return this.issueTokens(user);
  }

  private async issueTokens(user: User): Promise<AuthTokens> {
    const basePayload = {
      sub: user.id,
      role: user.role,
      parentId: user.parentId,
      email: user.email,
      nickname: user.nickname,
    };
    const accessToken = this.jwtTokenService.signAccessToken(basePayload);
    const refreshToken = this.jwtTokenService.signRefreshToken(basePayload);
    await this.usersService.setRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn: this.jwtTokenService.getAccessTokenTtl(),
      refreshTokenExpiresIn: this.jwtTokenService.getRefreshTokenTtl(),
    };
  }
}
