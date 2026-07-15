import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Achievement } from './achievement.entity';

@Entity('rewards')
export class Reward {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.rewards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'childId' })
  child!: User;

  @Column()
  childId!: number;

  @ManyToOne(() => Achievement, (achievement) => achievement.rewards, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'achievementId' })
  achievement!: Achievement | null;

  @Column({ nullable: true })
  achievementId!: number | null;

  @Column({ type: 'varchar', length: 120 })
  title!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @Column({ type: 'simple-json', nullable: true })
  metadata!: Record<string, unknown> | null;

  @CreateDateColumn()
  earnedAt!: Date;
}
