import { Trash2, CalendarArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import { CampaignStatus, CampaignView } from "@/pages/campaigns";

const Campaign = ({
  campaign,
  onDelete,
  onEdit,
  onSubmit
}: {
  campaign: CampaignView,
  onDelete: (campaign: CampaignView) => void;
  onEdit: (campaign: CampaignView) => void;
  onSubmit: (campaign: CampaignView) => void;
}) => {
  const StatusColors = {
    confirmed: "border-green-500",
    rejected: "border-red-500",
    pending: "border-amber-500",
    created: "border-gray-500",
  };

  let borderColor: string = StatusColors.created;

  switch(campaign?.status) {
    case CampaignStatus.CREATED:
      borderColor = StatusColors.created;
      break;
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
      borderColor = StatusColors.created;
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
      {/* <p className="text-sm text-gray-600">
        Reservations: {campaign.reservations?.length || 0}
      </p>
      <p className="text-sm text-gray-600">
        Price: {campaign.reservations?.length || 0}
      </p> */}
      <div className="flex justify-between items-center mt-4">
        {/* Left-aligned buttons */}
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => onEdit(campaign)}
          >
            <CalendarArrowUp/>
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(campaign)}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Right-aligned button */}
        <Button
          onClick={() => onSubmit(campaign)}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

export default Campaign;
