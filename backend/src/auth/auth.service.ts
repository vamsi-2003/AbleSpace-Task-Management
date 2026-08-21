import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(dto: {
    email: string;
    fullName?: string;
    username?: string;
    title?: string;
    avatarUrl?: string;
  }): Promise<{ user: User; token: string }> {
    let existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      if (dto.fullName) existing.fullName = dto.fullName;
      if (dto.username) existing.username = dto.username;
      if (dto.title) existing.title = dto.title;
      if (dto.avatarUrl) existing.avatarUrl = dto.avatarUrl;
      const updated = await this.userRepository.save(existing);
      return { user: updated, token: `user-token-${updated.id}` };
    }

    const emailPrefix = dto.email.split('@')[0].toLowerCase();
    const newUser = this.userRepository.create({
      email: dto.email,
      fullName: dto.fullName || emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1),
      username: dto.username || emailPrefix,
      title: dto.title || 'Full Stack Developer',
      avatarUrl: dto.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isGuest: false,
    });

    const saved = await this.userRepository.save(newUser);
    return { user: saved, token: `user-token-${saved.id}` };
  }

  async login(dto: { email: string }): Promise<{ user: User; token: string }> {
    let user = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.email.split('@')[0] }],
    });

    if (!user) {
      // Auto-create user on first login with clean derived credentials
      return this.register({ email: dto.email });
    }

    return { user, token: `user-token-${user.id}` };
  }

  async createGuestUser(dto?: { fullName?: string; title?: string }): Promise<{ user: User; token: string }> {
    const guestId = Math.floor(Math.random() * 10000);
    const guestUser = this.userRepository.create({
      fullName: dto?.fullName || 'Guest User',
      email: `guest_${guestId}@ablespace.io`,
      isGuest: true,
      title: dto?.title || 'Product Specialist',
      username: `guest_${guestId}`,
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
    return { user, token: `google-token-${user.id}` };
  }
}
