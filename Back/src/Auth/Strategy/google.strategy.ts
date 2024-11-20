import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/User/user.service';
import { User } from 'src/Entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    let existingUser = await this.userService.findByGoogleId(profile.id);
    if (!existingUser) {
      const user = {
        googleId: profile.id || '',
        userName: profile._json?.name || '',
        email: profile.emails?.[0]?.value || null,
        name: profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim(),
        personalNumber: profile?.phoneNumber || null,
        profilePicture: profile.photos?.[0]?.value || null,
      } as User;

      existingUser = await this.userService.create(user);
    }

    done(null, existingUser); 
  }
}