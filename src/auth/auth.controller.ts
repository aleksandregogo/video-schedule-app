import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    console.log('Google Auth route hit');
    // This will trigger Google OAuth login
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    console.log('Google Auth callback route hit');
    return {
      message: 'User information from Google',
      user: req.user,
    };
  }
}