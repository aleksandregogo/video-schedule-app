export interface Reservation extends SelectedSlotInfo {
  id?: number;
  status?: ReservationStatus;
  canEdit: boolean;
  confirmed?: boolean;
};

export interface ReservationDto {
  id: number;
  name: string;
  startTime: Date;
  endTime: Date;
}

export enum ReservationStatus {
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED'
}

export interface SelectedSlotInfo extends CalendarEvent {
  backgroundColor?: string;
  title?: string;
}

export type CalendarEvent = {
  start: string;
  end: string;
}