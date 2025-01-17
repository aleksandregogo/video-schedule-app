import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ConfigService } from "@nestjs/config";
import { User } from "src/Entities/user.entity";
import { GenerateUploadUrlCommand } from "src/Storage/Command/generate-upload-url.command";
import { v4 } from "uuid";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, FindOptionsRelations, FindOptionsWhere, In, Repository } from "typeorm";
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
import { EditCampaignDto } from "./Dto/edit.campaign.dto copy";
import { GenerateDownloadUrlCommand } from "src/Storage/Command/generate-download-url.command";
import { CampaignStatus } from "./Enum/campaign.status.enum";

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

  async editCampaign(user: User, campaignId: number, editCampaignDto: EditCampaignDto) {    
    const { name, reservations } = editCampaignDto;

    const campaign = await this.findCampaignById(campaignId, user.id);

    if (!campaign) {
      throw new HttpException(`Campaign with id: ${campaignId} doesn't exists`, HttpStatus.BAD_REQUEST);
    }

    campaign.name = name;

    const updatedCampaign = await this.campaignRepository.save(campaign);

    if (!updatedCampaign) {
      throw new HttpException(`Something went wrong while updating campaign`, HttpStatus.BAD_REQUEST);
    }

    const existingReservations = await this.findReservationsByCampaignId(updatedCampaign.id);

    const reservationsToSave: Reservation[] = [];
    const reservationIdsToDelete: number[] = existingReservations.map((oldRes) => {
      if (!reservations.find((newRes) => newRes.id === oldRes.id)) {
        return oldRes.id;
      }
    });

    for (const newRes of reservations) {
      if (newRes.id) {
        const existingRes = existingReservations.find((res) => res.id === newRes.id);

        if (existingRes) {
          existingRes.name = newRes.name;
          existingRes.startTime = newRes.startTime;
          existingRes.endTime = newRes.endTime;
  
          reservationsToSave.push(existingRes);

          continue;
        }
      }

      const reservationToAdd = new Reservation();
      reservationToAdd.name = newRes.name;
      reservationToAdd.startTime = newRes.startTime;
      reservationToAdd.endTime = newRes.endTime;
      reservationToAdd.status = ReservationStatus.PENDING;
      reservationToAdd.campaign = { id: updatedCampaign.id } as Campaign;
      reservationToAdd.screen = { id: updatedCampaign.screenId } as Screen;

      reservationsToSave.push(reservationToAdd);
    }

    const updatedReservations = await this.reservationRepository.save(reservationsToSave);

    if (!updatedReservations) {
      throw new HttpException(`Something went wrong while saving reservations`, HttpStatus.BAD_REQUEST);
    }

    const deletedReservations = await this.reservationRepository.delete(reservationIdsToDelete);

    if (!deletedReservations) {
      throw new HttpException(`Something went wrong while updating reservations`, HttpStatus.BAD_REQUEST);
    }

    return updatedCampaign;
  }

  async changeCampaignReviewStatus (userInfo: UserInfo, campaignId: number, status: CampaignStatus) {
    const companyId = userInfo?.company?.id || null;
    const campaign = await this.findCampaignById(campaignId, (companyId ? null : userInfo.userLocalId), companyId);

    if (!campaign) {
      throw new HttpException(`Campaign with id: ${campaignId} doesn't exists`, HttpStatus.BAD_REQUEST);
    }

    campaign.status = status;

    const updatedCampaign = await this.campaignRepository.save(campaign);

    if (!updatedCampaign) {
      throw new HttpException(`Something went wrong while updating campaign`, HttpStatus.BAD_REQUEST);
    }

    return updatedCampaign;
  }

  async deleteCampaign(userLocalId: number, campaignId: number) {
    const campaign = await this.findCampaignById(campaignId, userLocalId);

    if (!campaign) {
      throw new HttpException(`Campaign with id: ${campaignId} doesn't exists`, HttpStatus.BAD_REQUEST);
    }

    const deletedCampaign = await this.campaignRepository.delete({
      id: Equal(campaignId),
      user: {
        id: Equal(userLocalId)
      }
    })
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!deletedCampaign) {
      throw new BadRequestException('Something went wrong while updating DB');
    }
  }

  async getCampaignsCount(userInfo: UserInfo): Promise<number> {
    const where = {
      status: userInfo.company ? CampaignStatus.PENDING : CampaignStatus.CREATED
    };

    if (userInfo.company) {
      where['company'] = { id: Equal(userInfo.company.id) };
    } else {
      where['user'] = { id: Equal(userInfo.userLocalId) };
    }

    return await this.campaignRepository.count({ where })
    .catch((err) => {
      console.error("Error in getAllCampaigns", err);
      return 0;
    })
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

  async getAllCampaignsToReview(userInfo: UserInfo): Promise<Campaign[]> {
    const companyScreens = await this.screenService.getCompanyScreens(userInfo.company.id);

    if (!companyScreens || !companyScreens.length) {
      throw new HttpException(`Screens not found for company`, HttpStatus.BAD_REQUEST);
    }
    
    const screenIds: number[] = companyScreens.map((screen) => screen.id);

    return await this.campaignRepository.find({
      where: {
        company: { id: Equal(userInfo.company.id) },
        screen: { id: In(screenIds) },
        status: In([CampaignStatus.CONFIRMED, CampaignStatus.PENDING])
      },
      relations: {
        screen: true
      }
    })
      .catch((err) => {
        console.error("Error in getAllCampaigns for company", err);
        return [];
      });
  }

  async getCampaignReservations(campaignId: number, userInfo: UserInfo): Promise<Reservation[]> {
    const companyId = userInfo?.company?.id || null;
    const campaign = await this.findCampaignById(campaignId, (companyId ? null : userInfo.userLocalId), companyId);

    if (!campaign) {
      throw new HttpException(`Campaign with id: ${campaignId} doesn't exists`, HttpStatus.BAD_REQUEST);
    }

    return await this.findReservationsByCampaignId(campaign.id);
  }

  async findReservationsByCampaignId(campaignId: number): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: {
        campaign: { id: Equal(campaignId) },
      }
    })
    .catch((err) => {
      console.error("Error in getAllCampaigns", err);
      return [];
    })
  }

  async findCampaignById(
    id: number,
    userId?: number,
    companyId?: number,
    relations: FindOptionsRelations<Campaign> = {},
  ): Promise<Campaign> {
    const where: FindOptionsWhere<Campaign> = {
      id: Equal(id)
    };

    if (userId) where.user = { id: Equal(userId) };
    if (companyId) where.company = { id: Equal(companyId) };

    return await this.campaignRepository.findOne({ where, relations })
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  async generateDownloadUrl(userInfo: UserInfo, campaignId: number) {
    const companyId = userInfo?.company?.id || null;
    const campaign = await this.findCampaignById(campaignId, (companyId ? null : userInfo.userLocalId), companyId, { media: true });

    if (!campaign) {
      throw new HttpException(`Campaign with id: ${campaignId} doesn't exists`, HttpStatus.BAD_REQUEST);
    }

    if (!campaign.media || !campaign.media?.bucketName || !campaign.media?.key) {
      throw new HttpException(`Campaign with id: ${campaignId} doesn't have media`, HttpStatus.BAD_REQUEST);
    }

    const downloadUrl = await this.commandBus.execute(
      new GenerateDownloadUrlCommand({ bucket: campaign.media?.bucketName, key: campaign.media?.key })
    );

    return { message: "Upload marked as complete", downloadUrl  };
  }

  async generateUploadUrl(user: UserInfo, fileUploadRequestDto: FileUploadRequestDto) {
    const { ownerId, mimeType, size } = fileUploadRequestDto;

    if (!this.configService.get('S3_ALLOWED_MIME_TYPES').includes(mimeType)) {
      throw new HttpException("Invalid file type", HttpStatus.BAD_REQUEST);
    }

    if (size > this.configService.get('S3_ALLOWED_FILE_SIZE')) {
      throw new HttpException("File size exceeds limit", HttpStatus.BAD_REQUEST);
    }

    const campaign = await this.findCampaignById(ownerId, user.userLocalId);

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
    const updatedCampaign = await this.campaignRepository.update({ id: Equal(ownerId) }, { media: { id: media.id } });

    if (!updatedCampaign) {
      await this.commandBus.execute(
        new DeleteFileCommand({ bucket: this.configService.get('S3_MEDIA_BUCKET'), key })
      );
      throw new BadRequestException('Something went wrong while updating DB');
    }

    const downloadUrl = await this.commandBus.execute(
      new GenerateDownloadUrlCommand({ bucket: this.configService.get('S3_MEDIA_BUCKET'), key: key })
    );

    return { message: "Upload marked as complete", downloadUrl  };
  }

  async deleteCampaignMedia(userLocalId: number, campaignId: number) {
    const campaign = await this.findCampaignById(campaignId, userLocalId, null, { media: true });

    if (!campaign) {
      throw new HttpException(`Campaign with id: ${campaignId} doesn't exists`, HttpStatus.BAD_REQUEST);
    }

    if (!campaign.media || !campaign.media?.bucketName || !campaign.media?.key) {
      throw new HttpException(`Campaign with id: ${campaignId} doesn't have media`, HttpStatus.BAD_REQUEST);
    }

    await this.commandBus.execute(
      new DeleteFileCommand({ bucket: campaign.media.bucketName, key: campaign.media.key })
    );

    const deletedCampaignMedia = await this.mediaRepository.delete({
      id: Equal(campaign.media.id),
      user: {
        id: Equal(userLocalId)
      }
    })
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!deletedCampaignMedia) {
      throw new BadRequestException('Something went wrong while updating DB');
    }    
  }
}
