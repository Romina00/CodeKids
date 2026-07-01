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

  @Column({ type: 'varchar', length: 100 })
  levelId!: string;

  @Column({ default: false })
  completed!: boolean;

  @Column({ type: 'int', default: 0 })
  score!: number;

  @Column({ type: 'int', default: 0 })
  timeSpentMinutes!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
