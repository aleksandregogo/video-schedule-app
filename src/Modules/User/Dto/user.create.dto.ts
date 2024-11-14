import { IsString, IsUrl, IsOptional } from "class-validator";

export class UserCreateDto {
  @IsString()
  name: string;

  @IsString()
  type: 'buisness' | 'client';
}