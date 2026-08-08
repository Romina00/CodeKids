import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { SubmitQuizDto } from '../dto/submit-quiz.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';
import { Level } from '../entities/level.entity';
import { Question, QuestionType } from '../entities/question.entity';
import { QuizAttempt } from '../entities/quiz-attempt.entity';
import { Quiz } from '../entities/quiz.entity';
import { XpEventType } from '../entities/xp-event.entity';
import { RewardsService } from './rewards.service';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private readonly quizzes: Repository<Quiz>,
    @InjectRepository(Question)
    private readonly questions: Repository<Question>,
    @InjectRepository(QuizAttempt)
    private readonly attempts: Repository<QuizAttempt>,
    @InjectRepository(Level) private readonly levels: Repository<Level>,
    private readonly rewards: RewardsService,
  ) {}

  async create(dto: CreateQuizDto) {
    if (!(await this.levels.findOneBy({ id: dto.levelId })))
      throw new BadRequestException('Learning level not found.');
    return this.quizzes.save(this.quizzes.create(dto));
  }

  async findOne(id: number, includeAnswers = false) {
    const builder = this.quizzes
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.questions', 'question')
      .where('quiz.id = :id', { id })
      .orderBy('question.position', 'ASC');
    if (includeAnswers) builder.addSelect('question.correctAnswers');
    const quiz = await builder.getOne();
    if (!quiz) throw new NotFoundException('Quiz not found.');
    return quiz;
  }

  async update(id: number, dto: UpdateQuizDto) {
    const quiz = await this.requireQuiz(id);
    if (dto.levelId && !(await this.levels.findOneBy({ id: dto.levelId })))
      throw new BadRequestException('Learning level not found.');
    return this.quizzes.save(this.quizzes.merge(quiz, dto));
  }

  async remove(id: number) {
    await this.quizzes.remove(await this.requireQuiz(id));
    return { deleted: true, id };
  }

  async createQuestion(quizId: number, dto: CreateQuestionDto) {
    await this.requireQuiz(quizId);
    this.validateQuestion(dto);
    return this.questions.save(this.questions.create({ ...dto, quizId }));
  }

  async updateQuestion(
    quizId: number,
    questionId: number,
    dto: UpdateQuestionDto,
  ) {
    const question = await this.requireQuestion(quizId, questionId);
    const candidate = { ...question, ...dto };
    this.validateQuestion(candidate);
    return this.questions.save(this.questions.merge(question, dto));
  }

  async removeQuestion(quizId: number, questionId: number) {
    await this.questions.remove(await this.requireQuestion(quizId, questionId));
    return { deleted: true, id: questionId };
  }

  async submit(childId: number, dto: SubmitQuizDto) {
    const quiz = await this.findOne(dto.quizId, true);
    if (!quiz.published) throw new NotFoundException('Quiz not found.');
    const priorAttempts = await this.attempts.countBy({
      childId,
      quizId: quiz.id,
    });
    if (quiz.maxAttempts !== null && priorAttempts >= quiz.maxAttempts)
      throw new BadRequestException('Maximum quiz attempts reached.');
    if (
      dto.answers.length !== quiz.questions.length ||
      new Set(dto.answers.map((answer) => answer.questionId)).size !==
        quiz.questions.length
    ) {
      throw new BadRequestException(
        'Submit exactly one answer for every quiz question.',
      );
    }

    let earned = 0;
    const total = quiz.questions.reduce(
      (sum, question) => sum + question.points,
      0,
    );
    const results = quiz.questions.map((question) => {
      const answer = dto.answers.find(
        (item) => item.questionId === question.id,
      );
      if (!answer)
        throw new BadRequestException(
          'Answer references do not match this quiz.',
        );
      const correct = sameSet(answer.selectedAnswers, question.correctAnswers);
      if (correct) earned += question.points;
      return {
        questionId: question.id,
        selectedAnswers: answer.selectedAnswers,
        correct,
        explanation: question.explanation,
      };
    });
    const score = total === 0 ? 0 : Math.round((earned / total) * 100);
    const passed = score >= quiz.passingScore;
    await this.attempts.save(
      this.attempts.create({
        childId,
        quizId: quiz.id,
        attemptNumber: priorAttempts + 1,
        score,
        passed,
        answers: results.map((result) => ({
          questionId: result.questionId,
          selectedAnswers: result.selectedAnswers,
          correct: result.correct,
        })),
      }),
    );
    if (passed)
      await this.rewards.recordEvent(
        childId,
        XpEventType.QUIZ_PASSED,
        `quiz:${quiz.id}:attempt:${priorAttempts + 1}`,
        25,
        { quizId: quiz.id, score },
      );
    return {
      quizId: quiz.id,
      attemptNumber: priorAttempts + 1,
      score,
      passed,
      attemptsRemaining:
        quiz.maxAttempts === null ? null : quiz.maxAttempts - priorAttempts - 1,
      results,
    };
  }

  private validateQuestion(
    question: Pick<Question, 'type' | 'options' | 'correctAnswers'>,
  ) {
    const options = new Set(question.options);
    if (
      options.size !== question.options.length ||
      question.correctAnswers.some((answer) => !options.has(answer))
    ) {
      throw new BadRequestException(
        'Correct answers must be unique members of the options.',
      );
    }
    if (
      question.type === QuestionType.SINGLE_CHOICE &&
      question.correctAnswers.length !== 1
    ) {
      throw new BadRequestException(
        'Single-choice questions require one correct answer.',
      );
    }
  }

  private async requireQuiz(id: number) {
    const quiz = await this.quizzes.findOneBy({ id });
    if (!quiz) throw new NotFoundException('Quiz not found.');
    return quiz;
  }

  private async requireQuestion(quizId: number, id: number) {
    const question = await this.questions
      .createQueryBuilder('question')
      .addSelect('question.correctAnswers')
      .where('question.id = :id AND question.quizId = :quizId', { id, quizId })
      .getOne();
    if (!question) throw new NotFoundException('Question not found.');
    return question;
  }
}

function sameSet(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    new Set(left).size === left.length &&
    left.every((value) => right.includes(value))
  );
}
