import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { Role, User } from '../users/entities/user.entity';
import { Invitation, InvitationStatus } from './entities/invitation.entity';
import { AuthenticatedUser, AuthTokens } from './auth.types';
import { JwtTokenService } from './jwt-token.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtTokenService: JwtTokenService,
    @InjectRepository(Invitation)
    private readonly invitationsRepository: Repository<Invitation>,
  ) {}

  async registerParent(email: string, password: string) {
    const parent = await this.usersService.createParent({ email, password });
    const tokens = await this.issueSession(parent);

    return {
      user: this.usersService.serializeUser(parent),
      ...tokens,
      redirectTo: '/parent-dashboard',
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.role === Role.KID) {
      throw new UnauthorizedException('Kids cannot log in directly.');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
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

  async refresh(refreshToken: string) {
    const payload = this.jwtTokenService.verifyRefreshToken(refreshToken);
    const user = await this.usersService.verifyRefreshToken(
      payload.sub,
      refreshToken,
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

  async requestChildInvitation(parentEmail: string) {
    const normalizedEmail = parentEmail.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      throw new BadRequestException('Email address format is invalid.');
    }

    const invitation = this.invitationsRepository.create({
      parentEmail: normalizedEmail,
      token: randomBytes(24).toString('hex'),
      status: InvitationStatus.PENDING,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    const savedInvitation = await this.invitationsRepository.save(invitation);

    return {
      invitationId: savedInvitation.id,
      parentEmail: savedInvitation.parentEmail,
      message:
        'Invitation recorded and ready to send to the parent email address.',
      emailPreview: {
        subject: 'Your child would like to join CodeKids',
        body: 'A child has requested access using your email address.',
        ctaLabel: 'Create Child Account',
        invitationToken: savedInvitation.token,
      },
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
