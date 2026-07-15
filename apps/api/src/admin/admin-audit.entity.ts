import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('admin_audit_events')
@Index('IDX_admin_audit_target_created', ['targetUserId', 'createdAt'])
export class AdminAuditEvent {
  @PrimaryGeneratedColumn() id!: number;
  @Column() actorAdminId!: number;
  @Column() targetUserId!: number;
  @Column({ type: 'varchar', length: 80 }) action!: string;
  @Column({ type: 'simple-json', nullable: true }) metadata!: Record<
    string,
    unknown
  > | null;
  @CreateDateColumn() createdAt!: Date;
}
