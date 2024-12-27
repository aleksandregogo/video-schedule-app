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
import ConfirmationModal from "@/components/ui/confirmation-modal";

export enum CampaignStatus {
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED'
}

export type ReservationOwner = 'screen' | 'campaign';
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
  const [selectedReservations, setSelectedReservations] = useState<Reservation[]>([]);

  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalStep, setEditModalStep] = useState(0);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

  const handleClickEdit = async (campaign: CampaignView) => {
    await loadReservations(campaign);
    setSelectedCampaign(campaign);
    setEditModalOpen(true);
  }

  const handleClickDelete = async (campaign: CampaignView) => {
    setSelectedCampaign(campaign);
    setDeleteModalOpen(true);
  }

  const loadReservations = async (campaign: CampaignView) => {
    const screenReservations = await fetchReservations(campaign.screen.id, 'screen');
    const campaignReservations = await fetchReservations(campaign.id, 'campaign');

    const selectedReservations = screenReservations.map(
      (screenRes: Reservation) => {
        const isCampaignOwned = !!campaignReservations.find((res) => res.id === screenRes.id);

        return {
          id: screenRes.id,
          title: screenRes.title,
          status: screenRes.status,
          start: formatDateTimeLocal(screenRes.start),
          end: formatDateTimeLocal(screenRes.end),
          backgroundColor: isCampaignOwned ? "#eab308" : '#f87171',
          canEdit: isCampaignOwned
        } as Reservation
      }
    );

    setSelectedReservations(selectedReservations);
  }

  const fetchReservations = async (id: number, owner: ReservationOwner): Promise<Reservation[]> => {
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

  const handleEdit = async (reservations: Reservation[], name: string) => {
    const reservedTimes = [];

    reservations.forEach((reservation) => {
      if (reservation.canEdit) {
        reservedTimes.push({
          id: reservation.id || null,
          name: reservation.title,
          startTime: new Date(reservation.start),
          endTime: new Date(reservation.end),
        });
      }
    })

    if (!reservedTimes.length) {
      console.error("Reserved times is empty");
      return;
    }

    APIClient.put(`/campaign/${selectedCampaign.id}`, {
      name,
      reservations: reservedTimes
    })
      .then((response) => {
        const data = response.data;
        if (data && data.id) {
          setSelectedCampaign(null);
          setEditModalOpen(false);
          fetchCampaigns();
          toast({
            title: "Campaign Updated",
            description: `Campaign #${selectedCampaign.name} has been successfully updated.`,
            variant: "success",
          });
        } else {
          console.error("Error creating campaign", response?.data);
        }
      })
      .catch((err) => {
        console.error("Error creating campaign:", err);
      });
  }

  const handleDelete = () => {
    if (!selectedCampaign) {
      console.error("Campaign is empty");
      return;
    }

    APIClient.delete(`/campaign/${selectedCampaign.id}`)
      .then(() => {
        setSelectedCampaign(null);
        setDeleteModalOpen(false);
        fetchCampaigns();
        toast({
          title: "Campaign Deleted",
          description: `Campaign #${selectedCampaign.name} has been successfully updated.`,
          variant: "success",
        });
      })
      .catch((err) => {
        console.error("Error creating campaign:", err);
        setSelectedCampaign(null);
        setDeleteModalOpen(false);
        toast({
          title: "Campaign Deleted",
          description: `Something went wront while deleting campaign #${selectedCampaign.name}.`,
          variant: "destructive",
        });
      });
  };

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
                  onClick={() => handleClickDelete(campaign)}
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
                  onClick={() => handleClickEdit(campaign)}
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
        isEditMode={true}
        title={selectedCampaign?.name || ''}
        price={selectedCampaign?.screen?.price || 0}
        reservedSlots={selectedReservations}
        step={editModalStep}
        onStepChange={(step) => setEditModalStep(step)}
        onClose={() => setEditModalOpen(false)}
        onReloadReservations={() => loadReservations(selectedCampaign)}
        onReservationsSubmit={handleEdit}
      />}

      {deleteModalOpen && (
        <ConfirmationModal
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title={`Deleting campaign: ${selectedCampaign.name}`}
          description="Are you sure you want to delete this campaign? This action cannot be undone."
        />
      )}
    </div>
  );
};

export default Campaigns;
