import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tv, SwatchBook, ImagePlay, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/authProvider";

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const isCompany = !!user.company;

  return (
    <aside className="h-screen w-64 bg-gray-800 text-white">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Adloop</h1>
      </div>
      <nav className="p-4 space-y-4">
        {isCompany &&
          <NavLink
            to="/screens"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 px-3 py-2 rounded hover:bg-gray-700",
                isActive ? "bg-gray-700" : ""
              )
            }
          >
            <Tv className="w-5 h-5" />
            <span>Screens</span>
          </NavLink>
        }
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
        <NavLink
          to="/media"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-3 py-2 rounded hover:bg-gray-700",
              isActive ? "bg-gray-700" : ""
            )
          }
        >
          <ImagePlay className="w-5 h-5" />
          <span>Media</span>
        </NavLink>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <NavLink
          to="/"
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
