import { Reservation } from "src/Entities/reservation.entity";
import { ReservationViewDto } from "./view/reservations.view.dto";

export class ReservationPresentation {
    public present(reservation: Reservation) {
        const view = new ReservationViewDto();

        view.id = reservation.id;
        view.title = reservation.name;
        view.start = reservation.startTime;
        view.end = reservation.endTime;
        view.status = reservation.status;

        return view;
    }

    public presentList(reservations: Reservation[]) {
        const views: ReservationViewDto[] = [];

        for (const reservation of reservations) {
            views.push(this.present(reservation))
        }

        return views;
    }
}