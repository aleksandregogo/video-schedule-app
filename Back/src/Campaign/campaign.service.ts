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
import { DeleteFileCommand } from "src/Storage/Command/delete-file.command";
import { UserInfo } from "src/User/Interface/UserInfoInterface";
import { ScreenService } from "src/Screen/screen.service";
import { Screen } from "src/Entities/screen.entity";
import { Company } from "src/Entities/company.entity";
import { FileUploadRequestDto } from "src/Storage/Dto/file.upload.request.dto";
import { FileUploadCompleteDto } from "src/Storage/Dto/file.upload.complete.dto";
import { Reservation } from "src/Entities/reservation.entity";
import { ReservationStatus } from "src/Reservations/Enum/reservation.status.enum";

@Injectable()
export class CampaignService {
  constructor(
    private readonly configService: ConfigService,
    private commandBus: CommandBus,
    private readonly screenService: ScreenService,
    @InjectRepository(Campaign) private campaignRepository: Repository<Campaign>,
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    @InjectRepository(Media) private mediaRepository: Repository<Media>
  ) {}

  async createCampaign(user: User, createCampaignDto: CreateCampaignDto) {    
    const { screenId, name, reservations } = createCampaignDto;

    const screen = await this.screenService.findScreenById(screenId);

    if (!screen) {
      throw new HttpException(`Screen with id: ${screenId} doesn't exists`, HttpStatus.BAD_REQUEST);
    }

    const campaign = new Campaign();
    campaign.uuid = v4();
    campaign.name = name;
    campaign.user = user;
    campaign.screen = { id: screen.id } as Screen;
    campaign.company = { id: screen.company.id } as Company;

    const savedCampaign = await this.campaignRepository.save(campaign);

    if (!savedCampaign) {
      throw new HttpException(`Something went wrong while creating campaign`, HttpStatus.BAD_REQUEST);
    }

    const reservationsToAdd: Reservation[] = [];

    for (const reservation of reservations) {
      const reservationToAdd = new Reservation();
      reservationToAdd.name = reservation.name;
      reservationToAdd.startTime = reservation.startTime;
      reservationToAdd.endTime = reservation.endTime;
      reservationToAdd.status = ReservationStatus.PENDING;
      reservationToAdd.campaign = { id: savedCampaign.id } as Campaign;
      reservationToAdd.screen = { id: screenId } as Screen;

      reservationsToAdd.push(reservationToAdd);
    }

    const savedReservations = await this.reservationRepository.save(reservationsToAdd);

    if (!savedReservations) {
      throw new HttpException(`Something went wrong while saving reservations`, HttpStatus.BAD_REQUEST);
    }

    return savedCampaign;
  }

  async getAllCampaigns(user: User): Promise<Campaign[]> {
    return await this.campaignRepository.find({
      where: {
        user: { id: Equal(user.id) }
      },
      relations: {
        screen: true
      }
    })
    .catch((err) => {
      console.error("Error in getAllCampaigns", err);
      return [];
    })
  }

  async getCampaignReservations(user: User, campaignId: number): Promise<Reservation[]> {

    
    return []
  }

  async generateUploadUrl(user: UserInfo, fileUploadRequestDto: FileUploadRequestDto) {
    const { ownerId, mimeType, size } = fileUploadRequestDto;

    if (!this.configService.get('S3_ALLOWED_MIME_TYPES').includes(mimeType)) {
      throw new HttpException("Invalid file type", HttpStatus.BAD_REQUEST);
    }

    if (size > this.configService.get('S3_ALLOWED_FILE_SIZE')) {
      throw new HttpException("File size exceeds limit", HttpStatus.BAD_REQUEST);
    }

    const campaign = await this.campaignRepository.findOne({
      where: {
        id: Equal(ownerId),
      },
      relations: {
        company: true
      }
    })
      .catch((err) => {
        console.error(err);
        return null;
      });

    if (!campaign) {
      throw new HttpException(`Campaign with id: ${ownerId} doesn't exists`, HttpStatus.BAD_REQUEST);
    }

    const fileFormat = mimeType.split('/')[1];
    const key = String(`${user.userLocalId}_CAMPAIGN_MEDIA_${v4()}.${fileFormat}`);
    const bucket = this.configService.get('S3_MEDIA_BUCKET');

    const uploadUrl = await this.commandBus.execute(
      new GenerateUploadUrlCommand({ bucket, key, mimeType, size })
    );

    if (!uploadUrl) {
      throw new HttpException("Error generating upload presign url", HttpStatus.BAD_REQUEST);
    }

    return {
      uploadUrl,
      campaignId: ownerId,
      key
    };
  }

  async markUploadComplete(user: UserInfo, fileUploadCompleteDto: FileUploadCompleteDto) {
    const { ownerId, mimeType, size, key } = fileUploadCompleteDto;

    const fileFormat = mimeType.split('/')[1];

    const media = new Media();

    media.uuid = v4();
    media.user = { id: user.user.id } as User;
    media.key = key;
    media.bucketName = this.configService.get('S3_MEDIA_BUCKET');
    media.format = fileFormat;
    media.size = size;

    const savedMedia = await this.mediaRepository.save(media)
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!savedMedia) {
      await this.commandBus.execute(
        new DeleteFileCommand({ bucket: this.configService.get('S3_MEDIA_BUCKET'), key })
      );
      throw new BadRequestException('Something went wrong while updating DB');
    }

    // Update campaign
    await this.campaignRepository.update({ id: Equal(ownerId) }, { media: { id: media.id } });

    return { message: "Upload marked as complete" };
  }
}
