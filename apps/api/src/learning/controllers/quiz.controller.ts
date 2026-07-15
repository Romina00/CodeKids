import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { SubmitQuizDto } from '../dto/submit-quiz.dto';
import { QuizService } from '../services/quiz.service';
import { ApiStandardErrors } from '../../common/errors/api-standard-errors.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { Role } from '../../users/entities/user.entity';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('learning/quiz')
@ApiTags('Learning - Quizzes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.KID)
@ApiBearerAuth()
@ApiStandardErrors(
  HttpStatus.BAD_REQUEST,
  HttpStatus.UNAUTHORIZED,
  HttpStatus.FORBIDDEN,
  HttpStatus.INTERNAL_SERVER_ERROR,
)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('submit')
  @ApiOperation({ summary: 'Submit quiz answers for the authenticated child' })
  @ApiOkResponse({ type: SubmitQuizDto })
  submit(@Body() dto: SubmitQuizDto) {
    return this.quizService.submit(dto);
  }
}
