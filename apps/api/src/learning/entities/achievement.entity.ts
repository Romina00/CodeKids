import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reward } from './reward.entity';

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 80, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 120 })
  title!: string;

  @Column({ type: 'varchar', length: 255 })
  description!: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  icon!: string | null;

  @Column({ type: 'simple-json' })
  criteria!: Record<string, unknown>;

  @Column({ type: 'int', default: 0 })
  points!: number;

  @Column({ default: true })
  active!: boolean;

  @OneToMany(() => Reward, (reward) => reward.achievement)
  rewards!: Reward[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
