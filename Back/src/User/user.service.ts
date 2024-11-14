import { APP_CONFIG, AppConfig } from "src/Common/Config/app.config";
import { UserCreateDto } from "./Dto/user.create.dto";
import { UserFactory } from "./user.factory";
import { Injectable, Inject } from "@nestjs/common";


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
