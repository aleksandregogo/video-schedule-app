import { ApiProperty } from "@nestjs/swagger";
import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ScreenStatus } from "../Enum/screen.status.enum";

export class ScreenCreateDto {
  @ApiProperty({
    type: String,
    example: 'New Screen',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: Number,
    example: 41.70744054498139,
  })
  @IsLatitude()
  @IsNotEmpty()
  lat: number;

  @ApiProperty({
    type: Number,
    example: 41.70744054498139,
  })
  @IsLongitude()
  @IsNotEmpty()
  lng: number;

  @ApiProperty({
    type: Number,
    example: 0.35,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    type: String,
    example: ScreenStatus.ON,
  })
  @IsString()
  @IsNotEmpty()
  status: ScreenStatus;
}