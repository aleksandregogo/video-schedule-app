import { Controller, Get, UseGuards, Req, Res, HttpStatus } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Request, Response } from 'express';
import { UserService } from "src/User/user.service";
import { User } from "src/Entities/user.entity";
import { AuthProvider } from "src/User/Interface/UserInfoInterface";
import { SuccessResponseObjectDto } from "src/Response/SuccessResponseObject.dto";
import { UserPresentation } from "src/User/Presentation/user.presentation";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const user = req.user;
    return { message: 'Google login successful', user };
  }

  @Get('facebook') // Trigger Facebook OAuth login
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req) {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;

    const token = this.authService.generateJwt(user, AuthProvider.facebook, user.facebookId);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      path: '/',
    });

    res.redirect('http://localhost:3000/dashboard');
  }

  @Get('user')
  @UseGuards(AuthGuard('cookie'))
  async getUser(@Req() req: Request) {
    const user = req.user as User;

    return new SuccessResponseObjectDto({
      data: new UserPresentation().present(user)
    })
  }

  @Get('logout')
  @UseGuards(AuthGuard('cookie'))
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('auth_token');

    res.send();
  }
}