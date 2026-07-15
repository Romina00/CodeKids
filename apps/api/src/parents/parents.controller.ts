import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { ParentsService } from './parents.service';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { UpdateParentProfileDto } from './dto/update-parent-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiStandardErrors } from '../common/errors/api-standard-errors.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ChildProfileResponseDto,
  KidsModeResponseDto,
  ParentDashboardResponseDto,
  SuccessResponseDto,
} from './dto/parent-response.dto';
import { UserResponseDto } from '../auth/dto/auth-response.dto';

@Controller('parents')
@ApiTags('Parents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PARENT)
@ApiStandardErrors(
  HttpStatus.BAD_REQUEST,
  HttpStatus.UNAUTHORIZED,
  HttpStatus.FORBIDDEN,
  HttpStatus.NOT_FOUND,
  HttpStatus.CONFLICT,
  HttpStatus.INTERNAL_SERVER_ERROR,
)
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get the authenticated parent dashboard' })
  @ApiOkResponse({ type: ParentDashboardResponseDto })
  getDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.parentsService.getDashboard(user.sub);
  }

  @Get('children')
  @ApiOperation({ summary: 'List child profiles owned by the parent' })
  @ApiOkResponse({ type: [ChildProfileResponseDto] })
  listChildren(@CurrentUser() user: AuthenticatedUser) {
    return this.parentsService.listChildren(user.sub);
  }

  @Post('children')
  @ApiOperation({ summary: 'Create a child profile' })
  @ApiCreatedResponse({ type: ChildProfileResponseDto })
  createChild(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateChildDto,
  ) {
    return this.parentsService.createChild(user.sub, body);
  }

  @Patch('children/:childId')
  @ApiOperation({ summary: 'Update an owned child profile' })
  @ApiOkResponse({ type: ChildProfileResponseDto })
  updateChild(
    @CurrentUser() user: AuthenticatedUser,
    @Param('childId', ParseIntPipe) childId: number,
    @Body() body: UpdateChildDto,
  ) {
    return this.parentsService.updateChild(user.sub, childId, body);
  }

  @Post('children/:childId/kids-mode')
  @ApiOperation({
    summary: 'Select a child and start a restricted Kids Mode session',
  })
  @ApiCreatedResponse({ type: KidsModeResponseDto })
  openKidsMode(
    @CurrentUser() user: AuthenticatedUser,
    @Param('childId', ParseIntPipe) childId: number,
  ) {
    return this.parentsService.openKidsMode(user.sub, childId);
  }

  @Patch('account/profile')
  @ApiOperation({ summary: 'Update the parent account profile' })
  @ApiOkResponse({ type: UserResponseDto })
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdateParentProfileDto,
  ) {
    return this.parentsService.updateParentProfile(user.sub, body);
  }

  @Patch('account/password')
  @ApiOperation({ summary: 'Change the parent account password' })
  @ApiOkResponse({ type: SuccessResponseDto })
  changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: ChangePasswordDto,
  ) {
    return this.parentsService.changePassword(user.sub, body);
  }
}
