import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDto } from '../Dto/user.create.dto';
import { User } from 'src/Entities/user.entity';
import { Repository, Equal } from 'typeorm';

@Injectable()
export class UserFactory {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(userCreateDto: UserCreateDto) {
    const user: User = new User();

    user.name = userCreateDto.name;
    user.type = userCreateDto.type;

    return this.userRepository.save(user);
  }

  async getUserById(userId: number) {
    return this.userRepository.findOneOrFail({
      where: {
        id: Equal(userId)
      }
    })
  }
}