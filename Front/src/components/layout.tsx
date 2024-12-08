import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/contexts/authProvider";
import Header from "./header";

const Layout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-screen">
      {!user && <Header />}
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className="flex-1 p-4 bg-gray-100 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;