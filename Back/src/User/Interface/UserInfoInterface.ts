import { Company } from "src/Entities/company.entity";
import { User } from "src/Entities/user.entity";

export enum AuthProvider {
  googleOauth2 = 'google-oauth2',
  facebook = 'facebook',
}

export interface UserInfo {
  userProviderId: string;
  userLocalId: number;
  email: string;
  name: string;
  username: string;
  user: User;
  authProvider: AuthProvider;
  company?: Company;
}
