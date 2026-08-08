import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Level } from './level.entity';
import { Question } from './question.entity';

@Entity('quizzes')
@Index('IDX_quizzes_level', ['levelId'])
export class Quiz {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Level, (level) => level.quizzes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'levelId' })
  level!: Level;

  @Column()
  levelId!: number;

  @Column({ type: 'varchar', length: 120 })
  title!: string;

  @Column({ type: 'int', default: 70 })
  passingScore!: number;

  @Column({ type: 'int', nullable: true })
  maxAttempts!: number | null;

  @Column({ default: false })
  published!: boolean;

  @OneToMany(() => Question, (question) => question.quiz, { cascade: true })
  questions!: Question[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
