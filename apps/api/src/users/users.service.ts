import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Progress } from '../learning/entities/progress.entity';
import { Reward } from '../learning/entities/reward.entity';
import { Role, User } from './entities/user.entity';

interface ParentRegistrationInput {
  displayName?: string;
  email: string;
  password: string;
}

interface ParentProfileInput {
  displayName?: string;
  email?: string;
}

interface ChildProfileInput {
  nickname: string;
  avatar: string;
  birthYear: number;
  learningLevel?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
    @InjectRepository(Reward)
    private readonly rewardsRepository: Repository<Reward>,
  ) {}

  async createParent(input: ParentRegistrationInput): Promise<User> {
    const email = this.normalizeEmail(input.email);
    this.ensurePasswordStrength(input.password);

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email address is already registered.');
    }

    const user = this.usersRepository.create({
      email,
      passwordHash: await bcrypt.hash(input.password, 10),
      role: Role.PARENT,
      displayName: input.displayName?.trim() || email.split('@')[0],
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: this.normalizeEmail(email) },
      relations: { parent: true },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: { parent: true, children: true },
    });
  }

  async findParentForChild(childId: number): Promise<User> {
    const child = await this.usersRepository.findOne({
      where: { id: childId, role: Role.KID },
      relations: { parent: true },
    });
    if (!child?.parent || child.parent.role !== Role.PARENT) {
      throw new NotFoundException('Parent account was not found.');
    }
    return child.parent;
  }

  async listAllUsers(): Promise<User[]> {
    return this.usersRepository.find({
      relations: { parent: true },
      order: { createdAt: 'ASC' },
    });
  }

  async listSerializedUsers() {
    const users = await this.listAllUsers();
    return users.map((user) => this.serializeUser(user));
  }

  async setRefreshToken(
    userId: number,
    refreshToken: string | null,
  ): Promise<void> {
    const refreshTokenHash = refreshToken
      ? await bcrypt.hash(refreshToken, 10)
      : null;
    await this.usersRepository.update(userId, { refreshTokenHash });
  }

  async verifyRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<User> {
    const user = await this.findById(userId);
    if (user?.blockedAt) throw new BadRequestException('Account is blocked.');
    if (!user?.refreshTokenHash) {
      throw new BadRequestException('Refresh token is not active.');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      throw new BadRequestException('Refresh token is invalid.');
    }

    return user;
  }

  async updateParentProfile(
    parentId: number,
    input: ParentProfileInput,
  ): Promise<User> {
    const parent = await this.getOwnedParent(parentId);
    const nextEmail = input.email
      ? this.normalizeEmail(input.email)
      : undefined;

    if (nextEmail && nextEmail !== parent.email) {
      const existing = await this.usersRepository.findOne({
        where: { email: nextEmail },
      });
      if (existing) {
        throw new ConflictException('Email address is already registered.');
      }
      parent.email = nextEmail;
    }

    if (typeof input.displayName === 'string') {
      parent.displayName = input.displayName.trim() || parent.displayName;
    }

    return this.usersRepository.save(parent);
  }

  async changeParentPassword(
    parentId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const parent = await this.getOwnedParent(parentId);
    if (!parent.passwordHash) {
      throw new BadRequestException('Password login is not configured.');
    }

    const matches = await bcrypt.compare(currentPassword, parent.passwordHash);
    if (!matches) {
      throw new BadRequestException('Current password is incorrect.');
    }

    this.ensurePasswordStrength(newPassword);
    parent.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.save(parent);
  }

  async createChildProfile(
    parentId: number,
    input: ChildProfileInput,
  ): Promise<User> {
    const parent = await this.getOwnedParent(parentId);
    this.validateChildProfile(input);

    const child = this.usersRepository.create({
      role: Role.KID,
      parentId: parent.id,
      parent,
      nickname: input.nickname.trim(),
      avatar: input.avatar.trim(),
      birthYear: input.birthYear,
      learningLevel: input.learningLevel?.trim() || null,
      displayName: input.nickname.trim(),
    });

    return this.usersRepository.save(child);
  }

  async updateChildProfile(
    parentId: number,
    childId: number,
    input: Partial<ChildProfileInput>,
  ): Promise<User> {
    const child = await this.getOwnedChild(parentId, childId);

    if (typeof input.nickname === 'string' && input.nickname.trim()) {
      child.nickname = input.nickname.trim();
      child.displayName = input.nickname.trim();
    }
    if (typeof input.avatar === 'string' && input.avatar.trim()) {
      child.avatar = input.avatar.trim();
    }
    if (typeof input.birthYear === 'number') {
      this.validateBirthYear(input.birthYear);
      child.birthYear = input.birthYear;
    }
    if (typeof input.learningLevel === 'string') {
      child.learningLevel = input.learningLevel.trim() || null;
    }

    return this.usersRepository.save(child);
  }

  getChildForParent(parentId: number, childId: number): Promise<User> {
    return this.getOwnedChild(parentId, childId);
  }

  async listChildrenForParent(parentId: number): Promise<User[]> {
    await this.getOwnedParent(parentId);
    return this.usersRepository.find({
      where: { parentId, role: Role.KID },
      order: { createdAt: 'ASC' },
    });
  }

  async markChildKidsMode(parentId: number, childId: number): Promise<User> {
    const child = await this.getOwnedChild(parentId, childId);
    child.lastKidsModeAt = new Date();
    return this.usersRepository.save(child);
  }

  async getParentDashboard(parentId: number) {
    const parent = await this.getOwnedParent(parentId);
    const children = await this.listChildrenForParent(parent.id);
    const childIds = children.map((child) => child.id);

    const progress = childIds.length
      ? await this.progressRepository.find({
          where: childIds.map((childId) => ({ childId })),
        })
      : [];
    const rewards = childIds.length
      ? await this.rewardsRepository.find({
          where: childIds.map((childId) => ({ childId })),
        })
      : [];

    const childrenSummary = children.map((child) => {
      const childProgress = progress.filter(
        (item) => item.childId === child.id,
      );
      const childRewards = rewards.filter((item) => item.childId === child.id);
      const completedLevels = childProgress.filter(
        (item) => item.completed,
      ).length;
      const timeSpentMinutes = childProgress.reduce(
        (total, item) => total + item.timeSpentMinutes,
        0,
      );

      return {
        id: child.id,
        nickname: child.nickname,
        avatar: child.avatar,
        birthYear: child.birthYear,
        learningLevel: child.learningLevel,
        completedLevels,
        earnedRewards: childRewards.length,
        learningStatistics: {
          records: childProgress.length,
          averageScore: childProgress.length
            ? Math.round(
                childProgress.reduce((total, item) => total + item.score, 0) /
                  childProgress.length,
              )
            : 0,
        },
        timeSpentMinutes,
      };
    });

    return {
      parent: {
        id: parent.id,
        email: parent.email,
        displayName: parent.displayName,
      },
      children: childrenSummary,
      totals: {
        children: children.length,
        completedLevels: childrenSummary.reduce(
          (total, child) => total + child.completedLevels,
          0,
        ),
        rewards: childrenSummary.reduce(
          (total, child) => total + child.earnedRewards,
          0,
        ),
        timeSpentMinutes: childrenSummary.reduce(
          (total, child) => total + child.timeSpentMinutes,
          0,
        ),
      },
    };
  }

  serializeUser(user: User) {
    return {
      id: user.id,
      role: user.role,
      email: user.email,
      displayName: user.displayName,
      parentId: user.parentId,
      parentEmail: user.parent?.email ?? null,
      nickname: user.nickname,
      avatar: user.avatar,
      birthYear: user.birthYear,
      learningLevel: user.learningLevel,
      lastKidsModeAt: user.lastKidsModeAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async getOwnedParent(parentId: number): Promise<User> {
    const parent = await this.usersRepository.findOne({
      where: { id: parentId },
    });
    if (!parent || parent.role !== Role.PARENT) {
      throw new NotFoundException('Parent account was not found.');
    }
    return parent;
  }

  private async getOwnedChild(
    parentId: number,
    childId: number,
  ): Promise<User> {
    const child = await this.usersRepository.findOne({
      where: { id: childId, parentId },
    });
    if (!child || child.role !== Role.KID) {
      throw new NotFoundException('Child profile was not found.');
    }
    return child;
  }

  private normalizeEmail(email: string): string {
    const normalized = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalized)) {
      throw new BadRequestException('Email address format is invalid.');
    }
    return normalized;
  }

  private ensurePasswordStrength(password: string): void {
    const strongPassword =
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password);

    if (!strongPassword) {
      throw new BadRequestException(
        'Password must be at least 8 characters and include upper, lower, and numeric characters.',
      );
    }
  }

  private validateChildProfile(input: ChildProfileInput): void {
    if (!input.nickname?.trim()) {
      throw new BadRequestException('Nickname is required.');
    }
    if (!input.avatar?.trim()) {
      throw new BadRequestException('Avatar is required.');
    }
    this.validateBirthYear(input.birthYear);
  }

  private validateBirthYear(birthYear: number): void {
    const currentYear = new Date().getFullYear();
    if (
      !Number.isInteger(birthYear) ||
      birthYear < 1900 ||
      birthYear > currentYear
    ) {
      throw new BadRequestException('Birth year is invalid.');
    }
  }
}
