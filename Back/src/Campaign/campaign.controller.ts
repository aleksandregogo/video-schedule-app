import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Req, Get, Param, ParseIntPipe, Put, Delete, HttpCode } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from 'express';
import { CreateCampaignDto } from "./Dto/create.campaign.dto";
import { CampaignPresentation } from "./Presentation/campaign.presentation";
import { SuccessResponseObjectDto } from "src/Response/SuccessResponseObject.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserInfo } from "src/User/Interface/UserInfoInterface";
import { FileUploadRequestDto } from "src/Storage/Dto/file.upload.request.dto";
import { FileUploadCompleteDto } from "src/Storage/Dto/file.upload.complete.dto";
import { CampaignService } from "./campaign.service";
import { ReservationPresentation } from "src/Reservations/Presentation/reservation.presentation";
import { EditCampaignDto } from "./Dto/edit.campaign.dto copy";

@Controller("campaign")
@UseGuards(AuthGuard('cookie'))
@ApiTags('Campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) { }

  @ApiOperation({ summary: 'Create campaign' })
  @Post()
  async createCampaign(
    @Req() req: Request,
    @Body() createCampaignDto: CreateCampaignDto
  ) {
    const user = req.user as UserInfo;

    const campaign = await this.campaignService.createCampaign(user.user, createCampaignDto);

    return new CampaignPresentation().present(campaign);
  }

  @ApiOperation({ summary: 'Update campaign' })
  @Put(':id')
  async editCampaign(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() editCampaignDto: EditCampaignDto
  ) {
    const user = req.user as UserInfo;

    const campaign = await this.campaignService.editCampaign(user.user, id, editCampaignDto);

    return new CampaignPresentation().present(campaign);
  }

  @ApiOperation({ summary: 'Delete campaign' })
  @UseGuards(AuthGuard('cookie'))
  @Delete(':id')
  @HttpCode(204)
  async deleteCampaign(
    @Req() req,
    @Param('id', ParseIntPipe) campaignId: number
  ) {
    const userInfo = req.user as UserInfo;

    await this.campaignService.deleteCampaign(userInfo.userLocalId, campaignId);

    return new SuccessResponseObjectDto({})
  }

  @ApiOperation({ summary: 'Get all campaigns' })
  @Get('all')
  async getCampaigns(@Req() req: Request) {
    const userInfo = req.user as UserInfo;

    const campaigns = await this.campaignService.getAllCampaigns(userInfo.user);

    if (!campaigns) throw new HttpException({
      message: 'Error on selecting all campaigns',
      errorCode: 0,
    }, HttpStatus.BAD_REQUEST)

    return new SuccessResponseObjectDto({
      data: new CampaignPresentation().presentList(campaigns)
    });
  }

  @ApiOperation({ summary: 'Get campaign reservations' })
  @Get(':id/reservations')
  async getCampaignReservations(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const userInfo = req.user as UserInfo;

    const reservations = await this.campaignService.getCampaignReservations(id, userInfo.userLocalId);

    if (!reservations) throw new HttpException({
      message: `Error on selecting reservations for campaign with id: ${id}`,
      errorCode: 0,
    }, HttpStatus.BAD_REQUEST)

    return new SuccessResponseObjectDto({
      data: new ReservationPresentation().presentList(reservations)
    });
  }

  @ApiOperation({ summary: 'Get campaign media url' })
  @Get(':id/media/download-request')
  async getUrl(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const user = req.user as UserInfo;

    return await this.campaignService.generateDownloadUrl(user, id);
  }

  @Post("media/upload-request")
  async getUploadUrl(
    @Req() req: Request,
    @Body() fileUploadRequestDto: FileUploadRequestDto
  ) {
    const user = req.user as UserInfo;

    const data = await this.campaignService.generateUploadUrl(user, fileUploadRequestDto);

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
    const user = req.user as UserInfo;

    return this.campaignService.markUploadComplete(user, fileUploadCompleteDto);
  }

  @ApiOperation({ summary: 'Delete campaign media' })
  @UseGuards(AuthGuard('cookie'))
  @Delete('media/:id')
  @HttpCode(204)
  async deleteCampaignMedia(
    @Req() req,
    @Param('id', ParseIntPipe) campaignId: number
  ) {
    const userInfo = req.user as UserInfo;

    await this.campaignService.deleteCampaignMedia(userInfo.userLocalId, campaignId);

    return new SuccessResponseObjectDto({})
  }
}
