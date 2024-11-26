import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class FileUploadCompleteDto {
  @IsUUID()
  @IsNotEmpty()
  mediaUUID: string;

  @IsString()
  @IsNotEmpty()
  key: string;
}