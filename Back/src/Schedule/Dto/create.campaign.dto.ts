import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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
}