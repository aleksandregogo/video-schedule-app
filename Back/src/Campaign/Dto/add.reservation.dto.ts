import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class AddReservationDto {
  @ApiProperty({
    type: Number,
    example: 123,
  })
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty({
    type: String,
    example: 'Book #1',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: Date,
    default: new Date()
  })
  @IsDateString()
  startTime: Date;

  @ApiProperty({
    type: Date,
    default: new Date()
  })
  @IsDateString()
  endTime: Date;
}