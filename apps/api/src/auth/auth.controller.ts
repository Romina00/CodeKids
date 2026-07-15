import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import type {
  AuthenticatedUser,
  ChildInvitationInput,
  LoginInput,
  RefreshSessionInput,
  RegisterParentInput,
} from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-parent')
  registerParent(@Body() input: RegisterParentInput) {
    return this.authService.registerParent(input);
  }

  @Post('login')
  login(@Body() input: LoginInput) {
    return this.authService.login(input);
  }

  @Post('refresh')
  refresh(@Body() input: RefreshSessionInput) {
    return this.authService.refresh(input);
  }

  @Post('kid-request')
  kidRequest(@Body() input: ChildInvitationInput) {
    return this.authService.requestChildInvitation(input);
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
