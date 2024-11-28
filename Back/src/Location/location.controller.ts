import { Body, Controller, HttpException, HttpStatus, Post, UseGuards, Req, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocationCreateDto } from './Dto/location.create.dto';
import { LocationService } from './location.service';
import { LocationPresentation } from './Presentation/location.presentation';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/User/Interface/UserInfoInterface';
import { Request } from 'express';
import { LocationImageUploadRequestDto } from './Dto/location.image.upload.request.dto';
import { SuccessResponseObjectDto } from 'src/Response/SuccessResponseObject.dto';
import { LocationImageUploadCompleteDto } from './Dto/location.image.upload.complete.dto';

@ApiTags('Location')
@Controller('location')
@UseGuards(AuthGuard('cookie'))
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @ApiOperation({summary: 'Create location'})
  @Post('/create')
  async createLocation(@Req() req, @Body() locationCreateDto: LocationCreateDto) {
    const user = req.user as UserInfo;

    if (!user.company) {
      throw new HttpException({
        message: 'Access denied.',
        errorCode: 0,
      }, HttpStatus.UNAUTHORIZED)
    }

    const createdLocation = await this.locationService.createLocation(user, locationCreateDto);

    if (!createdLocation) throw new HttpException({
      message: 'Location creation error',
      errorCode: 0,
    }, HttpStatus.BAD_REQUEST)

    return new LocationPresentation().present(createdLocation);
  }

  @ApiOperation({summary: 'Get all locations'})
  @Get('/all')
  async getLocations() {
    const locations = await this.locationService.getAllLocation();

    if (!locations) throw new HttpException({
      message: 'Error on selecting all locations',
      errorCode: 0,
    }, HttpStatus.BAD_REQUEST)

    return new SuccessResponseObjectDto({
      data: new LocationPresentation().presentList(locations)
    });
  }

  @Post("media/upload-request")
  async getUploadUrl(
    @Req() req: Request,
    @Body() locationImageUploadRequestDto: LocationImageUploadRequestDto
  ) {
    const user = req.user as UserInfo;

    if (!user.company) {
      throw new HttpException({
        message: 'Access denied.',
        errorCode: 0,
      }, HttpStatus.UNAUTHORIZED)
    }

    const data = await this.locationService.generateUploadUrl(user, locationImageUploadRequestDto);

    if (!data) {
      throw new HttpException("Something went wrong", HttpStatus.BAD_REQUEST);
    }

    return new SuccessResponseObjectDto({ data });
  }

  @Post("media/upload-complete")
  async uploadComplete(
    @Req() req: Request,
    @Body() locationImageUploadCompleteDto: LocationImageUploadCompleteDto
  ) {
    const user = req.user as UserInfo;

    if (!user.company) {
      throw new HttpException({
        message: 'Access denied.',
        errorCode: 0,
      }, HttpStatus.UNAUTHORIZED)
    }

    return this.locationService.markUploadComplete(user, locationImageUploadCompleteDto);
  }
}