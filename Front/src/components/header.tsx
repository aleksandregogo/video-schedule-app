import React from "react";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/appConfig";

const Header: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${API_URL}/auth/facebook`;
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGoogleLogin}
        className="w-64 bg-red-500 text-white hover:bg-red-600"
      >
        Login with Google
      </Button>
      <Button
        onClick={handleFacebookLogin}
        className="w-64 bg-blue-500 text-white hover:bg-blue-600"
      >
        Login with Facebook
      </Button>
    </div>
  );
};

export default Header;
