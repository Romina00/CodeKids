import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Activity } from './activity.entity';
import { Progress } from './progress.entity';
import { Quiz } from './quiz.entity';

@Entity('levels')
export class Level {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 120, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 120 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'int', default: 0 })
  position!: number;

  @Column({ default: false })
  published!: boolean;

  @ManyToOne(() => Level, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'prerequisiteLevelId' })
  prerequisiteLevel!: Level | null;

  @Column({ nullable: true })
  prerequisiteLevelId!: number | null;

  @OneToMany(() => Activity, (activity) => activity.level)
  activities!: Activity[];

  @OneToMany(() => Quiz, (quiz) => quiz.level)
  quizzes!: Quiz[];

  @OneToMany(() => Progress, (progress) => progress.level)
  progressRecords!: Progress[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
