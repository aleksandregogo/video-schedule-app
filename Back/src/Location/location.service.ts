import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, Repository } from "typeorm";
import { LocationCreateDto } from "./Dto/location.create.dto";
import { Location } from "src/Entities/location.entity";
import { UserInfo } from "src/User/Interface/UserInfoInterface";
import { Company } from "src/Entities/company.entity";
import { DeleteFileCommand } from "src/Storage/Command/delete-file.command";
import { GenerateUploadUrlCommand } from "src/Storage/Command/generate-upload-url.command";
import { v4 } from "uuid";
import { LocationImageUploadCompleteDto } from "./Dto/location.image.upload.complete.dto";
import { LocationImageUploadRequestDto } from "./Dto/location.image.upload.request.dto";
import { ConfigService } from "@nestjs/config";
import { CommandBus } from "@nestjs/cqrs";
import { GenerateDownloadUrlCommand } from "src/Storage/Command/generate-download-url.command";


@Injectable()
export class LocationService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Location) private locationRepository: Repository<Location>,
    private commandBus: CommandBus,
) {}

  async createLocation(user: UserInfo, locationCreateDto: LocationCreateDto): Promise<Location | null> {
    const location = new Location();
    location.name = locationCreateDto.name;
    location.status = locationCreateDto.status;
    location.lat = locationCreateDto.lat;
    location.lng = locationCreateDto.lng;
    location.price = locationCreateDto.price;
    location.company = { id: user.company.id } as Company;

    return this.locationRepository.save(location)
      .catch((err) => {
        console.error(err);
        return null;
      })
  }

  async getAllLocation(): Promise<Location[] | null> {
    try {
      const locations = await this.locationRepository.find();
  
      const locationImageDownloadUrlPromises = locations.map(async (location) => {
        if (location.imageBucket && location.imageKey) {
          location.imageDownloadUrl = await this.commandBus.execute(
            new GenerateDownloadUrlCommand({ bucket: location.imageBucket, key: location.imageKey })
          );
        }

        return location;
      });
  
      return await Promise.all(locationImageDownloadUrlPromises).catch((err) => {
        console.error('Error fetching locations or generating URLs:', err);
        return [];
      })
    } catch (err) {
      console.error('Error fetching locations or generating URLs:', err);
      return null;
    }
  }

  async findLocationById(id: number): Promise<Location | null> {
    return this.locationRepository.findOne({
      where: {
        id: Equal(id),
      },
      relations: {
        company: true
      }
    })
      .catch((err) => {
        console.error(err);
        return null;
      })
  }

  async generateUploadUrl(user: UserInfo, locationImageUploadRequestDto: LocationImageUploadRequestDto) {
    const { locationId, mimeType, size } = locationImageUploadRequestDto;

    if (!this.configService.get('S3_ALLOWED_MIME_TYPES').includes(mimeType)) {
      throw new HttpException("Invalid file type", HttpStatus.BAD_REQUEST);
    }

    if (size > this.configService.get('S3_ALLOWED_FILE_SIZE')) {
      throw new HttpException("File size exceeds limit", HttpStatus.BAD_REQUEST);
    }

    const fileFormat = mimeType.split('/')[1];
    const key = String(`${user.userLocalId}_location_${v4()}.${fileFormat}`);
    const bucket = this.configService.get('S3_MEDIA_BUCKET');

    const uploadUrl = await this.commandBus.execute(
      new GenerateUploadUrlCommand({ bucket, key, mimeType, size })
    );

    if (!uploadUrl) {
      throw new HttpException("Error generating upload presign url", HttpStatus.BAD_REQUEST);
    }

    return {
      uploadUrl,
      locationId,
      key
    };
  }

  async markUploadComplete(user: UserInfo, locationImageUploadCompleteDto: LocationImageUploadCompleteDto) {
    const { locationId, key } = locationImageUploadCompleteDto;

    const updatedLocation = await this.locationRepository.update({
      id: Equal(locationId),
      company: {
        id: Equal(user.company.id)
      }
    }, {
      imageKey: key,
      imageBucket: this.configService.get('S3_MEDIA_BUCKET')
    })
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!updatedLocation) {
      await this.commandBus.execute(
        new DeleteFileCommand({ bucket: this.configService.get('S3_MEDIA_BUCKET'), key })
      );
      throw new BadRequestException('Something went wrong while updating DB');
    }

    return { message: "Upload marked as complete" };
  }
}
