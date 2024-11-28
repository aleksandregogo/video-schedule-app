import { Module } from '@nestjs/common';
import { GenerateDownloadUrlHandler } from './Command/generate-download-url.handler';
import { StorageService } from './storage.service';
import { GenerateUploadUrlHandler } from './Command/generate-upload-url.handler';
import { DeleteFileHandler } from './Command/delete-file.handler';

@Module({
  providers: [
    StorageService,
    GenerateUploadUrlHandler,
    GenerateDownloadUrlHandler,
    DeleteFileHandler
  ],
  exports: [StorageService],
})
export class StorageModule {}
