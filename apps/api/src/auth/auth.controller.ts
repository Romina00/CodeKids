import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthenticatedUser } from './auth.types';
import { RegisterParentDto } from './dto/register-parent.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshSessionDto } from './dto/refresh-session.dto';
import { ChildInvitationDto } from './dto/child-invitation.dto';
import { ParentModeDto } from './dto/parent-mode.dto';
import { ApiStandardErrors } from '../common/errors/api-standard-errors.decorator';
import { HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthSessionResponseDto,
  ChildInvitationResponseDto,
  LogoutResponseDto,
  UserResponseDto,
} from './dto/auth-response.dto';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Role } from '../users/entities/user.entity';
import { AuthRateLimitService } from './auth-rate-limit.service';
import type { Request } from 'express';

@Controller('auth')
@ApiTags('Authentication')
@ApiStandardErrors(
  HttpStatus.BAD_REQUEST,
  HttpStatus.UNAUTHORIZED,
  HttpStatus.CONFLICT,
  HttpStatus.TOO_MANY_REQUESTS,
  HttpStatus.INTERNAL_SERVER_ERROR,
)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rateLimit: AuthRateLimitService,
  ) {}

  @Post('register-parent')
  @ApiOperation({ summary: 'Register a parent and start a session' })
  @ApiCreatedResponse({ type: AuthSessionResponseDto })
  registerParent(@Req() request: Request, @Body() input: RegisterParentDto) {
    this.limit('register', request, 5);
    return this.authService.registerParent(input);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in a parent or administrator' })
  @ApiOkResponse({ type: AuthSessionResponseDto })
  login(@Req() request: Request, @Body() input: LoginDto) {
    this.limit('login', request, 10);
    return this.authService.login(input);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate an active refresh token' })
  @ApiOkResponse({ type: AuthSessionResponseDto })
  refresh(@Req() request: Request, @Body() input: RefreshSessionDto) {
    this.limit('refresh', request, 30);
    return this.authService.refresh(input);
  }

  @Post('kid-request')
  @ApiOperation({ summary: 'Request a simulated parent invitation email' })
  @ApiCreatedResponse({ type: ChildInvitationResponseDto })
  kidRequest(@Body() input: ChildInvitationDto) {
    return this.authService.requestChildInvitation(input);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invalidate the current refresh session' })
  @ApiOkResponse({ type: LogoutResponseDto })
  logout(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logout(user);
  }

  @Post('parent-mode')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.KID)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave Kids Mode after parent re-authentication' })
  @ApiOkResponse({ type: AuthSessionResponseDto })
  returnToParentMode(
    @CurrentUser() user: AuthenticatedUser,
    @Body() input: ParentModeDto,
  ) {
    return this.authService.returnToParentMode(user, input.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiOkResponse({ type: UserResponseDto })
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getMe(user);
  }

  private limit(scope: string, request: Request, limit: number) {
    const forwarded = request.headers['x-forwarded-for'];
    const client =
      (Array.isArray(forwarded)
        ? forwarded[0]
        : forwarded?.split(',')[0]
      )?.trim() ||
      request.ip ||
      'unknown';
    this.rateLimit.check(scope, client, limit);
  }
}
