import { Body, Controller, HttpException, HttpStatus, Post, Get, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocationCreateDto } from './Dto/location.create.dto';
import { LocationService } from './location.service';
import { LocationPresentation } from './Presentation/location.presentation';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @ApiOperation({summary: 'Create location'})
  @Post('/create')
  async createLocation(@Request() req, @Body() locationCreateDto: LocationCreateDto) {
    const createdLocation = await this.locationService.createLocation(locationCreateDto);

    if (!createdLocation) throw new HttpException({
      message: 'Location creation error',
      errorCode: 0,
    }, HttpStatus.BAD_REQUEST)

    return new LocationPresentation().present(createdLocation);
  }
}