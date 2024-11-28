import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { FileUploadRequestDto } from "src/Schedule/Dto/file.upload.request.dto";

export class LocationImageUploadRequestDto extends OmitType(FileUploadRequestDto, ['campaignId' as const]) {
  @ApiProperty({
    type: Number,
    example: 4,
  })
  @IsNumber()
  @IsNotEmpty()
  locationId: number;

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