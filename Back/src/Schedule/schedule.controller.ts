import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Req } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { FileUploadRequestDto } from "./Dto/file.upload.request.dto";
import { AuthGuard } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { User } from "src/Entities/user.entity";
import { Request } from 'express';
import { CreateCampaignDto } from "./Dto/create.campaign.dto";
import { CampaignPresentation } from "./Presentation/campaign.presentation";
import { SuccessResponseObjectDto } from "src/Response/SuccessResponseObject.dto";
import { FileUploadCompleteDto } from "./Dto/file.upload.complete.dto";
import { ApiTags } from "@nestjs/swagger";
import { UserInfo } from "src/User/Interface/UserInfoInterface";

@Controller("schedule")
@UseGuards(AuthGuard('cookie'))
@ApiTags('Schedule')
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly configService: ConfigService
  ) {}

  @Post("campaign")
  async createCampaign(
    @Req() req: Request,
    @Body() createCampaignDto: CreateCampaignDto
  ) {
    const user = req.user as User;

    const campaign = await this.scheduleService.createCampaign(user, createCampaignDto);

    return new CampaignPresentation().present(campaign);
  }

  @Post("media/upload-url")
  async getUploadUrl(
    @Req() req: Request,
    @Body() fileUploadRequestDto: FileUploadRequestDto
  ) {
    const user = req.user as UserInfo;

    const data = await this.scheduleService.generateUploadUrl(user, fileUploadRequestDto);

    if (!data) {
      throw new HttpException("Something went wrong", HttpStatus.BAD_REQUEST);
    }

    return new SuccessResponseObjectDto({ data });
  }

  @Post("media/upload-complete")
  async uploadComplete(
    @Req() req: Request,
    @Body() fileUploadCompleteDto: FileUploadCompleteDto
  ) {
    const user = req.user as User;

    return this.scheduleService.markUploadComplete(user, fileUploadCompleteDto);
  }
}
