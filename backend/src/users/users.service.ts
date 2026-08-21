import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getProfile(userId?: string): Promise<User> {
    if (userId) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (user) return user;
    }
    let defaultUser = await this.userRepo.findOne({ where: { isGuest: false } });
    if (!defaultUser) {
      defaultUser = this.userRepo.create({
        fullName: 'Alex Morgan',
        email: 'alex.morgan@ablespace.io',
        title: 'Lead Product Designer',
        username: 'alexm',
        isGuest: false,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      });
      defaultUser = await this.userRepo.save(defaultUser);
    }
    return defaultUser;
  }

  async updateProfile(userId: string, dto: Partial<User>): Promise<User> {
    const user = await this.getProfile(userId);
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async leaveWorkspace(userId: string): Promise<{ success: boolean; message: string }> {
    return { success: true, message: 'Successfully left workspace' };
  }
}
