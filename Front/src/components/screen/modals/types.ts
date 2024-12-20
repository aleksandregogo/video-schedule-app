export interface Reservation extends SelectedTime {
  id: string;
  title: string;
  backgroundColor: string;
  isNew: boolean;
};
  
export type SelectedTime = {
  start: string;
  end: string;
};

export type CalendarEvent = {
  start: string;
  end: string;
}