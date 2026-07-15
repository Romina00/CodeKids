import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from './quiz.entity';

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

@Entity('questions')
@Index('IDX_questions_quiz_position', ['quizId', 'position'])
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz!: Quiz;

  @Column()
  quizId!: number;

  @Column({ type: 'text' })
  prompt!: string;

  @Column({ type: 'enum', enum: QuestionType })
  type!: QuestionType;

  @Column({ type: 'simple-json' })
  options!: string[];

  @Column({ type: 'simple-json', select: false })
  correctAnswers!: string[];

  @Column({ type: 'text', nullable: true })
  explanation!: string | null;

  @Column({ type: 'int', default: 0 })
  position!: number;

  @Column({ type: 'int', default: 1 })
  points!: number;
}
