import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { AddReservationDto } from "./add.reservation.dto";

export class CreateCampaignDto {
  @ApiProperty({
    type: String,
    example: 'New Campaign',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: Number,
    example: 35,
  })
  @IsNumber()
  @IsNotEmpty()
  screenId: number;

  @ApiProperty({
    type: AddReservationDto,
    isArray: true
  })
  @ValidateNested()
  @Type(() => AddReservationDto)
  @IsArray()
  @ArrayMaxSize(25)
  @ArrayMinSize(1)
  reservations: AddReservationDto[];
}