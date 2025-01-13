import { CampaignView, CampaignStatus } from "../campaign/types";
import { Button } from "../ui/button";

const CampaignReview = ({
  campaign,
  onReview,
  onReject
}: {
  campaign: CampaignView,
  onReview: () => void;
  onReject: () => void;
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

  const isConfirmed = campaign?.status === CampaignStatus.CONFIRMED;

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
          variant={isConfirmed ? "destructive" : "default"}
          onClick={isConfirmed ? onReject : onReview}
        >
          {isConfirmed ? 'Reject' : 'Start Review'}
        </Button>
      </div>
    </div>
  )
}

export default CampaignReview;
