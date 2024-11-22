import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LocationCreateDto } from "./Dto/location.create.dto";
import { Location } from "src/Entities/location.entity";


@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location) private locationRepository: Repository<Location>
) {}

  async createLocation(locationCreateDto: LocationCreateDto): Promise<Location | null> {
    const location = new Location();
    location.name = locationCreateDto.name;

    return this.locationRepository.save(location)
      .catch((err) => {
        console.error(err);
        return null;
      })
  }
}
