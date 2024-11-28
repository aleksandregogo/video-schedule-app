import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class FileUploadRequestDto {
  @ApiProperty({
    type: Number,
    example: 4,
  })
  @IsNumber()
  @IsNotEmpty()
  campaignId: number;

  @ApiProperty({
    type: Number,
    example: 342345,
  })
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @ApiProperty({
    type: String,
    example: 'video/mp4',
  })
  @IsString()
  @IsNotEmpty()
  mimeType: string;
}