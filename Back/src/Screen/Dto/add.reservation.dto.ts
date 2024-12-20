import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ScreenStatus } from "../Enum/screen.status.enum";
import { ReservationStatus } from "../Enum/reservation.status.enum";

export class AddReservationDto {
  @ApiProperty({
    type: String,
    example: 'New Screen',
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