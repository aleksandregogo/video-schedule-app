import {Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Location } from "src/Entities/location.entity";
import { LocationController } from "./location.controller";
import { LocationService } from "./location.service";
import { CqrsModule } from "@nestjs/cqrs";
import { StorageModule } from "src/Storage/storage.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Location]),
        StorageModule,
        CqrsModule
    ],
    controllers: [LocationController],
    providers: [LocationService],
    exports: [LocationService]
})
export class LocationModule {}