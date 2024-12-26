import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import MediaUploadModal from "@/components/campaign/modals/media-upload-modal";
import { useToast } from "@/hooks/ui/use-toast";
import { APIClient } from "@/services/APIClient";
import { useParams } from "react-router-dom";
import { ScreenView } from "./screens";
import { Reservation } from "@/components/screen/types";
import { Edit2, Trash2 } from "lucide-react";
import ScreenTimeSlotsModal from "@/components/screen/modals/screen-time-slots-modal";
import { formatDateTimeLocal } from "@/lib/utils";

export enum CampaignStatus {
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
}

const Campaigns = () => {
  const { id } = useParams();

  const [campaigns, setCampaigns] = useState<CampaignView[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignView | null>(null);
  const [selectedCampaignReservations, setSelectedCampaignReservations] = useState<Reservation[]>([]);

  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { toast } = useToast();

  const fetchCampaigns = () => {
    APIClient.get('/campaign/all')
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

          setCampaigns(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching screens:", err);
      });
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);


  const onSubmit = (campaignId: number) => {

  }

  const handleDelete = (campaignId: number) => {
    toast({
      title: "Campaign Deleted",
      description: `Campaign #${campaignId} has been successfully deleted.`,
      variant: "success",
    });
  };

  const handleCampaignEdit = async (campaign: CampaignView) => {
    await reloadReservations(campaign);
    setSelectedCampaign(campaign);
    setEditModalOpen(true);
  }

  const reloadReservations = async (campaign: CampaignView) => {
    await fetchScreenReservations(campaign.screen.id)
    await fetchCampaignReservations(campaign.id);
  }

  const fetchScreenReservations = async (screenId: number) => {
    await APIClient.get(`/screen/${screenId}/reservations`)
      .then((response) => {
        const reservations = response.data.data as Reservation[];

        if (reservations) {  
          const data = reservations.map(
            (reservation: Reservation) =>
              ({
                id: reservation.id,
                title: reservation.title,
                status: reservation.status,
                start: formatDateTimeLocal(reservation.start),
                end: formatDateTimeLocal(reservation.end),
                backgroundColor: "#f87171",
                canEdit: false
              } as Reservation)
          );

          // setSelectedScreenReservations(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching screens:", err);
      });
  }

  const fetchCampaignReservations = async (screenId: number) => {
    await APIClient.get(`/campaign/${screenId}/reservations`)
      .then((response) => {
        const reservations = response.data.data as Reservation[];

        if (reservations) {  
          const data = reservations.map(
            (reservation: Reservation) =>
              ({
                id: reservation.id,
                title: reservation.title,
                status: reservation.status,
                start: formatDateTimeLocal(reservation.start),
                end: formatDateTimeLocal(reservation.end),
                backgroundColor: "#f87171",
                canEdit: false
              } as Reservation)
          );

          // setSelectedScreenReservations(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching screens:", err);
      });
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Campaigns</h1>
      <div className="grid grid-cols-1 gap-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="border rounded-lg shadow p-4 bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{campaign.name}</h2>
              <Button
                  variant="destructive"
                  onClick={() => handleDelete(campaign.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
            </div>
            <p className="text-sm text-gray-600">
              Status: {campaign.status}
            </p>
            <p className="text-sm text-gray-600">
              Screen: {campaign.screen.name}
            </p>
            <p className="text-sm text-gray-600">
              Reservations: {campaign.reservations?.length || 0}
            </p>
            <p className="text-sm text-gray-600">
              Price: {campaign.reservations?.length || 0}
            </p>
            <div className="flex justify-between items-center mt-4">
              {/* Left-aligned buttons */}
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => handleCampaignEdit(campaign)}
                >
                  <Edit2/>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCampaign(campaign);
                    setMediaModalOpen(true);
                  }}
                >
                  Upload Media
                </Button>
              </div>

              {/* Right-aligned button */}
              <Button
                onClick={() => onSubmit(campaign.id)}
              >
                Review
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Media Upload Modal */}
      {mediaModalOpen && selectedCampaign && (
        <MediaUploadModal
          campaign={selectedCampaign}
          onClose={() => setMediaModalOpen(false)}
          // onUpdateMedia={onUpdateMedia}
        />
      )}

      {/* Edit Reservations Modal */}
      {editModalOpen && <ScreenTimeSlotsModal
        screen={selectedCampaign?.screen}
        screenReservations={selectedCampaignReservations}
        onClose={() => setEditModalOpen(false)}
        reloadReservations={() => reloadReservations(selectedCampaign)}
      />}
    </div>
  );
};

export default Campaigns;
