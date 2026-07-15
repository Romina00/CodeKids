import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Quiz } from './quiz.entity';

@Entity('quiz_attempts')
@Index(
  'UQ_quiz_attempt_child_quiz_number',
  ['childId', 'quizId', 'attemptNumber'],
  { unique: true },
)
export class QuizAttempt {
  @PrimaryGeneratedColumn() id!: number;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'childId' })
  child!: User;
  @Column() childId!: number;
  @ManyToOne(() => Quiz, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz!: Quiz;
  @Column() quizId!: number;
  @Column({ type: 'int' }) attemptNumber!: number;
  @Column({ type: 'int' }) score!: number;
  @Column() passed!: boolean;
  @Column({ type: 'simple-json' }) answers!: Array<{
    questionId: number;
    selectedAnswers: string[];
    correct: boolean;
  }>;
  @CreateDateColumn() submittedAt!: Date;
}
