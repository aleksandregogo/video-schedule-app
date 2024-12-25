import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/contexts/authProvider";
import Header from "./header";
import { Toaster } from "@/components/ui/toaster";

const Layout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-screen">
      {!user && <Header />}
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className="flex-1 bg-gray-100 overflow-auto">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </div>
  );
};

export default Layout;