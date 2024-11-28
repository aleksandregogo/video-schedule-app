import {Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";
import { Campaign } from "src/Entities/campaign.entity";
import { Media } from "src/Entities/media.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { StorageModule } from "src/Storage/storage.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Campaign, Media]),
        CqrsModule,
        StorageModule
    ],
    controllers: [ScheduleController],
    providers: [ScheduleService],
    exports: [ScheduleService]
})
export class ScheduleModule {
}