import { ReservationStatus } from "src/Reservations/Enum/reservation.status.enum";

export class ReservationViewDto {
    id: number;
    start: Date;
    end: Date;    
    status: ReservationStatus;
    title: string;
}