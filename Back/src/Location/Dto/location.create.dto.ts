import { IsString } from "class-validator";

export class LocationCreateDto {
  @IsString()
  name: string;

  @IsString()
  type: 'buisness' | 'client';
}