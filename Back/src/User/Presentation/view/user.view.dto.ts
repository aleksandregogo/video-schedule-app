import { CompanyViewDto } from "./company.view.dto";

export class UserViewDto {
    id: number;
    name: string;
    company: CompanyViewDto;
}