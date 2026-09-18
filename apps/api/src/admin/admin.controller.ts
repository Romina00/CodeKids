import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { AdminService } from './admin.service';
import { ApiStandardErrors } from '../common/errors/api-standard-errors.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminOverviewResponseDto } from './admin-response.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { BlockUserDto } from './admin-user.dto';
@Controller('admin')
@ApiTags('Administration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiStandardErrors(
  HttpStatus.UNAUTHORIZED,
  HttpStatus.FORBIDDEN,
  HttpStatus.INTERNAL_SERVER_ERROR,
)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Get the administrator platform overview' })
  @ApiOkResponse({ type: AdminOverviewResponseDto })
  findAll() {
    return this.adminService.getOverview();
  }

  @Get('users')
  @ApiOperation({ summary: 'Search parent and child account status' })
  search(@Query('q') query?: string, @Query('role') role?: Role) {
    return this.adminService.searchUsers(query, role);
  }

  @Patch('users/:userId/block')
  @ApiOperation({ summary: 'Block or unblock an account' })
  setBlocked(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: BlockUserDto,
  ) {
    return this.adminService.setBlocked(
      actor.sub,
      userId,
      body.blocked,
      body.reason,
    );
  }

  @Post('users/:userId/password-recovery')
  @ApiOperation({ summary: 'Initiate safe parent password recovery' })
  initiateRecovery(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.initiateRecovery(userId);
  }
}
