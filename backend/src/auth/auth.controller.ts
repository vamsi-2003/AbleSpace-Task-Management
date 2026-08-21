import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  async guestLogin(@Body() dto?: { fullName?: string; title?: string }) {
    return this.authService.createGuestUser(dto);
  }

  @Post('register')
  async register(@Body() dto: { email: string; fullName?: string; username?: string; title?: string; avatarUrl?: string }) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: { email: string }) {
    return this.authService.login(dto);
  }

  @Post('google')
  async googleLogin() {
    return this.authService.mockGoogleAuth();
  }
}
