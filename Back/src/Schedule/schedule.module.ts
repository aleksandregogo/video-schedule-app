import {Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";
import { Campaign } from "src/Entities/campaign.entity";
import { Media } from "src/Entities/media.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { StorageModule } from "src/Storage/storage.module";
import { ScreenModule } from "src/Screen/screen.module";
import { Reservation } from "src/Entities/reservation.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Campaign, Media, Reservation]),
        CqrsModule,
        StorageModule,
        ScreenModule
    ],
    controllers: [ScheduleController],
    providers: [ScheduleService],
    exports: [ScheduleService]
})
export class ScheduleModule {
}