import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import { StorageService } from "../storage.service";
import { DeleteFileCommand } from "./delete-file.command";

@CommandHandler(DeleteFileCommand)
export class DeleteFileHandler implements ICommandHandler<DeleteFileCommand> {
    constructor(private s3StorageService: StorageService) {
    }
    async execute(command: DeleteFileCommand): Promise<any> {
        return await this.s3StorageService.deleteFile(
            command.payload.bucket,
            command.payload.key
        );
    }
}