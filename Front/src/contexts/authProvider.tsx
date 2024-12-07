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
  name: string;
}

type AuthContextType = {
  userInfo: UserInfo;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  
  APIClient.setLogoutCb(() => navigate('/login'));

  const checkedAuth = useRef(false);

  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (!checkedAuth.current) {
      APIClient.get('/auth/user')
        .then((response) => {
          const data = response.data.data;
  
          setUserInfo({
            name: data.name
          })
        })
        .catch((err) => {
          console.error('Error fetching user info:', err);
          navigate('/login')
        })
        .finally(() => {
          checkedAuth.current = true;
          setLoading(false);
        })
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ userInfo }}
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
