import { ScreenStatus, ScreenView } from "@/components/screen/types";
import { APIClient } from "@/services/APIClient";

export const fetchScreens = async (forCompany: boolean = false): Promise<ScreenView[]> => {
  const endpoint = forCompany ? `/screen/all-company` : '/screen/all'

  return await APIClient.get(endpoint)
    .then((response) => {
      const screens = response.data.data as ScreenView[];

      if (screens) {
        screens.sort((a, b) => a.id - b.id);

        const data = screens.map(
          (screen: ScreenView) =>
            ({
              id: screen.id,
              name: screen.name,
              status: screen.status,
              lat: screen.lat,
              lng: screen.lng,
              imageDownloadUrl: screen.imageDownloadUrl,
              price: screen.price,
              companyId: screen.companyId
            } as ScreenView)
        );

        return data;
      }

      return [];
    })
    .catch((err) => {
      console.error("Error fetching screens:", err);
      return [];
    });
}

interface CreateScreenDto {
  name: string;
  lat: number;
  lng: number;
  price: number;
  status: ScreenStatus;
}

export const createScreen = async (body: CreateScreenDto): Promise<boolean | null> => {
  return await APIClient.post("/screen/create", body)
    .then(() => true)
    .catch((err) => {
      console.error("Error creating screen:", err);
      return null;
    });
}

export const changeScreenStatus = async (screenId: number, status: ScreenStatus): Promise<boolean | null> => {
  return await APIClient.put(`/screen/${screenId}/status`, {
    status
  })
    .then(() => true)
    .catch((err) => {
      console.error("Error changing screens status:", err);
      return null;
    });
}

export const deleteScreen = async (screenId: number): Promise<boolean | null> => {
  return await APIClient.delete(`/screen/${screenId}`)
    .then(() => true)
    .catch((err) => {
      console.error("Error deleting screen:", err);
      return null;
    });
}

export const deleteScreenImage = async (screenId: number): Promise<boolean | null> => {
  return await APIClient.delete(`/screen/media/${screenId}`)
    .then(() => true)
    .catch((err) => {
      console.error("Error deleting screen image:", err);
      return null;
    });
}