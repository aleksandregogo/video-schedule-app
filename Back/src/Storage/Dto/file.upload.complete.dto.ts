import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { FileUploadRequestDto } from "./file.upload.request.dto";

export class FileUploadCompleteDto extends FileUploadRequestDto {
  @ApiProperty({
    type: String,
    example: 'cd41c4aafbfc4ccf91caasdjhlaskjdhfk22b6e9c1fe14.mp4',
  })
  @IsString()
  @IsNotEmpty()
  key: string;
}