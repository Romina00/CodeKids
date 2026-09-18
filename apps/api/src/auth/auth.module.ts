import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { JwtTokenService } from './jwt-token.service';
import { RolesGuard } from './roles.guard';
import { AuthRateLimitService } from './auth-rate-limit.service';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtTokenService,
    JwtAuthGuard,
    RolesGuard,
    AuthRateLimitService,
  ],
  exports: [AuthService, JwtTokenService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
