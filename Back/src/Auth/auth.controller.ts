import { Controller, Get, UseGuards, Req, Res, Delete } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Request, Response } from 'express';
import { User } from "src/Entities/user.entity";
import { AuthProvider, UserInfo } from "src/User/Interface/UserInfoInterface";
import { SuccessResponseObjectDto } from "src/Response/SuccessResponseObject.dto";
import { UserPresentation } from "src/User/Presentation/user.presentation";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { CampaignService } from "src/Campaign/campaign.service";

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly campaignService: CampaignService
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))  // Triggers OAuth login
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;

    const token = this.authService.generateJwt(user, AuthProvider.googleOauth2, user.googleId);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      path: '/',
    });

    res.redirect(this.configService.get('AUTH_SUCCESS_REDIRECT_URL'));
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook')) // Triggers OAuth login
  async facebookAuth() {}

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

    res.redirect(this.configService.get('AUTH_SUCCESS_REDIRECT_URL'));
  }

  @Get('user')
  @UseGuards(AuthGuard('cookie'))
  async getUser(@Req() req: Request) {
    const userInfo = req.user as UserInfo;
    
    const campaignCount = await this.campaignService.getCampaignsCount(userInfo);

    return new SuccessResponseObjectDto({
      data: new UserPresentation().present(userInfo.user, userInfo.company, campaignCount)
    })
  }

  @Delete('logout')
  @UseGuards(AuthGuard('cookie'))
  async logout(@Res() res: Response) {
    res.clearCookie('auth_token');

    res.status(204).send();
  }
}