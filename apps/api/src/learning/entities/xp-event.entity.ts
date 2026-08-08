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

export enum XpEventType {
  ACTIVITY_COMPLETED = 'ACTIVITY_COMPLETED',
  QUIZ_PASSED = 'QUIZ_PASSED',
}

@Entity('xp_events')
@Index('UQ_xp_event_child_source', ['childId', 'sourceKey'], { unique: true })
export class XpEvent {
  @PrimaryGeneratedColumn() id!: number;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'childId' })
  child!: User;
  @Column() childId!: number;
  @Column({ type: 'enum', enum: XpEventType }) type!: XpEventType;
  @Column({ type: 'varchar', length: 160 }) sourceKey!: string;
  @Column({ type: 'int' }) amount!: number;
  @Column({ type: 'simple-json', nullable: true }) metadata!: Record<
    string,
    unknown
  > | null;
  @CreateDateColumn() createdAt!: Date;
}
