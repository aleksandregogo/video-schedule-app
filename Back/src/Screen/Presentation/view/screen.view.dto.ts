import { ScreenStatus } from "src/Screen/Enum/screen.status.enum";

export class ScreenViewDto {
    id: number;
    name: string;
    status: ScreenStatus;
    lat: number;
    lng: number;
    imageDownloadUrl?: string;
    price: number;
    companyId: number;
}