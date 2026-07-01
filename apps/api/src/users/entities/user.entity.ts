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
import { Progress } from '../../learning/entities/progress.entity';
import { Reward } from '../../learning/entities/reward.entity';

export enum Role {
  PARENT = 'PARENT',
  KID = 'KID',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: Role, default: Role.PARENT })
  role!: Role;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordHash!: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  displayName!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshTokenHash!: string | null;

  @ManyToOne(() => User, (user) => user.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent!: User | null;

  @Column({ nullable: true })
  parentId!: number | null;

  @OneToMany(() => User, (user) => user.parent)
  children!: User[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  nickname!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar!: string | null;

  @Column({ type: 'int', nullable: true })
  birthYear!: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  learningLevel!: string | null;

  @Column({ type: 'datetime', nullable: true })
  lastKidsModeAt!: Date | null;

  @OneToMany(() => Progress, (progress) => progress.child)
  progressRecords!: Progress[];

  @OneToMany(() => Reward, (reward) => reward.child)
  rewards!: Reward[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
