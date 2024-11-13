import {Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./Controller/user.controller";
import { UserService } from "./Services/user.service";
import { User } from "src/Entities/user.entity";
import { UserFactory } from "./Factory/user.factory";

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