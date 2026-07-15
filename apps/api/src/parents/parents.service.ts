import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { UpdateParentProfileDto } from './dto/update-parent-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class ParentsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  getDashboard(parentId: number) {
    return this.usersService.getParentDashboard(parentId);
  }

  listChildren(parentId: number) {
    return this.usersService
      .listChildrenForParent(parentId)
      .then((children) =>
        children.map((child) => this.usersService.serializeUser(child)),
      );
  }

  createChild(parentId: number, body: CreateChildDto) {
    return this.usersService
      .createChildProfile(parentId, {
        nickname: body.nickname,
        avatar: body.avatar,
        birthYear: body.birthYear,
        learningLevel: body.learningLevel,
        invitationToken: body.invitationToken,
      })
      .then((child) => this.usersService.serializeUser(child));
  }

  updateChild(parentId: number, childId: number, body: UpdateChildDto) {
    return this.usersService
      .updateChildProfile(parentId, childId, body)
      .then((child) => this.usersService.serializeUser(child));
  }

  async openKidsMode(parentId: number, childId: number) {
    const child = await this.usersService.markChildKidsMode(parentId, childId);
    const tokens = await this.authService.issueSession(child);

    return {
      child: {
        id: child.id,
        nickname: child.nickname,
        avatar: child.avatar,
        learningLevel: child.learningLevel,
      },
      kidsMode: {
        visible: [
          'Learning Levels',
          'Activities',
          'Quizzes',
          'Blockly Tasks',
          'Rewards',
          'Profile Progress',
        ],
        hidden: [
          'Parent Dashboard',
          'Parent Settings',
          'Admin Features',
          'User Management',
        ],
      },
      ...tokens,
      redirectTo: `/kids-panel/${child.id}`,
    };
  }

  updateParentProfile(parentId: number, body: UpdateParentProfileDto) {
    return this.usersService
      .updateParentProfile(parentId, body)
      .then((parent) => this.usersService.serializeUser(parent));
  }

  async changePassword(parentId: number, body: ChangePasswordDto) {
    if (body.newPassword !== body.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    await this.usersService.changeParentPassword(
      parentId,
      body.currentPassword,
      body.newPassword,
    );

    return { success: true };
  }
}
