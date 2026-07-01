import { Injectable } from '@nestjs/common';
import { SubmitQuizDto } from '../dto/submit-quiz.dto';

@Injectable()
export class QuizService {
  submit(dto: SubmitQuizDto) {
    return dto;
  }
}
