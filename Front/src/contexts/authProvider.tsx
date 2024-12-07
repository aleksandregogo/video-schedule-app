import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { APIClient } from "@/services/APIClient";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";


interface UserInfo {
  id: number;
  name: string;
  company?: {
    id: number;
    name: string;
  };
}

type AuthContextType = {
  user: UserInfo;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  const checkedAuth = useRef(false);

  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  APIClient.setLogoutCb(() => setUserInfo(null));

  const logout = async () => {
    APIClient.delete('/auth/logout')
      .catch((err) => console.error('Error on log out:', err))
      .finally(() => setUserInfo(null));
  }

  useEffect(() => {
    if (!checkedAuth.current) {
      APIClient.get('/auth/user')
        .then((response) => {
          const userData = response.data?.data as UserInfo;
  
          if (userData) {
            setUserInfo(userData);
          } else {
            console.error('User info is not present in response');
          }
        })
        .catch((err) => console.error('Error fetching user info:', err))
        .finally(() => {
          checkedAuth.current = true;
          setLoading(false);
        })
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ user: userInfo, logout }}
    >
      {loading ? <Spinner variant="fullsize" /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
