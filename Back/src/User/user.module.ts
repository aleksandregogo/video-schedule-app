import {Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "src/Entities/user.entity";
import { UserFactory } from "./user.factory";

@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserFactory
    ],
    exports: [UserService]
})
export class UserModule {
}