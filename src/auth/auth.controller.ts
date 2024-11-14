import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('google')
  async googleAuth(@Req() req) {
    console.log('Google Auth route hit');
    return '0k';
    // This will trigger Google OAuth login
  }

  async googleAuthRedirect(@Req() req) {
    console.log('Google Auth callback route hit');
    return {
      message: 'User information from Googlesss',
      user: req.user,
    };
  }
}