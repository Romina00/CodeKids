import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthenticatedUser } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-parent')
  registerParent(
    @Body()
    body: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    },
  ) {
    if (!body.email || !body.password || !body.confirmPassword) {
      throw new BadRequestException(
        'Email, password, and confirmPassword are required.',
      );
    }
    if (body.password !== body.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }
    return this.authService.registerParent(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: { email?: string; password?: string }) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email and password are required.');
    }
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  refresh(@Body() body: { refreshToken?: string }) {
    if (!body.refreshToken) {
      throw new BadRequestException('Refresh token is required.');
    }
    return this.authService.refresh(body.refreshToken);
  }

  @Post('kid-request')
  kidRequest(@Body() body: { parentEmail?: string }) {
    if (!body.parentEmail) {
      throw new BadRequestException('Parent email is required.');
    }
    return this.authService.requestChildInvitation(body.parentEmail);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logout(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getMe(user);
  }
}
