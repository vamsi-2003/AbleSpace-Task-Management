import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  async guestLogin() {
    return this.authService.createGuestUser();
  }

  @Post('google')
  async googleLogin() {
    return this.authService.mockGoogleAuth();
  }
}
