import { Injectable, Inject } from "@nestjs/common";
import { APP_CONFIG, AppConfig } from "src/Common/Config/app.config";
import { UserFactory } from "../Factory/user.factory";
import { UserCreateDto } from "../Dto/user.create.dto";

@Injectable()
export class UserService {
  constructor(
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private userFactory: UserFactory
) {}

  async create(userCreateDto: UserCreateDto) {
    return await this.userFactory.create(userCreateDto);
  }
}
