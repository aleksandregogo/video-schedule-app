import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ConfigService } from "@nestjs/config";
import { User } from "src/Entities/user.entity";
import { GenerateUploadUrlCommand } from "src/Storage/Command/generate-upload-url.command";
import { v4 } from "uuid";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, Repository } from "typeorm";
import { Campaign } from "src/Entities/campaign.entity";
import { Media } from "src/Entities/media.entity";
import { CreateCampaignDto } from "./Dto/create.campaign.dto";
import { FileUploadDto } from "./Dto/file.upload.dto";
import { FileUploadCompleteDto } from "./Dto/file.upload.complete.dto";
import { DeleteFileCommand } from "src/Storage/Command/delete-file.command";

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
    campaign.name = createCampaignDto.name;

    return await this.campaignRepository.save(campaign);
  }

  async generateUploadUrl(user: User, fileUploadDto: FileUploadDto) {
    const fileFormat = fileUploadDto.mimeType.split('/')[1];
    const key = `${user.id}_${v4()}.${fileFormat}`;
    const bucket = this.configService.get('S3_MEDIA_BUCKET');

    const { campaignId, mimeType, size } = fileUploadDto;

    const media = new Media();

    media.uuid = v4();
    media.campaign = { id: campaignId } as Campaign;
    media.user = { id: user.id } as User;
    media.key = key;
    media.bucketName = bucket;
    media.format = fileFormat;
    media.size = size;
    media.uploadComplete = false;

    const savedMedia = await this.mediaRepository.save(media)
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!savedMedia) {
      throw new HttpException("Error updating db", HttpStatus.BAD_REQUEST);
    }

    const uploadUrl = await this.commandBuss.execute(
      new GenerateUploadUrlCommand({ bucket, key, mimeType, size })
    );

    if (!uploadUrl) {
      throw new HttpException("Error generating upload presign url", HttpStatus.BAD_REQUEST);
    }

    return uploadUrl;
  }

  async markUploadComplete(user: User, fileUploadCompleteDto: FileUploadCompleteDto) {
    const { mediaUUID, key } = fileUploadCompleteDto;

    const updated = await this.mediaRepository.update({
      user: { id: Equal(user.id) },
      uuid: mediaUUID
    }, { uploadComplete: true });

    if (updated.affected <= 0) {
      await this.commandBuss.execute(
        new DeleteFileCommand({ bucket: this.configService.get('S3_MEDIA_BUCKET'), key })
      );
      throw new BadRequestException('Something went wrong while updating DB');
    }

    return { message: "Upload marked as complete" };
  }
}
