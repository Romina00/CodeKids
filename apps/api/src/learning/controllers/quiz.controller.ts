import { Body, Controller, Post } from '@nestjs/common';
import { SubmitQuizDto } from '../dto/submit-quiz.dto';
import { QuizService } from '../services/quiz.service';

@Controller('learning/quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('submit')
  submit(@Body() dto: SubmitQuizDto) {
    return this.quizService.submit(dto);
  }
}
