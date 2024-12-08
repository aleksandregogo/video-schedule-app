import {Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CqrsModule } from "@nestjs/cqrs";
import { StorageModule } from "src/Storage/storage.module";
import { ScreenController } from "./screen.controller";
import { ScreenService } from "./screen.service";
import { Screen } from "src/Entities/screen.entity"

@Module({
    imports: [
        TypeOrmModule.forFeature([Screen]),
        StorageModule,
        CqrsModule
    ],
    controllers: [ScreenController],
    providers: [ScreenService],
    exports: [ScreenService]
})
export class ScreenModule {}