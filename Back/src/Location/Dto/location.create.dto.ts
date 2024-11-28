import { ApiProperty } from "@nestjs/swagger";
import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { LocationStatus } from "../Enum/location.status.enum";

export class LocationCreateDto {
  @ApiProperty({
    type: String,
    example: 'New location',
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
    example: LocationStatus.ON,
  })
  @IsString()
  @IsNotEmpty()
  status: LocationStatus;
}