import { Reservation } from "src/Entities/reservation.entity";
import { ReservationViewDto } from "./view/reservations.view.dto";
import { ScreenViewDto } from "./view/screen.view.dto";
import { Screen } from "src/Entities/screen.entity";

export class ScreenPresentation {
    public presentScreen(screen: Screen): ScreenViewDto {
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
            views.push(this.presentScreen(screen))
        }

        return views;
    }

    public presentScreenReservations(reservations: Reservation[]) {
        const views: ReservationViewDto[] = [];

        for (const reservation of reservations) {
            views.push(this.presentReservation(reservation))
        }

        return views;
    }

    public presentReservation(reservation: Reservation) {
        const view = new ReservationViewDto();

        view.id = reservation.id;
        view.title = reservation.name;
        view.start = reservation.startTime;
        view.end = reservation.endTime;
        view.status = reservation.status;

        return view;
    }
}