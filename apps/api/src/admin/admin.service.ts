import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Role, User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AdminAuditEvent } from './admin-audit.entity';
import { LandingContent } from './landing-content.entity';
import {
  CreateLandingContentDto,
  UpdateLandingContentDto,
} from './landing-content.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(AdminAuditEvent)
    private readonly audit: Repository<AdminAuditEvent>,
    @InjectRepository(LandingContent)
    private readonly landing: Repository<LandingContent>,
  ) {}

  async getOverview() {
    const users = await this.usersService.listAllUsers();
    const byRole = (role: Role) =>
      users
        .filter((user) => user.role === role)
        .map((user) => this.usersService.serializeUser(user));
    const parents = byRole(Role.PARENT),
      children = byRole(Role.KID),
      admins = byRole(Role.ADMIN);
    return {
      totals: {
        users: users.length,
        parents: parents.length,
        children: children.length,
        admins: admins.length,
      },
      parents,
      children,
      admins,
      permissions: [
        'User Management',
        'Parent Management',
        'Child Management',
        'Level Management',
        'Statistics',
        'Platform Configuration',
      ],
    };
  }

  async searchUsers(query?: string, role?: Role) {
    const where: FindOptionsWhere<User>[] = [];
    const q = query?.trim();
    for (const field of ['email', 'displayName', 'nickname'] as const)
      where.push({
        ...(role ? { role } : {}),
        ...(q ? { [field]: ILike(`%${q}%`) } : {}),
      });
    const users = await this.users.find({
      where,
      order: { createdAt: 'DESC' },
      take: 100,
    });
    return users.map((user) => ({
      ...this.usersService.serializeUser(user),
      blockedAt: user.blockedAt,
      blockedReason: user.blockedReason,
      recoveryRequestedAt: user.recoveryRequestedAt,
    }));
  }

  async setBlocked(
    actorAdminId: number,
    targetUserId: number,
    blocked: boolean,
    reason?: string,
  ) {
    if (actorAdminId === targetUserId)
      throw new BadRequestException(
        'Administrators cannot block their own account.',
      );
    const user = await this.requireUser(targetUserId);
    user.blockedAt = blocked ? new Date() : null;
    user.blockedReason = blocked
      ? reason?.trim() || 'Blocked by administrator'
      : null;
    if (blocked) user.refreshTokenHash = null;
    await this.users.save(user);
    await this.log(
      actorAdminId,
      targetUserId,
      blocked ? 'ACCOUNT_BLOCKED' : 'ACCOUNT_UNBLOCKED',
      { reason: user.blockedReason },
    );
    return {
      ...this.usersService.serializeUser(user),
      blockedAt: user.blockedAt,
      blockedReason: user.blockedReason,
    };
  }

  async initiateRecovery(actorAdminId: number, targetUserId: number) {
    const user = await this.requireUser(targetUserId);
    if (user.role !== Role.PARENT || !user.email)
      throw new BadRequestException(
        'Password recovery is available only for parent email accounts.',
      );
    user.recoveryRequestedAt = new Date();
    user.refreshTokenHash = null;
    await this.users.save(user);
    await this.log(actorAdminId, targetUserId, 'PASSWORD_RECOVERY_REQUESTED', {
      delivery: 'email-simulated',
    });
    return {
      accepted: true,
      message: 'If delivery is configured, recovery instructions will be sent.',
    };
  }

  listAudit() {
    return this.audit.find({ order: { createdAt: 'DESC' }, take: 200 });
  }

  findPublishedContent() {
    return this.landing.find({
      where: { published: true },
      order: { position: 'ASC', id: 'ASC' },
    });
  }

  listAllContent() {
    return this.landing.find({ order: { position: 'ASC', id: 'ASC' } });
  }

  createContent(actorAdminId: number, dto: CreateLandingContentDto) {
    return this.landing.save(
      this.landing.create({
        ...dto,
        version: 1,
        updatedByAdminId: actorAdminId,
      }),
    );
  }

  async updateContent(
    actorAdminId: number,
    id: number,
    dto: UpdateLandingContentDto,
  ) {
    const item = await this.landing.findOneBy({ id });
    if (!item) throw new NotFoundException('Landing content not found.');
    if (item.version !== dto.expectedVersion)
      throw new ConflictException(
        'Landing content changed; reload before saving.',
      );
    const changes = { ...dto };
    delete (changes as Partial<UpdateLandingContentDto>).expectedVersion;
    return this.landing.save(
      this.landing.merge(item, {
        ...changes,
        version: item.version + 1,
        updatedByAdminId: actorAdminId,
      }),
    );
  }

  async removeContent(id: number) {
    const item = await this.landing.findOneBy({ id });
    if (!item) throw new NotFoundException('Landing content not found.');
    await this.landing.remove(item);
    return { deleted: true, id };
  }
  private async requireUser(id: number) {
    const user = await this.users.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }
  private log(
    actorAdminId: number,
    targetUserId: number,
    action: string,
    metadata: Record<string, unknown> | null,
  ) {
    return this.audit.save(
      this.audit.create({ actorAdminId, targetUserId, action, metadata }),
    );
  }
}
