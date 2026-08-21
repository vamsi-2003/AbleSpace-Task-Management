import { Controller, Get, Put, Body, Query } from '@nestjs/common';
import { PreferencesService } from './preferences.service';

@Controller('users/me/preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  async getPreferences(@Query('userId') userId?: string) {
    return this.preferencesService.getPreferences(userId || 'default-user');
  }

  @Put()
  async updatePreferences(
    @Query('userId') userId: string,
    @Body() dto: { themeMode?: string; accentColor?: string },
  ) {
    return this.preferencesService.updatePreferences(userId || 'default-user', dto);
  }
}
