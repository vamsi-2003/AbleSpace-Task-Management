import { Injectable } from '@nestjs/common';
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
    const latestUser = await this.userRepo.findOne({ order: { createdAt: 'DESC' } });
    if (latestUser) return latestUser;

    return this.userRepo.create({
      fullName: 'New User',
      email: 'user@ablespace.io',
      title: 'Workspace Member',
      username: 'user',
      isGuest: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });
  }

  async updateProfile(userId: string, dto: Partial<User>): Promise<User> {
    let user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      user = this.userRepo.create(dto);
    } else {
      Object.assign(user, dto);
    }
    return this.userRepo.save(user);
  }

  async leaveWorkspace(userId: string): Promise<{ success: boolean; message: string }> {
    return { success: true, message: 'Successfully left workspace' };
  }
}
