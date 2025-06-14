import { Company } from "src/Entities/company.entity";
import { UserViewDto } from "./view/user.view.dto";
import { User } from "src/Entities/user.entity";
import { CompanyViewDto } from "./view/company.view.dto";


export class UserPresentation {
    public present(user: User, company: Company, campaignCount: number): UserViewDto {
        const userView = new UserViewDto();
        userView.id = user.id;
        userView.name = user.name;

        if (company) {
            const companyView = new CompanyViewDto();
            companyView.id = company.id;
            companyView.name = company.name;

            companyView.campaignCount = campaignCount;

            userView.company = companyView;
        } else {
            userView.campaignCount = campaignCount;
        }
        return userView;
    }
}