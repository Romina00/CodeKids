import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthenticatedUser } from './auth.types';
import { RegisterParentDto } from './dto/register-parent.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshSessionDto } from './dto/refresh-session.dto';
import { ChildInvitationDto } from './dto/child-invitation.dto';
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
  LogoutResponseDto,
  UserResponseDto,
} from './dto/auth-response.dto';

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
  constructor(private readonly authService: AuthService) {}

  @Post('register-parent')
  @ApiOperation({ summary: 'Register a parent and start a session' })
  @ApiCreatedResponse({ type: AuthSessionResponseDto })
  registerParent(@Body() input: RegisterParentDto) {
    return this.authService.registerParent(input);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in a parent or administrator' })
  @ApiOkResponse({ type: AuthSessionResponseDto })
  login(@Body() input: LoginDto) {
    return this.authService.login(input);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Rotate an active refresh token' })
  @ApiOkResponse({ type: AuthSessionResponseDto })
  refresh(@Body() input: RefreshSessionDto) {
    return this.authService.refresh(input);
  }

  @Post('kid-request')
  kidRequest(@Body() input: ChildInvitationDto) {
    return this.authService.requestChildInvitation(input);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invalidate the current refresh session' })
  @ApiOkResponse({ type: LogoutResponseDto })
  logout(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logout(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiOkResponse({ type: UserResponseDto })
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getMe(user);
  }
}
