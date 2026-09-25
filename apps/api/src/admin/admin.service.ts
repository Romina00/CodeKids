import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Role, User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async getOverview() {
    const users = await this.usersService.listAllUsers();
    const byRole = (role: Role) =>
      users
        .filter((user) => user.role === role)
        .map((user) => ({
          ...this.usersService.serializeUser(user),
          blockedAt: user.blockedAt,
          blockedReason: user.blockedReason,
        }));
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
    return {
      ...this.usersService.serializeUser(user),
      blockedAt: user.blockedAt,
      blockedReason: user.blockedReason,
    };
  }

  async initiateRecovery(targetUserId: number) {
    const user = await this.requireUser(targetUserId);
    if (user.role !== Role.PARENT || !user.email)
      throw new BadRequestException(
        'Password recovery is available only for parent email accounts.',
      );
    user.recoveryRequestedAt = new Date();
    user.refreshTokenHash = null;
    await this.users.save(user);
    return {
      accepted: true,
      message: 'If delivery is configured, recovery instructions will be sent.',
    };
  }

  private async requireUser(id: number) {
    const user = await this.users.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }
}
