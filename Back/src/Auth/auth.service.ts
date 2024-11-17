import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/Entities/user.entity';
import { AuthProvider, UserInfo } from 'src/User/Interface/UserInfoInterface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwt(
    user: User,
    authProvider: AuthProvider,
    userProviderId: string
  ): string {
    const payload = {
      userProviderId: userProviderId,
      userLocalId: user.id,
      email: user.email,
      name: user.name,
      username: user.userName,
      authProvider
    } as UserInfo;

    return this.jwtService.sign(payload);
  }

  verifyJwt(token: string): any {
    return this.jwtService.verify(token, { secret: process.env.JWT_SECRET || 'askldjhfakljdshfalkjsdhfklajdshf' });
  }
 }