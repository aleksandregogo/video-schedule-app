import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/Entities/user.entity";
import { Equal, Repository } from "typeorm";


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
) {}

  async findByFacebookId(facebookId: string): Promise<User | null> {
    return this.userRepository.findOneOrFail({ where: { facebookId: Equal(facebookId) } })
    .catch((err) => {
      console.error(err);
      return null;
    })
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findOneOrFail({ where: { googleId: Equal(googleId) } })
      .catch((err) => {
        console.log(err);
        return null
      })
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user)
      .catch((err) => {
        console.log(err);
        return null
      })
  }
}
