import { Controller, Get, Patch, Post, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Query('userId') userId?: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  async updateProfile(@Query('userId') userId: string, @Body() dto: any) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Post('me/leave-workspace')
  async leaveWorkspace(@Query('userId') userId: string) {
    return this.usersService.leaveWorkspace(userId);
  }
}
