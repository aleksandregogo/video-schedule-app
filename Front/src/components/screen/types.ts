export interface Reservation extends SelectedSlotInfo {
  id?: number;
  status?: ReservationStatus;
  canEdit: boolean;
  confirmed?: boolean;
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

export interface ScreenView {
  id: number;
  name: string;
  status: ScreenStatus;
  lat: number;
  lng: number;
  imageDownloadUrl?: string;
  price: number;
  companyId: number;
}

export enum ScreenStatus {
  ON = 'ON',
  OFF = 'OFF',
}