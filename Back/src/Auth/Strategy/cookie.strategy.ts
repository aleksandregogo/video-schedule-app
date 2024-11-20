import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { UserService } from 'src/User/user.service';
import { AuthProvider, UserInfo } from 'src/User/Interface/UserInfoInterface';
import { User } from 'src/Entities/user.entity';

@Injectable()
export class CookieStrategy extends PassportStrategy(Strategy, 'cookie') {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const token = req.cookies['auth_token'];
    if (!token) {
      throw new UnauthorizedException('No token found in cookies');
    }

    try {
      const payload = this.authService.verifyJwt(token);

      let existingUser: User;

      if (payload.authProvider === AuthProvider.facebook) {
        existingUser = await this.userService.findByFacebookId(payload.userProviderId);
      } else if (payload.authProvider = AuthProvider.googleOauth2) {
        existingUser = await this.userService.findByGoogleId(payload.userProviderId);
      }

      return payload;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}