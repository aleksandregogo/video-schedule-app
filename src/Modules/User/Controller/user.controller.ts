import { Body, Controller, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserCreateDto } from '../Dto/user.create.dto';
import { UserService } from '../Services/user.service';
import { UserPresentation } from '../Presentation/user.presentation';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({summary: 'Create User'})
  @Post()
  async createUser(@Request() req, @Body() userCreateDto: UserCreateDto) {
      const createdUser = await this.userService.create(userCreateDto);

      if (!createdUser) throw new HttpException({
        message: 'User creation error',
        errorCode: 0,
    }, HttpStatus.BAD_REQUEST)

    return new UserPresentation().present(createdUser);
  }
}
