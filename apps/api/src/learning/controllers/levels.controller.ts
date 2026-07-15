import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../auth/current-user.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import type { AuthenticatedUser } from '../../auth/auth.types';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { ApiStandardErrors } from '../../common/errors/api-standard-errors.decorator';
import { Role } from '../../users/entities/user.entity';
import { CreateActivityDto } from '../dto/create-activity.dto';
import { CreateLevelDto } from '../dto/create-level.dto';
import { UpdateActivityDto } from '../dto/update-activity.dto';
import { UpdateLevelDto } from '../dto/update-level.dto';
import { LevelsService } from '../services/levels.service';

@Controller('learning/levels')
@ApiTags('Learning - Levels')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
@ApiStandardErrors(
  HttpStatus.BAD_REQUEST,
  HttpStatus.UNAUTHORIZED,
  HttpStatus.FORBIDDEN,
  HttpStatus.NOT_FOUND,
  HttpStatus.INTERNAL_SERVER_ERROR,
)
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.KID)
  @ApiOperation({ summary: 'List learning levels and ordered activities' })
  @ApiOkResponse({
    description: 'Ordered levels with completion state for kids',
  })
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.levelsService.findAll(
      user.role === Role.KID ? user.sub : undefined,
    );
  }

  @Get(':levelId')
  @Roles(Role.ADMIN, Role.KID)
  @ApiOperation({ summary: 'Get a learning level and its ordered activities' })
  @ApiOkResponse({ description: 'Level details and child completion state' })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('levelId', ParseIntPipe) levelId: number,
  ) {
    return this.levelsService.findOne(
      levelId,
      user.role === Role.KID ? user.sub : undefined,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a learning level (administrator)' })
  @ApiCreatedResponse({ description: 'Created level' })
  create(@Body() dto: CreateLevelDto) {
    return this.levelsService.create(dto);
  }

  @Patch(':levelId')
  @ApiOperation({ summary: 'Update a learning level (administrator)' })
  @ApiOkResponse({ description: 'Updated level' })
  update(
    @Param('levelId', ParseIntPipe) levelId: number,
    @Body() dto: UpdateLevelDto,
  ) {
    return this.levelsService.update(levelId, dto);
  }

  @Delete(':levelId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a learning level (administrator)' })
  @ApiNoContentResponse({ description: 'Level deleted' })
  remove(@Param('levelId', ParseIntPipe) levelId: number) {
    return this.levelsService.remove(levelId);
  }

  @Post(':levelId/activities')
  @ApiOperation({ summary: 'Create an ordered level activity (administrator)' })
  @ApiCreatedResponse({ description: 'Created activity' })
  createActivity(
    @Param('levelId', ParseIntPipe) levelId: number,
    @Body() dto: CreateActivityDto,
  ) {
    return this.levelsService.createActivity(levelId, dto);
  }

  @Patch(':levelId/activities/:activityId')
  @ApiOperation({ summary: 'Update a level activity (administrator)' })
  @ApiOkResponse({ description: 'Updated activity' })
  updateActivity(
    @Param('levelId', ParseIntPipe) levelId: number,
    @Param('activityId', ParseIntPipe) activityId: number,
    @Body() dto: UpdateActivityDto,
  ) {
    return this.levelsService.updateActivity(levelId, activityId, dto);
  }

  @Delete(':levelId/activities/:activityId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a level activity (administrator)' })
  @ApiNoContentResponse({ description: 'Activity deleted' })
  removeActivity(
    @Param('levelId', ParseIntPipe) levelId: number,
    @Param('activityId', ParseIntPipe) activityId: number,
  ) {
    return this.levelsService.removeActivity(levelId, activityId);
  }
}
