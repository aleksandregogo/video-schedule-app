import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './Strategy/google.strategy';
import { FacebookStrategy } from './Strategy/facebook.strategy';
import { UserService } from 'src/User/user.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/Entities/user.entity';
import { CookieStrategy } from './Strategy/cookie.strategy';


@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'askldjhfakljdshfalkjsdhfklajdshf',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    }),
    PassportModule.register({defaultStrategy: 'jwt'}),
    TypeOrmModule.forFeature([User])
  ],
  providers: [
    CookieStrategy,
    FacebookStrategy,
    // GoogleStrategy,
    AuthService,
    UserService
  ],
  controllers: [AuthController],
  exports: [PassportModule]
})
export class AuthModule {}
