import { useEffect, useState } from "react";
import CampaignReview from "@/components/review/campaignReview";
import ReviewSubmitModal from "@/components/review/modals/review-submit-modal";
import { CampaignView } from "@/components/campaign/types";
import { fetchReservations } from "@/actions/reservation";
import { CampaignReviewAction, fetchAllCampaigns, fetchCampaignMedia, updateCampaignReviewStatus } from "@/actions/campaign";
import { useToast } from "@/hooks/ui/use-toast";

const Reviews = () => {
  const { toast } = useToast();

  const [campaigns, setCampaigns] = useState<CampaignView[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignView | null>(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewModalStep, setReviewModalStep] = useState(0);

  const refreshCampaigns = async () => {
    const campaigns = await fetchAllCampaigns(true);

    if (campaigns) {
      setCampaigns(campaigns)
    }
  };

  useEffect(() => {
    refreshCampaigns();
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
    setReviewModalStep(0)
    setReviewModalOpen(true)
  }

  const handleStatusChange = async (campaignId: number, action: CampaignReviewAction) => {
    const updated = await updateCampaignReviewStatus(campaignId, action)

    if (updated) {
      await refreshCampaigns();

      setReviewModalStep(0)
      setReviewModalOpen(false)
      if (selectedCampaign) setSelectedCampaign(null);

      toast({
        title: "Campaign review canceled",
        description: `You can now modifie or delete your campaign`,
        variant: "success",
      });
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>
      <div className="grid grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <CampaignReview
            key={campaign.uuid}
            campaign={campaign}
            onReview={() => handleClickReview(campaign)}
            onReject={() => handleStatusChange(campaign.id, 'reject')}
          />
        ))}
      </div>

      {reviewModalOpen && selectedCampaign && (
        <ReviewSubmitModal
          campaign={selectedCampaign}
          step={reviewModalStep}
          onStepChange={(step) => setReviewModalStep(step)}
          onClose={() => {
            setSelectedCampaign(null);
            setReviewModalStep(0)
            setReviewModalOpen(false)
          }}
          onConfirm={() => handleStatusChange(selectedCampaign.id, 'confirm')}
          onReject={() => handleStatusChange(selectedCampaign.id, 'reject')}
        />
      )}
    </div>
  );
};

export default Reviews;
