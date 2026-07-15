import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../auth/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/auth.types';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { ApiStandardErrors } from '../../common/errors/api-standard-errors.decorator';
import { Role } from '../../users/entities/user.entity';
import { SaveBlocklyWorkspaceDto } from '../dto/save-blockly-workspace.dto';
import { BlocklyService } from '../services/blockly.service';

@Controller('learning/blockly')
@ApiTags('Learning - Blockly')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.KID)
@ApiBearerAuth()
@ApiStandardErrors(
  HttpStatus.BAD_REQUEST,
  HttpStatus.UNAUTHORIZED,
  HttpStatus.FORBIDDEN,
  HttpStatus.NOT_FOUND,
  HttpStatus.CONFLICT,
  HttpStatus.INTERNAL_SERVER_ERROR,
)
export class BlocklyController {
  constructor(private readonly blocklyService: BlocklyService) {}
  @Get(':activityId/workspace')
  @ApiOperation({ summary: 'Load the authenticated child Blockly workspace' })
  @ApiOkResponse({ description: 'Sanitized workspace and revision' })
  load(
    @CurrentUser() user: AuthenticatedUser,
    @Param('activityId', ParseIntPipe) activityId: number,
  ) {
    return this.blocklyService.load(user.sub, activityId);
  }
  @Put(':activityId/workspace')
  @ApiOperation({ summary: 'Validate and save a Blockly workspace' })
  @ApiOkResponse({
    description: 'Saved revision and server-derived completion state',
  })
  save(
    @CurrentUser() user: AuthenticatedUser,
    @Param('activityId', ParseIntPipe) activityId: number,
    @Body() dto: SaveBlocklyWorkspaceDto,
  ) {
    return this.blocklyService.save(user.sub, activityId, dto);
  }
}
