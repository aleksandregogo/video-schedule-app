import { CampaignView } from "@/components/campaign/types";
import { ScreenView } from "@/components/screen/types";
import { APIClient } from "@/services/APIClient";
import { ReservationDto } from "./reservation";

export const fetchAllCampaigns = async (forCompany: boolean = false): Promise<CampaignView[]> => {
  const endpoint = forCompany ? 'all-company' : 'all';

  return await APIClient.get(`/campaign/${endpoint}`)
    .then((response) => {
      const campaigns = response.data.data as CampaignView[];

      if (campaigns) {
        campaigns.sort((a, b) => (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));

        const data = campaigns.map(
          (campaign: CampaignView) =>
            ({
              id: campaign.id,
              createdAt: campaign.createdAt,
              name: campaign.name,
              uuid: campaign.uuid,
              status: campaign.status,
              screen: {
                id: campaign.screen.id,
                name: campaign.screen.name,
                status: campaign.screen.status,
                lat: campaign.screen.lat,
                lng: campaign.screen.lng,
                imageDownloadUrl: campaign.screen.imageDownloadUrl,
                price: campaign.screen.price,
                companyId: campaign.screen.companyId
              } as ScreenView
            } as CampaignView)
        );

        return data;
      }

      return [];
    })
    .catch((err) => {
      console.error("Error fetching screens:", err);
      return []
    });
};


interface CreateCampaignDto {
  name: string;
  screenId: number;
  reservations: ReservationDto[];
}

export const createCampaign = async (body: CreateCampaignDto): Promise<boolean | null> => {
  return await APIClient.post(`/campaign`, body)
    .then((response) => {
      const data = response.data;
      if (data && data.id) {
        return true;
      } else {
        console.error("Error creating campaign", response?.data);
        return false;
      }
    })
    .catch((err) => {
      console.error("Error creating campaign:", err);
      return null;
    });
}

export const fetchCampaignMedia = async (id: number): Promise<string | null> => {
  return await APIClient.get(`/campaign/${id}/media/download-request`)
    .then((response) => response.data.downloadUrl || null)
    .catch((err) => {
      console.error("Error fetching campaign media:", err);
      return null;
    });
}

export const deleteCampaignMedia = async (campaignId: number) => {
  return await APIClient.delete(`/campaign/media/${campaignId}`)
    .catch((err) => {
      console.error("Error deleting campaign media:", err);
      return null;
    });
}

export const deleteCampaign = async (campaignId: number) => {
  return await APIClient.delete(`/campaign/${campaignId}`)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.error("Error deleting campaign media:", err);
      return null;
    });
}

export type CampaignReviewAction = 'submit' | 'cancel';

export const updateCampaignReviewStatus = async (campaignId: number, action: CampaignReviewAction) => {
  return await APIClient.post(`/campaign/review/${campaignId}/${action}`)
    .then((response) => {
      const data = response.data;
      if (data && data.id) {
        return true;
      } else {
        console.error("Error submiting campaign for review", response?.data);
        return null;
      }
    })
    .catch((err) => {
      console.error("Error submiting campaign for review", err);
      return null;
    });
}