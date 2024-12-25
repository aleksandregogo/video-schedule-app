import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString } from "class-validator";

export class AddReservationDto {
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