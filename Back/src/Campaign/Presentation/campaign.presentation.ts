import { Campaign } from "src/Entities/campaign.entity";
import { CampaignViewDto } from "./view/campaign.view.dto";
import { ScreenPresentation } from "src/Screen/Presentation/screen.presentation";


export class CampaignPresentation {
    public present(campaign: Campaign): CampaignViewDto {
        const view = new CampaignViewDto();

        view.createdAt = campaign.createdAt;
        view.id = campaign.id;
        view.uuid = campaign.uuid;
        view.name = campaign.name;
        view.status = campaign.status;

        if (campaign.screen) view.screen = new ScreenPresentation().presentScreen(campaign.screen);

        return view;
    }

    public presentList(campaigns: Campaign[]): CampaignViewDto[] {
        const views: CampaignViewDto[] = [];

        for (const campaign of campaigns) {
            views.push(this.present(campaign))
        }

        return views;
    }
}