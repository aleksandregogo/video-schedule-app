import { Reservation, ScreenView } from "../screen/types";

export enum CampaignStatus {
  CREATED = 'CREATED',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED'
}

export interface CampaignView {
  id: number;
  createdAt: Date;
  name: string;
  uuid: string;
  screen: ScreenView;
  status: CampaignStatus;
  reservations?: Reservation[];
  mediaUrl?: string;
}