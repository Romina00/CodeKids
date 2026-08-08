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
import { Progress } from './progress.entity';

export enum ActivityType {
  LESSON = 'LESSON',
  BLOCKLY = 'BLOCKLY',
  CHALLENGE = 'CHALLENGE',
}

@Entity('activities')
@Index('IDX_activities_level_position', ['levelId', 'position'])
export class Activity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Level, (level) => level.activities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'levelId' })
  level!: Level;

  @Column()
  levelId!: number;

  @Column({ type: 'varchar', length: 120 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'enum', enum: ActivityType })
  type!: ActivityType;

  @Column({ type: 'simple-json', nullable: true })
  content!: Record<string, unknown> | null;

  @Column({ type: 'int', default: 0 })
  position!: number;

  @Column({ type: 'int', default: 0 })
  estimatedMinutes!: number;

  @OneToMany(() => Progress, (progress) => progress.activity)
  progressRecords!: Progress[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
