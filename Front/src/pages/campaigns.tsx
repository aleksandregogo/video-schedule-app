import { useEffect, useState } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { Reservation } from "@/components/screen/types";
import ScreenTimeSlotsModal from "@/components/screen/modals/screen-time-slots-modal";
import { formatDateTimeLocal } from "@/lib/utils";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import Campaign from "@/components/campaign/campaign";
import CampaignSubmitModal from "@/components/campaign/modals/campaign-submit-modal";
import { CampaignView } from "@/components/campaign/types";
import { fetchReservations, ReservationDto, updateReservations } from "@/actions/reservation";
import { deleteCampaign, deleteCampaignMedia, fetchAllCampaigns, fetchCampaignMedia, updateCampaignReviewStatus } from "@/actions/campaign";

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

  const refreshCampaigns = async () => {
    const campaigns = await fetchAllCampaigns();

    if (campaigns) {
      setCampaigns(campaigns)
    }
  }

  useEffect(() => {
    refreshCampaigns()
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

  const handleClickCancel = async (campaign: CampaignView) => {
    await updateCampaignReviewStatus(campaign.id, 'cancel')
      .then(() => {
        refreshCampaigns();
        toast({
          title: "Campaign review canceled",
          description: `You can now modifie or delete your campaign`,
          variant: "success",
        });
      })
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

  const handleDeleteCampaignMedia = async () => {
    if (!selectedCampaign.id) return;
    return await deleteCampaignMedia(selectedCampaign.id)
      .then(() => {
        setSelectedCampaign({
          ...selectedCampaign,
          mediaUrl: null
        });
      })
  }

  const handleEdit = async (reservations: Reservation[], name: string) => {
    await updateCampaignReservations(reservations, name)
      .then(() => {
        setSelectedCampaign(null);
        setEditModalStep(0);
        setEditModalOpen(false);
        refreshCampaigns();
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

    return await updateReservations(selectedCampaign.id, {
      name,
      reservations: reservedTimes
    });
  }

  const handleDelete = async () => {
    if (!selectedCampaign) {
      console.error("Campaign is empty");
      return;
    }

    await deleteCampaign(selectedCampaign.id)
      .then(() => {
        setSelectedCampaign(null);
        setDeleteModalOpen(false);
        refreshCampaigns();
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
    const updatedReservations = await updateCampaignReservations(reservations, name);

    if (updatedReservations) {
      await updateCampaignReviewStatus(selectedCampaign.id, 'submit')
        .then(() => {
          setSelectedCampaign(null);
          setSubmitModalOpen(false);
          setSubmitModalStep(0);
          refreshCampaigns();
          toast({
            title: "Campaign review requested",
            description: `Review requested for Campaign #${selectedCampaign.name}. Wait for moderator to approve. you'll be notified`,
            variant: "success",
          });
        })
    }
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
            onCancel={handleClickCancel}
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
