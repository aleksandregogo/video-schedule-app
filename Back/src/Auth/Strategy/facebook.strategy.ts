import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-facebook';
import { UserService } from 'src/User/user.service';
import { User } from 'src/Entities/user.entity';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID'),
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK_APP_REDIRECT_URL'),
      profileFields: ['id', 'email', 'name', 'photos'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    let existingUser = await this.userService.findByFacebookId(profile.id);
    if (!existingUser) {
      const user = {
        facebookId: profile.id || null,
        userName: profile.username || null,
        name: profile.name?.givenName || null,
        email: profile.emails?.[0]?.value || null,
        profilePicture: profile.photos?.[0]?.value || null,
      } as User;

      existingUser = await this.userService.create(user);
    }

    done(null, existingUser);
  }
}
