import { IsString, IsUrl, IsOptional } from "class-validator";

export class UserCreateDto {
  @IsString()
  @IsUrl()
  @IsOptional()
  name?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  type?: 'buisness' | 'client';
}