import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Role } from '../users/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService) {}

  async getOverview() {
    const users = await this.usersService.listAllUsers();
    const parents = users
      .filter((user) => user.role === Role.PARENT)
      .map((user) => this.usersService.serializeUser(user));
    const children = users
      .filter((user) => user.role === Role.KID)
      .map((user) => this.usersService.serializeUser(user));
    const admins = users
      .filter((user) => user.role === Role.ADMIN)
      .map((user) => this.usersService.serializeUser(user));

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
}
