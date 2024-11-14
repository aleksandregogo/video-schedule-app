import { User } from "src/Entities/user.entity";
import { UserViewDto } from "./view/user.view.dto";


export class UserPresentation {
    public present(user: User): UserViewDto {
        const view = new UserViewDto();

        view.createdAt = user.createdAt;
        view.name = user.name;
        return view;
    }
}