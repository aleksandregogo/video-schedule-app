import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { ManyToOne, JoinColumn, RelationId } from "typeorm";

export class FileUploadDto {
  @IsNumber()
  @IsNotEmpty()
  campaignId: number;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsString()
  @IsNotEmpty()
  mimeType: string;
}