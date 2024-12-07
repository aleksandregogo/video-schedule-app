import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Presentation, SwatchBook, LogOut } from "lucide-react";
import { APIClient } from "@/services/APIClient";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const logout = async () => {
    APIClient.delete('/auth/logout')
      .catch((err) => {
        console.error('Error on log out:', err);
      })
      .finally(() => navigate('/login'))
  }

  return (
    <aside className="h-screen w-64 bg-gray-800 text-white">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">My App</h1>
      </div>
      <nav className="p-4 space-y-4">
        <NavLink
          to="/screens"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-3 py-2 rounded hover:bg-gray-700",
              isActive ? "bg-gray-700" : ""
            )
          }
        >
          <Presentation className="w-5 h-5" />
          <span>Screens</span>
        </NavLink>
        <NavLink
          to="/campaigns"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-3 py-2 rounded hover:bg-gray-700",
              isActive ? "bg-gray-700" : ""
            )
          }
        >
          <SwatchBook className="w-5 h-5" />
          <span>Campaigns</span>
        </NavLink>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <NavLink
          to="/logout"
          onClick={logout}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-3 py-2 rounded hover:bg-gray-700",
              isActive ? "bg-gray-700" : ""
            )
          }
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
