import { Campaign } from "src/Entities/campaign.entity";
import { CampaignViewDto } from "./view/campaign.view.dto";


export class CampaignPresentation {
    public present(campaign: Campaign): CampaignViewDto {
        const view = new CampaignViewDto();

        view.createdAt = campaign.createdAt;
        view.name = campaign.name;
        return view;
    }
}