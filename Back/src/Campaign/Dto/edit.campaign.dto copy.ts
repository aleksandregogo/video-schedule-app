import { OmitType } from "@nestjs/swagger";
import { CreateCampaignDto } from "./create.campaign.dto";

export class EditCampaignDto extends OmitType(CreateCampaignDto, ['screenId'] as const) {}