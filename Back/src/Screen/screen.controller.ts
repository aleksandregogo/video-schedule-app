import { Body, Controller, HttpException, HttpStatus, Post, UseGuards, Req, Get, Param, Delete, HttpCode, Put, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/User/Interface/UserInfoInterface';
import { Request } from 'express';
import { SuccessResponseObjectDto } from 'src/Response/SuccessResponseObject.dto';
import { FileUploadRequestDto } from 'src/Storage/Dto/file.upload.request.dto';
import { FileUploadCompleteDto } from 'src/Storage/Dto/file.upload.complete.dto';
import { ScreenService } from './screen.service';
import { ScreenCreateDto } from './Dto/screen.create.dto';
import { ScreenPresentation } from './Presentation/screen.presentation';
import { ToggleScreenStatusDto } from './Dto/toggle.screen.status.dto';

@ApiTags('Screen')
@Controller('screen')
export class ScreenController {
  constructor(private readonly screenService: ScreenService) {}

  @ApiOperation({summary: 'Create screen'})
  @Post('/create')
  @UseGuards(AuthGuard('cookie'))
  async createScreen(@Req() req, @Body() screenCreateDto: ScreenCreateDto) {
    const user = req.user as UserInfo;

    if (!user.company) {
      throw new HttpException({
        message: 'Access denied.',
        errorCode: 0,
      }, HttpStatus.UNAUTHORIZED)
    }

    const createdScreen = await this.screenService.createScreen(user, screenCreateDto);

    if (!createdScreen) throw new HttpException({
      message: 'Screen creation error',
      errorCode: 0,
    }, HttpStatus.BAD_REQUEST)

    return new ScreenPresentation().presentScreen(createdScreen);
  }

  @ApiOperation({summary: 'Get all screens'})
  @Get('/all')
  async getScreens() {
    const screens = await this.screenService.getAllScreens();

    if (!screens) throw new HttpException({
      message: 'Error on selecting all screens',
      errorCode: 0,
    }, HttpStatus.BAD_REQUEST)

    return new SuccessResponseObjectDto({
      data: new ScreenPresentation().presentList(screens)
    });
  }

  @ApiOperation({summary: 'Get Company screens'})
  @UseGuards(AuthGuard('cookie'))
  @Get('/all-company')
  async getCompanyScreens(@Req() req: Request) {
    const userInfo = req.user as UserInfo;

    if (!userInfo.company?.id) {
      throw new HttpException({
        message: 'Access denied.',
        errorCode: 0,
      }, HttpStatus.UNAUTHORIZED)
    }

    const screens = await this.screenService.getCompanyScreens(userInfo.company.id);

    if (!screens) throw new HttpException({
      message: `Error on selecting company screens with id: ${userInfo.company.id}`,
      errorCode: 0,
    }, HttpStatus.BAD_REQUEST)

    return new SuccessResponseObjectDto({
      data: new ScreenPresentation().presentList(screens)
    });
  }

  @ApiOperation({summary: 'Get screen reservations'})
  @Get(':id/reservations')
  async getScreenReservations(@Param('id', ParseIntPipe) id: number) {
    const reservations = await this.screenService.getScreenReservations(id);

    if (!reservations) throw new HttpException({
      message: `Error on selecting reservations for screen with id: ${id}`,
      errorCode: 0,
    }, HttpStatus.BAD_REQUEST)

    return new SuccessResponseObjectDto({
      data: new ScreenPresentation().presentScreenReservations(reservations)
    });
  }

  // @ApiOperation({summary: 'Create screen'})
  // @Post(':id/reservations')
  // @UseGuards(AuthGuard('cookie'))
  // async addReservation(@Req() req, @Body() screenCreateDto: ScreenCreateDto) {
  //   const user = req.user as UserInfo;

  //   if (!user.company) {
  //     throw new HttpException({
  //       message: 'Access denied.',
  //       errorCode: 0,
  //     }, HttpStatus.UNAUTHORIZED)
  //   }

  //   const createdScreen = await this.screenService.createScreen(user, screenCreateDto);

  //   if (!createdScreen) throw new HttpException({
  //     message: 'Screen creation error',
  //     errorCode: 0,
  //   }, HttpStatus.BAD_REQUEST)

  //   return new ScreenPresentation().presentScreen(createdScreen);
  // }

  @ApiOperation({summary: 'Toggle screen status'})
  @Put(':id/status')
  @UseGuards(AuthGuard('cookie'))
  async toggleScreenStatus(
    @Req() req,
    @Param('id') screenId: number,
    @Body() toggleScreenStatusDto: ToggleScreenStatusDto
  ) {
    const user = req.user as UserInfo;

    if (!user.company) {
      throw new HttpException({
        message: 'Access denied.',
        errorCode: 0,
      }, HttpStatus.UNAUTHORIZED)
    }

    const updatedScreen = await this.screenService.toggleScreenStatus(user, screenId, toggleScreenStatusDto);

    if (!updatedScreen) throw new HttpException({
      message: 'Screen status toggle error',
      errorCode: 0,
    }, HttpStatus.BAD_REQUEST)

    return new ScreenPresentation().presentScreen(updatedScreen);
  }

  @ApiOperation({summary: 'Delete screen'})
  @UseGuards(AuthGuard('cookie'))
  @Delete(':id')
  @HttpCode(204)
  async deleteScreen(
    @Req() req,
    @Param('id', ParseIntPipe) screenId: number
  ) {
    const userInfo = req.user as UserInfo;

    if (!userInfo?.company) {
      throw new HttpException({
        message: 'Access denied.',
        errorCode: 0,
      }, HttpStatus.BAD_REQUEST)
    }

    await this.screenService.deleteScreen(userInfo, screenId);

    return new SuccessResponseObjectDto({})
  }

  @Post("media/upload-request")
  @UseGuards(AuthGuard('cookie'))
  async getUploadUrl(
    @Req() req: Request,
    @Body() fileUploadDto: FileUploadRequestDto
  ) {
    const user = req.user as UserInfo;

    if (!user.company) {
      throw new HttpException({
        message: 'Access denied.',
        errorCode: 0,
      }, HttpStatus.UNAUTHORIZED)
    }

    const data = await this.screenService.generateUploadUrl(user, fileUploadDto);

    if (!data) {
      throw new HttpException("Something went wrong", HttpStatus.BAD_REQUEST);
    }

    return new SuccessResponseObjectDto({ data });
  }

  @Post("media/upload-complete")
  @UseGuards(AuthGuard('cookie'))
  async uploadComplete(
    @Req() req: Request,
    @Body() fileUploadCompleteDto: FileUploadCompleteDto
  ) {
    const user = req.user as UserInfo;

    if (!user.company) {
      throw new HttpException({
        message: 'Access denied.',
        errorCode: 0,
      }, HttpStatus.UNAUTHORIZED)
    }

    return this.screenService.markUploadComplete(user, fileUploadCompleteDto);
  }

  @ApiOperation({summary: 'Delete screen photo'})
  @UseGuards(AuthGuard('cookie'))
  @Delete('media/:id')
  @HttpCode(204)
  async deleteScreenPhoto(
    @Req() req,
    @Param('id', ParseIntPipe) screenId: number
  ) {
    const userInfo = req.user as UserInfo;

    await this.screenService.deleteScreenPhoto(userInfo, screenId);

    return new SuccessResponseObjectDto({})
  }
}