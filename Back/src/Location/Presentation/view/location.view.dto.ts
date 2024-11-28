import { LocationStatus } from "src/Location/Enum/location.status.enum";

export class LocationViewDto {
    id: number;
    name: string;
    status: LocationStatus;
    lat: number;
    lng: number;
    imageDownloadUrl?: string;
    price: number;
    companyId: number;
}