import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('landing_content')
export class LandingContent {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ type: 'varchar', length: 120, unique: true }) key!: string;
  @Column({ type: 'varchar', length: 120 }) title!: string;
  @Column({ type: 'simple-json' }) content!: Record<string, unknown>;
  @Column({ type: 'int', default: 0 }) position!: number;
  @Column({ default: false }) published!: boolean;
  @Column({ type: 'int', default: 1 }) version!: number;
  @Column() updatedByAdminId!: number;
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
