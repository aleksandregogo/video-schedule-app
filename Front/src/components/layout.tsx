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
      {/* Header for unauthenticated users */}
      {!user && <Header />}

      {/* Sidebar */}
      {user && (
        <aside className="w-64 bg-gray-800 text-white fixed h-full">
          <Sidebar />
        </aside>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 ${user ? "ml-64" : ""} bg-gray-100 overflow-y-auto`}
      >
        <main className="p-6">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </div>
  );
};

export default Layout;