import { Module } from '@nestjs/common';
import { GenerateDownloadUrlHandler } from './Command/generate-download-url.handler';
import { StorageService } from './storage.service';

@Module({
  providers: [StorageService, GenerateDownloadUrlHandler],
  exports: [StorageService],
})
export class StorageModule {}
