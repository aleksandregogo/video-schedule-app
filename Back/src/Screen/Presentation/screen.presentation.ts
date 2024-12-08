import { ScreenViewDto } from "./view/screen.view.dto";
import { Screen } from "src/Entities/screen.entity";

export class ScreenPresentation {
    public present(screen: Screen): ScreenViewDto {
        const view = new ScreenViewDto();

        view.id = screen.id;
        view.name = screen.name;
        view.status = screen.status;
        view.lat = screen.lat;
        view.lng = screen.lng;
        view.price = screen.price;
        view.companyId = screen.companyId;

        if (screen.imageDownloadUrl) view.imageDownloadUrl = screen.imageDownloadUrl;

        return view;
    }

    public presentList(screens: Screen[]): ScreenViewDto[] {
        const views: ScreenViewDto[] = [];

        for (const screen of screens) {
            views.push(this.present(screen))
        }

        return views;
    }
}