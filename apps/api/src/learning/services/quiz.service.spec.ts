import { BadRequestException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { Level } from '../entities/level.entity';
import { Question, QuestionType } from '../entities/question.entity';
import { QuizAttempt } from '../entities/quiz-attempt.entity';
import { Quiz } from '../entities/quiz.entity';
import { QuizService } from './quiz.service';

describe('QuizService', () => {
  let service: QuizService;
  let quizzes: jest.Mocked<Repository<Quiz>>;
  let questions: jest.Mocked<Repository<Question>>;
  let attempts: jest.Mocked<Repository<QuizAttempt>>;
  let levels: jest.Mocked<Repository<Level>>;

  beforeEach(() => {
    quizzes = repositoryMock<Quiz>();
    questions = repositoryMock<Question>();
    attempts = repositoryMock<QuizAttempt>();
    levels = repositoryMock<Level>();
    service = new QuizService(quizzes, questions, attempts, levels);
    attempts.create.mockImplementation((value) => value as QuizAttempt);
    attempts.save.mockImplementation((value) =>
      Promise.resolve({ id: 1, ...value } as QuizAttempt),
    );
  });

  it('scores weighted answers, persists a safe result, and reports retry state', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue({
      id: 5,
      published: true,
      passingScore: 70,
      maxAttempts: 3,
      questions: [
        {
          id: 10,
          points: 1,
          correctAnswers: ['A'],
          explanation: 'First explanation',
        },
        {
          id: 11,
          points: 3,
          correctAnswers: ['B', 'C'],
          explanation: null,
        },
      ],
    } as Quiz);
    attempts.countBy.mockResolvedValue(1);

    await expect(
      service.submit(7, {
        quizId: 5,
        answers: [
          { questionId: 10, selectedAnswers: ['A'] },
          { questionId: 11, selectedAnswers: ['B'] },
        ],
      }),
    ).resolves.toMatchObject({
      attemptNumber: 2,
      score: 25,
      passed: false,
      attemptsRemaining: 1,
    });
    expect(attempts.create.mock.calls[0]?.[0]).toMatchObject({
      childId: 7,
      quizId: 5,
      answers: [
        { questionId: 10, selectedAnswers: ['A'], correct: true },
        { questionId: 11, selectedAnswers: ['B'], correct: false },
      ],
    });
    expect(JSON.stringify(attempts.create.mock.calls[0]?.[0])).not.toContain(
      'correctAnswers',
    );
  });

  it('enforces max attempts before scoring', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue({
      id: 5,
      published: true,
      maxAttempts: 1,
      questions: [],
    } as unknown as Quiz);
    attempts.countBy.mockResolvedValue(1);
    await expect(service.submit(7, { quizId: 5, answers: [] })).rejects.toThrow(
      'Maximum quiz attempts reached',
    );
  });

  it('rejects missing, duplicate, or foreign question answers', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue({
      id: 5,
      published: true,
      maxAttempts: null,
      questions: [
        { id: 10, points: 1, correctAnswers: ['A'] },
        { id: 11, points: 1, correctAnswers: ['B'] },
      ],
    } as Quiz);
    attempts.countBy.mockResolvedValue(0);
    await expect(
      service.submit(7, {
        quizId: 5,
        answers: [
          { questionId: 10, selectedAnswers: ['A'] },
          { questionId: 10, selectedAnswers: ['A'] },
        ],
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('validates answer keys when creating questions', async () => {
    quizzes.findOneBy.mockResolvedValue({ id: 5 } as Quiz);
    await expect(
      service.createQuestion(5, {
        prompt: 'Pick one',
        type: QuestionType.SINGLE_CHOICE,
        options: ['A', 'B'],
        correctAnswers: ['A', 'B'],
        position: 0,
        points: 1,
      }),
    ).rejects.toThrow('require one correct answer');
  });
});

function repositoryMock<T extends ObjectLiteral>(): jest.Mocked<Repository<T>> {
  return {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    countBy: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  } as unknown as jest.Mocked<Repository<T>>;
}
