import { useEffect, useState } from "react";
import CampaignReview from "@/components/review/campaignReview";
import ReviewSubmitModal from "@/components/review/modals/review-submit-modal";
import { CampaignView } from "@/components/campaign/types";
import { fetchReservations } from "@/actions/reservation";
import { fetchAllCampaigns, fetchCampaignMedia } from "@/actions/campaign";

const Reviews = () => {
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>
      <div className="grid grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <CampaignReview
            key={campaign.uuid}
            campaign={campaign}
            onReview={() => handleClickReview(campaign)}
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
          onConfirm={() => {}}
          onReject={() => {}}
        />
      )}
    </div>
  );
};

export default Reviews;
