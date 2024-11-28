import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ConfigService } from "@nestjs/config";
import { User } from "src/Entities/user.entity";
import { GenerateUploadUrlCommand } from "src/Storage/Command/generate-upload-url.command";
import { v4 } from "uuid";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Campaign } from "src/Entities/campaign.entity";
import { Media } from "src/Entities/media.entity";
import { CreateCampaignDto } from "./Dto/create.campaign.dto";
import { FileUploadRequestDto } from "./Dto/file.upload.request.dto";
import { FileUploadCompleteDto } from "./Dto/file.upload.complete.dto";
import { DeleteFileCommand } from "src/Storage/Command/delete-file.command";
import { UserInfo } from "src/User/Interface/UserInfoInterface";

@Injectable()
export class ScheduleService {
  constructor(
    private readonly configService: ConfigService,
    private commandBuss: CommandBus,
    @InjectRepository(Campaign) private campaignRepository: Repository<Campaign>,
    @InjectRepository(Media) private mediaRepository: Repository<Media>
  ) {}

  async createCampaign(user: User, createCampaignDto: CreateCampaignDto) {
    const campaign = new Campaign();
    campaign.uuid = v4();
    campaign.name = createCampaignDto.name;

    return await this.campaignRepository.save(campaign);
  }

  async generateUploadUrl(user: UserInfo, fileUploadRequestDto: FileUploadRequestDto) {
    const { campaignId, mimeType, size } = fileUploadRequestDto;

    if (!this.configService.get('S3_ALLOWED_MIME_TYPES').includes(mimeType)) {
      throw new HttpException("Invalid file type", HttpStatus.BAD_REQUEST);
    }

    if (size > this.configService.get('S3_ALLOWED_FILE_SIZE')) {
      throw new HttpException("File size exceeds limit", HttpStatus.BAD_REQUEST);
    }

    const fileFormat = fileUploadRequestDto.mimeType.split('/')[1];
    const key = String(`${user.userLocalId}_${v4()}.${fileFormat}`);
    const bucket = this.configService.get('S3_MEDIA_BUCKET');

    const uploadUrl = await this.commandBuss.execute(
      new GenerateUploadUrlCommand({ bucket, key, mimeType, size })
    );

    if (!uploadUrl) {
      throw new HttpException("Error generating upload presign url", HttpStatus.BAD_REQUEST);
    }

    return {
      uploadUrl,
      campaignId,
      key
    };
  }

  async markUploadComplete(user: User, fileUploadCompleteDto: FileUploadCompleteDto) {
    const { campaignId, mimeType, size, key } = fileUploadCompleteDto;

    const fileFormat = mimeType.split('/')[1];

    const media = new Media();

    media.uuid = v4();
    media.campaign = { id: campaignId } as Campaign;
    media.user = { id: user.id } as User;
    media.key = key;
    media.bucketName = this.configService.get('S3_MEDIA_BUCKET');
    media.format = fileFormat;
    media.size = size;
    media.uploadComplete = false;

    const savedMedia = await this.mediaRepository.save(media)
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!savedMedia) {
      await this.commandBuss.execute(
        new DeleteFileCommand({ bucket: this.configService.get('S3_MEDIA_BUCKET'), key })
      );
      throw new BadRequestException('Something went wrong while updating DB');
    }

    return { message: "Upload marked as complete" };
  }
}
