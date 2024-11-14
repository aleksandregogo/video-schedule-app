import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateUser(profile: any): Promise<any> {
    // create or find the user in your databse
    return profile;
  }
}