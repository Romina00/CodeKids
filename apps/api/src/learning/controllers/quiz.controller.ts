import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { SubmitQuizDto } from '../dto/submit-quiz.dto';
import { QuizService } from '../services/quiz.service';
import { ApiStandardErrors } from '../../common/errors/api-standard-errors.decorator';

@Controller('learning/quiz')
@ApiStandardErrors(HttpStatus.BAD_REQUEST, HttpStatus.INTERNAL_SERVER_ERROR)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('submit')
  submit(@Body() dto: SubmitQuizDto) {
    return this.quizService.submit(dto);
  }
}
