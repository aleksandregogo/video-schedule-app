import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LocationImageUploadCompleteDto {
  @ApiProperty({
    type: Number,
    example: 4,
  })
  @IsNumber()
  @IsNotEmpty()
  locationId: number;

  @ApiProperty({
    type: String,
    example: 'cd41c4aafbfc4ccf91caasdjhlaskjdhfk22b6e9c1fe14.mp4',
  })
  @IsString()
  @IsNotEmpty()
  key: string;
}