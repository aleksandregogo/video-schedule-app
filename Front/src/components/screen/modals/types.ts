export interface Reservation extends SelectedSlotInfo {
  id?: number;
  status?: ReservationStatus;
  canEdit: boolean;
};

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