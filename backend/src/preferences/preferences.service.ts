import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreference } from '../entities/user-preference.entity';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(UserPreference)
    private prefRepo: Repository<UserPreference>,
  ) {}

  async getPreferences(userId: string = 'default-user'): Promise<UserPreference> {
    let pref = await this.prefRepo.findOne({ where: { userId } });
    if (!pref) {
      pref = this.prefRepo.create({
        userId,
        themeMode: 'light',
        accentColor: 'amber',
      });
      pref = await this.prefRepo.save(pref);
    }
    return pref;
  }

  async updatePreferences(
    userId: string = 'default-user',
    dto: { themeMode?: string; accentColor?: string },
  ): Promise<UserPreference> {
    let pref = await this.prefRepo.findOne({ where: { userId } });
    if (!pref) {
      pref = this.prefRepo.create({
        userId,
        themeMode: dto.themeMode || 'light',
        accentColor: dto.accentColor || 'amber',
      });
    } else {
      if (dto.themeMode) pref.themeMode = dto.themeMode;
      if (dto.accentColor) pref.accentColor = dto.accentColor;
    }
    return this.prefRepo.save(pref);
  }
}
