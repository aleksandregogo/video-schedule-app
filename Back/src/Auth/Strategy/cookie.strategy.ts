import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class CookieStrategy extends PassportStrategy(Strategy, 'cookie') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const token = req.cookies['auth_token'];
    if (!token) {
      throw new UnauthorizedException('No token found in cookies');
    }

    try {
      const payload = this.authService.verifyJwt(token);
      return payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}