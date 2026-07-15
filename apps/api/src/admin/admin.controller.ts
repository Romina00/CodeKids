import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  HttpCode,
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
import {
  CreateLandingContentDto,
  UpdateLandingContentDto,
} from './landing-content.dto';

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
  @ApiOperation({ summary: 'Block or unblock an account and audit the action' })
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
  initiateRecovery(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.adminService.initiateRecovery(actor.sub, userId);
  }

  @Get('audit')
  @ApiOperation({ summary: 'List recent sensitive administration actions' })
  listAudit() {
    return this.adminService.listAudit();
  }

  @Get('landing-content')
  @ApiOperation({ summary: 'List all landing content for administration' })
  listContent() {
    return this.adminService.listAllContent();
  }

  @Post('landing-content')
  @ApiOperation({ summary: 'Create versioned landing content' })
  createContent(
    @CurrentUser() actor: AuthenticatedUser,
    @Body() body: CreateLandingContentDto,
  ) {
    return this.adminService.createContent(actor.sub, body);
  }

  @Patch('landing-content/:contentId')
  @ApiOperation({ summary: 'Update landing content with version checking' })
  updateContent(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('contentId', ParseIntPipe) id: number,
    @Body() body: UpdateLandingContentDto,
  ) {
    return this.adminService.updateContent(actor.sub, id, body);
  }

  @Delete('landing-content/:contentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete landing content' })
  removeContent(@Param('contentId', ParseIntPipe) id: number) {
    return this.adminService.removeContent(id);
  }
}
