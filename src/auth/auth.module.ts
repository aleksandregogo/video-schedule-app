import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';


@Module({
  imports: [PassportModule.register({defaultStrategy: 'jwt'})],
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
  exports: [PassportModule]
})
export class AuthModule {}