import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import { GenerateDownloadUrlCommand } from "./generate-download-url.command";
import { StorageService } from "../storage.service";

@CommandHandler(GenerateDownloadUrlCommand)
export class GenerateDownloadUrlHandler implements ICommandHandler<GenerateDownloadUrlCommand> {
    constructor(private s3StorageService: StorageService) {
    }
    async execute(command: GenerateDownloadUrlCommand): Promise<any> {
        return await this.s3StorageService.generateDownloadPresignedUrl(command.payload.bucket, command.payload.key);
    }
}