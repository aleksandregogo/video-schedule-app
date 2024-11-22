import { LocationViewDto } from "./view/location.view.dto";
import { Location } from "src/Entities/location.entity";

export class LocationPresentation {
    public present(location: Location): LocationViewDto {
        const view = new LocationViewDto();

        view.createdAt = location.createdAt;
        view.name = location.name;
        return view;
    }
}