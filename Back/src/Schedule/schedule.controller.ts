import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Req } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { FileUploadDto } from "./Dto/file.upload.dto";
import { AuthGuard } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { User } from "src/Entities/user.entity";
import { Request, Response } from 'express';
import { CreateCampaignDto } from "./Dto/create.campaign.dto";
import { CampaignPresentation } from "./Presentation/campaign.presentation";
import { SuccessResponseObjectDto } from "src/Response/SuccessResponseObject.dto";
import { FileUploadCompleteDto } from "./Dto/file.upload.complete.dto";

@Controller("schedule")
@UseGuards(AuthGuard('cookie'))
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
    @Body() fileUploadDto: FileUploadDto
  ) {
    const user = req.user as User;

    const { size, mimeType } = fileUploadDto;

    if (!this.configService.get('S3_ALLOWED_MIME_TYPES').includes(mimeType)) {
      throw new HttpException("Invalid file type", HttpStatus.BAD_REQUEST);
    }

    if (size > this.configService.get('S3_ALLOWED_FILE_SIZE')) {
      throw new HttpException("File size exceeds limit", HttpStatus.BAD_REQUEST);
    }

    return new SuccessResponseObjectDto({
      data: {
        uploadUrl: this.scheduleService.generateUploadUrl(user, fileUploadDto),
        campaignId: fileUploadDto.campaignId
      }
    })
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
