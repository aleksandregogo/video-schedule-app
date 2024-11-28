import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCampaignDto {
  @ApiProperty({
    type: String,
    example: 'New Campaign',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}