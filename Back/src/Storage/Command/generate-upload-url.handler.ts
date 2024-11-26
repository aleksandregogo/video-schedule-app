import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import { StorageService } from "../storage.service";
import { GenerateUploadUrlCommand } from "./generate-upload-url.command";

@CommandHandler(GenerateUploadUrlCommand)
export class GenerateDownloadUrlHandler implements ICommandHandler<GenerateUploadUrlCommand> {
    constructor(private s3StorageService: StorageService) {
    }
    async execute(command: GenerateUploadUrlCommand): Promise<any> {
        return await this.s3StorageService.generateUploadPresignedUrl(
            command.payload.bucket,
            command.payload.key,
            command.payload.mimeType,
            command.payload.size
        );
    }
}