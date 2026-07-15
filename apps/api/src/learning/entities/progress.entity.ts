import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Activity } from './activity.entity';
import { Level } from './level.entity';

export enum ProgressStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity('progress')
export class Progress {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.progressRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'childId' })
  child!: User;

  @Column()
  childId!: number;

  @ManyToOne(() => Level, (level) => level.progressRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'levelId' })
  level!: Level;

  @Column()
  levelId!: number;

  @ManyToOne(() => Activity, (activity) => activity.progressRecords, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'activityId' })
  activity!: Activity | null;

  @Column({ nullable: true })
  activityId!: number | null;

  @Column({
    type: 'enum',
    enum: ProgressStatus,
    default: ProgressStatus.NOT_STARTED,
  })
  status!: ProgressStatus;

  @Column({ default: false })
  completed!: boolean;

  @Column({ type: 'int', default: 0 })
  score!: number;

  @Column({ type: 'int', default: 0 })
  timeSpentMinutes!: number;

  @Column({ type: 'int', default: 0 })
  attempts!: number;

  @Column({ type: 'datetime', nullable: true })
  startedAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  completedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
