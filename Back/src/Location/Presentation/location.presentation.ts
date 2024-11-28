import { LocationViewDto } from "./view/location.view.dto";
import { Location } from "src/Entities/location.entity";

export class LocationPresentation {
    public present(location: Location): LocationViewDto {
        const view = new LocationViewDto();

        view.id = location.id;
        view.name = location.name;
        view.status = location.status;
        view.lat = location.lat;
        view.lng = location.lng;
        view.price = location.price;
        view.companyId = location.companyId;

        if (location.imageDownloadUrl) view.imageDownloadUrl = location.imageDownloadUrl;

        return view;
    }

    public presentList(locations: Location[]): LocationViewDto[] {
        const views: LocationViewDto[] = [];

        for (const location of locations) {
            views.push(this.present(location))
        }

        return views;
    }
}