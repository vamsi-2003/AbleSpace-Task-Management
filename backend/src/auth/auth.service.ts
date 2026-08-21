import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createGuestUser(): Promise<{ user: User; token: string }> {
    const guestUser = this.userRepository.create({
      fullName: 'Guest User',
      email: `guest_${Date.now()}@ablespace.io`,
      isGuest: true,
      title: 'Product Specialist',
      username: `guest_${Math.floor(Math.random() * 10000)}`,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });
    const savedUser = await this.userRepository.save(guestUser);
    return {
      user: savedUser,
      token: `guest-token-${savedUser.id}`,
    };
  }

  async mockGoogleAuth(): Promise<{ user: User; token: string }> {
    let user = await this.userRepository.findOne({ where: { email: 'alex.morgan@ablespace.io' } });
    if (!user) {
      user = this.userRepository.create({
        fullName: 'Alex Morgan',
        email: 'alex.morgan@ablespace.io',
        isGuest: false,
        title: 'Lead Architect',
        username: 'alexm',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      });
      user = await this.userRepository.save(user);
    }
    return {
      user,
      token: `google-token-${user.id}`,
    };
  }
}
