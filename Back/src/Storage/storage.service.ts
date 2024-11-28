import {Injectable} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class StorageService {
    private s3Client = S3Client.prototype;
    private downloadPresignedUrlExpTime = 600;
    private uploadPresignedUrlExpTime = 600;

    constructor(private readonly configService: ConfigService) {
        this.s3Client = new S3Client({
            endpoint: this.configService.get('S3_ENDPOINT'),
            credentials: {
                accessKeyId: this.configService.get('S3_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('S3_ACCESS_KEY_SECRET'),
            },
            region: this.configService.get('S3_REGION'),
            forcePathStyle: true
        });

        this.downloadPresignedUrlExpTime = +this.configService.get('S3_DOWNLOAD_PRESIGNED_URL_EXP_TIME') || 600;
        this.uploadPresignedUrlExpTime = +this.configService.get('S3_UPLOAD_PRESIGNED_URL_EXP_TIME') || 600;
    }

    async generateDownloadPresignedUrl(bucket: string, key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key
        });

        return await getSignedUrl(this.s3Client, command, { expiresIn: this.downloadPresignedUrlExpTime })
            .catch((err) => {
                console.error({
                    message: 'Error while generation of download presigned url',
                    extra: {
                        traceId: null,
                        exception: err,
                        additionalData: {
                            bucket,
                            key
                        }
                    }
                });

                return null;
            });
    };

    async generateUploadPresignedUrl(bucket: string, key: string, mimeType: string, size: number) {
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        return await getSignedUrl(this.s3Client, command, { expiresIn: this.uploadPresignedUrlExpTime })
            .catch((err) => {
                console.error({
                    message: 'Error while generation of upload url',
                    extra: {
                        traceId: null,
                        exception: err,
                        additionalData: {
                            bucket,
                            key,
                            mimeType,
                            size
                        }
                    }
                });

                return null;
            })
    };

    async deleteFile(bucket: string, key: string) {
        const command = new DeleteObjectCommand({
            Bucket: bucket,
            Key: key
        });

        return await this.s3Client.send(command)
            .catch((err) => {
                console.error({
                    message: 'Error while deleting object',
                    extra: {
                        traceId: null,
                        exception: err,
                        additionalData: {
                            bucket: bucket,
                            key
                        }
                    }
                });
            })
    }
}