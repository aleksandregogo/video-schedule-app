import {Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Campaign } from "src/Entities/campaign.entity";
import { Media } from "src/Entities/media.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { StorageModule } from "src/Storage/storage.module";
import { ScreenModule } from "src/Screen/screen.module";
import { Reservation } from "src/Entities/reservation.entity";
import { CampaignController } from "./campaign.controller";
import { CampaignService } from "./campaign.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Campaign, Media, Reservation]),
        CqrsModule,
        StorageModule,
        ScreenModule
    ],
    controllers: [CampaignController],
    providers: [CampaignService],
    exports: [CampaignService]
})
export class CampaignModule {
}