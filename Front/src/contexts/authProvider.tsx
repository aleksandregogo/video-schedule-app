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
import { getUser, logOut, UserInfo } from "@/actions/auth";

type AuthContextType = {
  user: UserInfo;
  isCompany: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  const checkedAuth = useRef(false);

  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  APIClient.setLogoutCb(() => setUserInfo(null));

  const logout = () => logOut().finally(() => setUserInfo(null));

  const checkUser = async () => {
    const userInfo = await getUser();

    if (userInfo) setUserInfo(userInfo)
    else navigate('/')
    
    checkedAuth.current = true;
    setLoading(false);
  }

  useEffect(() => {
    if (!checkedAuth.current) {
      checkUser();
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ user: userInfo, isCompany: !!userInfo?.company, logout }}
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
