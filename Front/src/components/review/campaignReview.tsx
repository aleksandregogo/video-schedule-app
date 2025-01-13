import { CampaignView, CampaignStatus } from "../campaign/types";
import { Button } from "../ui/button";

const CampaignReview = ({
  campaign,
  // onDelete,
  // onEdit,
  onReview,
  // onCancel
}: {
  campaign: CampaignView,
  // onDelete: (campaign: CampaignView) => void;
  // onEdit: (campaign: CampaignView) => void;
  onReview: (campaign: CampaignView) => void;
  // onCancel: (campaign: CampaignView) => void;
}) => {
  const StatusColors = {
    confirmed: "border-green-500",
    rejected: "border-red-500",
    pending: "border-amber-500",
  };

  let borderColor: string = StatusColors.pending;

  switch(campaign?.status) {
    case CampaignStatus.PENDING:
      borderColor = StatusColors.pending;
      break;
    case CampaignStatus.CONFIRMED:
      borderColor = StatusColors.confirmed;
      break;
    case CampaignStatus.REJECTED:
      borderColor = StatusColors.rejected;
      break;
    default:
      borderColor = StatusColors.pending;
      break;
  }

  return (
    <div
      key={campaign.id}
      className={`border-2 ${borderColor} rounded-lg shadow p-4 bg-gray-50`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{campaign.name}</h2>
      </div>
      <p className="text-sm text-gray-600">
        Status: {campaign.status.toLowerCase()}
      </p>
      <p className="text-sm text-gray-600">
        Screen: {campaign.screen.name}
      </p>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => onReview(campaign)}
        >
          Start Review
        </Button>
      </div>
    </div>
  )
}

export default CampaignReview;
