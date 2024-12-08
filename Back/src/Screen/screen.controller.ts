import { Body, Controller, HttpException, HttpStatus, Post, UseGuards, Req, Get } from '@nestjs/common';
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

    return new ScreenPresentation().present(createdScreen);
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
}