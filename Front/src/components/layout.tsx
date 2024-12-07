import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar";

const Layout: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;