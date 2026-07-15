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
import type { AuthenticatedUser } from '../../auth/auth.types';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { ApiStandardErrors } from '../../common/errors/api-standard-errors.decorator';
import { Role } from '../../users/entities/user.entity';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { SubmitQuizDto } from '../dto/submit-quiz.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';
import { QuizService } from '../services/quiz.service';

@Controller('learning/quizzes')
@ApiTags('Learning - Quizzes')
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
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @ApiOperation({ summary: 'Create a quiz (administrator)' })
  @ApiCreatedResponse({ description: 'Created quiz' })
  create(@Body() dto: CreateQuizDto) {
    return this.quizService.create(dto);
  }
  @Get(':quizId')
  @Roles(Role.ADMIN, Role.KID)
  @ApiOperation({ summary: 'Get ordered quiz questions' })
  @ApiOkResponse({
    description: 'Quiz; answer keys are visible only to administrators',
  })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('quizId', ParseIntPipe) id: number,
  ) {
    return this.quizService.findOne(id, user.role === Role.ADMIN);
  }
  @Patch(':quizId')
  @ApiOperation({ summary: 'Update a quiz (administrator)' })
  update(
    @Param('quizId', ParseIntPipe) id: number,
    @Body() dto: UpdateQuizDto,
  ) {
    return this.quizService.update(id, dto);
  }
  @Delete(':quizId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@Param('quizId', ParseIntPipe) id: number) {
    return this.quizService.remove(id);
  }
  @Post(':quizId/questions')
  @ApiOperation({ summary: 'Create a quiz question (administrator)' })
  createQuestion(
    @Param('quizId', ParseIntPipe) id: number,
    @Body() dto: CreateQuestionDto,
  ) {
    return this.quizService.createQuestion(id, dto);
  }
  @Patch(':quizId/questions/:questionId')
  updateQuestion(
    @Param('quizId', ParseIntPipe) quizId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.quizService.updateQuestion(quizId, questionId, dto);
  }
  @Delete(':quizId/questions/:questionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  removeQuestion(
    @Param('quizId', ParseIntPipe) quizId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
  ) {
    return this.quizService.removeQuestion(quizId, questionId);
  }
  @Post(':quizId/submissions')
  @Roles(Role.KID)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Score and persist an authenticated child quiz submission',
  })
  @ApiOkResponse({
    description: 'Score, pass state, retry state, and per-question feedback',
  })
  submit(
    @CurrentUser() user: AuthenticatedUser,
    @Param('quizId', ParseIntPipe) quizId: number,
    @Body() dto: SubmitQuizDto,
  ) {
    return this.quizService.submit(user.sub, { ...dto, quizId });
  }
}
