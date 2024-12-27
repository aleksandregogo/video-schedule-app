import React from "react";
import { API_URL } from "@/config/appConfig";
import { FaGoogle, FaFacebook } from "react-icons/fa";

const Header: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${API_URL}/auth/facebook`;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="flex gap-6">
        <div
          onClick={handleGoogleLogin}
          className="cursor-pointer flex items-center bg-white shadow-md rounded-full p-4 hover:shadow-lg hover:bg-gray-50 transition"
        >
          <FaGoogle className="text-red-500 w-10 h-10" />
        </div>
        <div
          onClick={handleFacebookLogin}
          className="cursor-pointer flex items-center bg-white shadow-md rounded-full p-4 hover:shadow-lg hover:bg-gray-50 transition"
        >
          <FaFacebook className="text-blue-600 w-10 h-10" />
        </div>
      </div>
    </div>
  );
};

export default Header;
