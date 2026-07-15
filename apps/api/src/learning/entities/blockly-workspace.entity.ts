import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Activity } from './activity.entity';

@Entity('blockly_workspaces')
@Index('UQ_blockly_workspace_child_activity', ['childId', 'activityId'], {
  unique: true,
})
export class BlocklyWorkspace {
  @PrimaryGeneratedColumn() id!: number;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'childId' })
  child!: User;
  @Column() childId!: number;
  @ManyToOne(() => Activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activityId' })
  activity!: Activity;
  @Column() activityId!: number;
  @Column({ type: 'simple-json' }) workspace!: {
    blocks: Array<{ id: string; type: string; fields: Record<string, string> }>;
  };
  @Column({ type: 'int', default: 1 }) revision!: number;
  @Column({ default: false }) completed!: boolean;
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
