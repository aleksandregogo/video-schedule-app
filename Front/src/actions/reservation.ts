import { Reservation } from "@/components/screen/types";
import { APIClient } from "@/services/APIClient";

type ReservationOwner = 'screen' | 'campaign';

export const fetchReservations = async (id: number, owner: ReservationOwner): Promise<Reservation[]> => {
  return await APIClient.get(`/${owner}/${id}/reservations`)
    .then((response) => {
      const reservations = response.data.data as Reservation[];

      if (reservations?.length) return reservations;

      return [];
    })
    .catch((err) => {
      console.error("Error fetching screen reservations:", err);
      return [];
    });
}

export interface ReservationDto {
  id?: number;
  name: string;
  startTime: Date;
  endTime: Date;
}

interface UpdateCampaignDto {
  name: string;
  reservations: ReservationDto[];
}

export const updateReservations = async (campaignId: number, body: UpdateCampaignDto) => {
  return await APIClient.put(`/campaign/${campaignId}`, body)
    .then((response) => {
      const data = response.data;
      if (data && data.id) {
        return true;
      } else {
        console.error("Error creating campaign", response?.data);
        return null;
      }
    })
    .catch((err) => {
      console.error("Error creating campaign:", err);
      return null;
    });
}