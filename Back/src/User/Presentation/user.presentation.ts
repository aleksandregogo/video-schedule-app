import { UserViewDto } from "./view/user.view.dto";
import { User } from "src/Entities/user.entity";


export class UserPresentation {
    public present(user: User): UserViewDto {
        const view = new UserViewDto();
        view.name = user.name;
        return view;
    }
}