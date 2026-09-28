import {
  CheckSquare,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Tasks",
      path: "/tasks",
      icon: CheckSquare,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-[#302D29] bg-[#191816]">
      
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#302D29]">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-[#F59E0B]" />

          <span className="text-lg font-semibold tracking-tight text-[#F5F5F4]">
            TASKFLOW
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[#211F1C] text-[#F59E0B]"
                    : "text-[#A8A29E] hover:bg-[#211F1C] hover:text-[#F5F5F4]"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#302D29]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#A8A29E] hover:bg-[#211F1C] hover:text-[#F5F5F4] text-sm transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;