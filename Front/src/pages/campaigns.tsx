import { useEffect, useState } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { APIClient } from "@/services/APIClient";
import { useParams } from "react-router-dom";
import { ScreenView } from "./screens";
import { Reservation, ReservationDto } from "@/components/screen/types";
import ScreenTimeSlotsModal from "@/components/screen/modals/screen-time-slots-modal";
import { formatDateTimeLocal } from "@/lib/utils";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import Campaign from "@/components/campaign/campaign";
import CampaignSubmitModal from "@/components/campaign/modals/campaign-submit-modal";

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
  mediaUrl?: string;
}

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<CampaignView[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignView | null>(null);
  const [selectedReservations, setSelectedReservations] = useState<Reservation[]>([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalStep, setEditModalStep] = useState(0);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitModalStep, setSubmitModalStep] = useState(0);

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


  const handleClickReview = async (campaign: CampaignView) => {
    campaign.reservations = (await fetchReservations(campaign.id, 'campaign')).map((res) => {
      return {
        ...res,
        canEdit: true,
        confirmed: true
      }
    });

    campaign.mediaUrl = await fetchCampaignMedia(campaign.id);

    setSelectedCampaign(campaign);
    setSubmitModalOpen(true);
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

  const fetchCampaignMedia = async (id: number): Promise<string | null> => {
    return await APIClient.get(`/campaign/${id}/media/download-request`)
      .then((response) => response.data.downloadUrl || null)
      .catch((err) => {
        console.error("Error fetching campaign media:", err);
        return null;
      });
  }

  const handleDeleteCampaignMedia = async (): Promise<string | null> => {
    if (!selectedCampaign.id) return;
    return await APIClient.delete(`/campaign/media/${selectedCampaign.id}`)
      .then(() => {
        setSelectedCampaign({
          ...selectedCampaign,
          mediaUrl: null
        });
      })
      .catch((err) => {
        console.error("Error deleting campaign media:", err);
        return null;
      });
  }

  const handleEdit = async (reservations: Reservation[], name: string) => {
    await updateCampaignReservations(reservations, name)
      .then(() => {
        setSelectedCampaign(null);
        setEditModalStep(0);
        setEditModalOpen(false);
        fetchCampaigns();
        toast({
          title: "Campaign Updated",
          description: `Campaign #${selectedCampaign.name} has been successfully updated.`,
          variant: "success",
        });
      })
  }

  const updateCampaignReservations = async (reservations: Reservation[], name: string) => {
    const reservedTimes: ReservationDto[] = [];

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

    return await APIClient.put(`/campaign/${selectedCampaign.id}`, {
      name,
      reservations: reservedTimes
    })
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

  const handleClickSubmit = async (reservations: Reservation[], name: string) => {
    await updateCampaignReservations(reservations, name)
      .then(() => {
        setSelectedCampaign(null);
        setSubmitModalOpen(false);
        setSubmitModalStep(0);
        fetchCampaigns();
        toast({
          title: "Campaign review requested",
          description: `Review requested for Campaign #${selectedCampaign.name}. Wait for moderator to approve. you'll be notified`,
          variant: "success",
        });
      })
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Campaigns</h1>
      <div className="grid grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Campaign
            key={campaign.uuid}
            campaign={campaign}
            onSubmit={handleClickReview}
            onEdit={handleClickEdit}
            onDelete={handleClickDelete}
          />
        ))}
      </div>

      {/* Media Upload Modal */}
      {submitModalOpen && selectedCampaign && (
        <CampaignSubmitModal
          campaign={selectedCampaign}
          step={submitModalStep}
          onStepChange={(step) => setSubmitModalStep(step)}
          onClose={() => {
            setSubmitModalStep(0)
            setSubmitModalOpen(false)
          }}
          onSubmit={handleClickSubmit}
          onEditTime={() => {
            setSubmitModalStep(0)
            setEditModalStep(0)
            setSubmitModalOpen(false)
            handleClickEdit(selectedCampaign)
          }}
          onMediaDelete={handleDeleteCampaignMedia}
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
        onClose={() => {
          setEditModalStep(0)
          setEditModalOpen(false)
        }}
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
