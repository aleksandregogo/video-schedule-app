import { CampaignStatus } from "src/Campaign/Enum/campaign.status.enum";
import { ReservationViewDto } from "src/Reservations/Presentation/view/reservations.view.dto";
import { ScreenViewDto } from "src/Screen/Presentation/view/screen.view.dto";

export class CampaignViewDto {
    id: number;
    createdAt: Date;
    name: string;
    uuid: string;
    status: CampaignStatus;
    screen: ScreenViewDto;
    reservations: ReservationViewDto;
}