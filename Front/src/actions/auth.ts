import { APIClient } from "@/services/APIClient";

export interface UserInfo {
  id: number;
  name: string;
  company?: {
    id: number;
    name: string;
  };
}

export const logOut = async () => {
  await APIClient.delete('/auth/logout')
    .catch((err) => console.error('Error on log out:', err))
}

export const getUser = async (): Promise<UserInfo | null> => {
  return await APIClient.get('/auth/user')
    .then((response) => {
      const userData = response?.data?.data as UserInfo;

      if (userData) {
        return userData;
      } else {
        console.error('User info is not present in response');
        return null;
      }
    })
    .catch((err) => {
      console.error('Error fetching user info:', err);
      return null;
    })
}