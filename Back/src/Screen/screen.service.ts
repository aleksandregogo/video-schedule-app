import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, Repository } from "typeorm";
import { UserInfo } from "src/User/Interface/UserInfoInterface";
import { Company } from "src/Entities/company.entity";
import { DeleteFileCommand } from "src/Storage/Command/delete-file.command";
import { GenerateUploadUrlCommand } from "src/Storage/Command/generate-upload-url.command";
import { v4 } from "uuid";
import { ConfigService } from "@nestjs/config";
import { CommandBus } from "@nestjs/cqrs";
import { GenerateDownloadUrlCommand } from "src/Storage/Command/generate-download-url.command";
import { FileUploadRequestDto } from "src/Storage/Dto/file.upload.request.dto";
import { FileUploadCompleteDto } from "src/Storage/Dto/file.upload.complete.dto";
import { ScreenCreateDto } from "./Dto/screen.create.dto";
import { Screen } from "src/Entities/screen.entity"
import { ScreenStatus } from "./Enum/screen.status.enum";
import { ToggleScreenStatusDto } from "./Dto/toggle.screen.status.dto";

@Injectable()
export class ScreenService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Screen) private screenRepository: Repository<Screen>,
    private commandBus: CommandBus,
) {}

  async createScreen(user: UserInfo, screenCreateDto: ScreenCreateDto): Promise<Screen | null> {
    const screen = new Screen();
    screen.name = screenCreateDto.name;
    screen.status = screenCreateDto.status;
    screen.lat = screenCreateDto.lat;
    screen.lng = screenCreateDto.lng;
    screen.price = screenCreateDto.price;
    screen.company = { id: user.company.id } as Company;

    return this.screenRepository.save(screen)
      .catch((err) => {
        console.error(err);
        return null;
      })
  }

  async getAllScreens(): Promise<Screen[] | null> {
    try {
      const screens = await this.screenRepository.find({
        where: {
          status: Equal(ScreenStatus.ON)
        }
      });
  
      return await this.getScreensWithImageUrls(screens);
    } catch (err) {
      console.error('Error fetching screens or generating URLs:', err);
      return null;
    }
  }

  async getCompanyScreens(companyId: number): Promise<Screen[] | null> {
    try {
      const screens = await this.screenRepository.find({
        where: {
          company: {
            id: Equal(companyId)
          }
        }
      });
  
      return await this.getScreensWithImageUrls(screens); 
    } catch (err) {
      console.error('Error fetching screens or generating URLs:', err);
      return null;
    }
  }

  async getScreensWithImageUrls(screens: Screen[]) {
    const screenImageDownloadUrlPromises = screens.map(async (screen) => {
      if (screen.imageBucket && screen.imageKey) {
        screen.imageDownloadUrl = await this.commandBus.execute(
          new GenerateDownloadUrlCommand({ bucket: screen.imageBucket, key: screen.imageKey })
        );
      }

      return screen;
    });

    return await Promise.all(screenImageDownloadUrlPromises).catch((err) => {
      console.error('Error fetching screens or generating URLs:', err);
      return [];
    })
  }

  async findScreenById(id: number): Promise<Screen | null> {
    return this.screenRepository.findOne({
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

  async toggleScreenStatus(user: UserInfo, screenId: number, toggleScreenStatusDto: ToggleScreenStatusDto) {
    const screen = await this.findScreenById(screenId);

    if (!screen) {
      throw new BadRequestException(`Screen not found with id: ${screenId}`);
    } else if (screen?.company?.id !== user?.company?.id) {
      throw new BadRequestException(`You don't have permissions to toggle screen status`);
    } else if (screen.status === toggleScreenStatusDto.status) {
      throw new BadRequestException(`Screen status is already: ${toggleScreenStatusDto.status}`);
    }

    const updatedScreen = await this.screenRepository.update({
      id: Equal(screenId),
      company: {
        id: Equal(user.company.id)
      }
    }, {
      status: toggleScreenStatusDto.status,
    })
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!updatedScreen) {
      throw new BadRequestException('Something went wrong while updating DB');
    }

    return updatedScreen;
  }

  async deleteScreen(user: UserInfo, screenId: number) {
    const screen = await this.findScreenById(screenId);

    if (!screen) {
      throw new BadRequestException(`Screen not found with id: ${screenId}`);
    } else if (screen?.company?.id !== user?.company?.id) {
      throw new BadRequestException(`You don't have permissions to delete screen`);
    }

    const deletedScreen = await this.screenRepository.delete({
      id: Equal(screenId),
      company: {
        id: Equal(user.company.id)
      }
    })
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!deletedScreen) {
      throw new BadRequestException('Something went wrong while updating DB');
    }
  }

  async generateUploadUrl(user: UserInfo, fileUploadDto: FileUploadRequestDto) {
    const { ownerId, mimeType, size } = fileUploadDto;

    if (!this.configService.get('S3_ALLOWED_MIME_TYPES').includes(mimeType)) {
      throw new HttpException("Invalid file type", HttpStatus.BAD_REQUEST);
    }

    if (size > this.configService.get('S3_ALLOWED_FILE_SIZE')) {
      throw new HttpException("File size exceeds limit", HttpStatus.BAD_REQUEST);
    }

    const screen = await this.findScreenById(ownerId);

    if (!screen) {
      throw new HttpException(`Screen with id: ${ownerId} doesn't exists`, HttpStatus.BAD_REQUEST);
    } else if (screen?.company?.id !== user?.company?.id) {
      throw new BadRequestException(`You don't have permissions to toggle screen status`);
    }

    const fileFormat = mimeType.split('/')[1];
    const key = String(`${user.userLocalId}_screen_${v4()}.${fileFormat}`);
    const bucket = this.configService.get('S3_MEDIA_BUCKET');

    const uploadUrl = await this.commandBus.execute(
      new GenerateUploadUrlCommand({ bucket, key, mimeType, size })
    );

    if (!uploadUrl) {
      throw new HttpException("Error generating upload presign url", HttpStatus.BAD_REQUEST);
    }

    return {
      uploadUrl,
      screenId: ownerId,
      key
    };
  }

  async markUploadComplete(user: UserInfo, fileUploadCompleteDto: FileUploadCompleteDto) {
    const { ownerId, key } = fileUploadCompleteDto;

    const updatedScreen = await this.screenRepository.update({
      id: Equal(ownerId),
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

    if (!updatedScreen) {
      await this.commandBus.execute(
        new DeleteFileCommand({ bucket: this.configService.get('S3_MEDIA_BUCKET'), key })
      );
      throw new BadRequestException('Something went wrong while updating DB');
    }

    const imageDownloadUrl = await this.commandBus.execute(
      new GenerateDownloadUrlCommand({ bucket: this.configService.get('S3_MEDIA_BUCKET'), key: key })
    );

    return { message: "Upload marked as complete", imageDownloadUrl  };
  }

  async deleteScreenPhoto(user: UserInfo, screenId: number) {
    const screen = await this.findScreenById(screenId);

    if (!screen) {
      throw new BadRequestException(`Screen not found with id: ${screenId}`);
    } else if (screen?.company?.id !== user?.company?.id) {
      throw new BadRequestException(`You don't have permissions to delete screen photo`);
    } else if (!screen.imageKey || !screen.imageBucket) {
      throw new BadRequestException(`Screen doesn't have photo to delete`);
    }

    await this.commandBus.execute(
      new DeleteFileCommand({ bucket: screen.imageBucket, key: screen.imageKey })
    );

    const updatedScreen = await this.screenRepository.update({
      id: Equal(screenId),
      company: {
        id: Equal(user.company.id)
      }
    }, {
      imageKey: null,
      imageBucket: null
    })
      .catch((err) => {
        console.log(err);
        return null;
      });

    if (!updatedScreen) {
      throw new BadRequestException('Something went wrong while updating DB');
    }
  }
}
