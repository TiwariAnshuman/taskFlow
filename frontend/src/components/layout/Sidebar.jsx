import {
  CheckSquare,
  LayoutDashboard,
  LogOut,
  Settings,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";
import Logo from "../ui/Logo";
import { IconButton, focusRing } from "../ui/Button";

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

function SidebarBody({ onNavigate, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center justify-between px-5">
        <Logo />

        {onClose && (
          <IconButton
            icon={X}
            label="Close navigation"
            onClick={onClose}
            className="-mr-2"
          />
        )}
      </div>

      {/* Navigation */}
      <nav aria-label="Main" className="flex-1 space-y-0.5 px-3 pt-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-150 ease-out ${focusRing} ${
                  isActive
                    ? "bg-[#7C3AED]/10 text-[#F5F7FA]"
                    : "text-[#A1A7B3] hover:bg-[#16191F] hover:text-[#F5F7FA]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={17}
                    aria-hidden="true"
                    className={`transition-colors duration-150 ${
                      isActive
                        ? "text-[#A78BFA]"
                        : "text-[#6B7280] group-hover:text-[#A1A7B3]"
                    }`}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="shrink-0 border-t border-[#252A33] p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar name={user?.name} size="lg" />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#F5F7FA]">
              {user?.name || "Your account"}
            </p>

            <p className="truncate text-xs text-[#6B7280]">
              {user?.email || ""}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className={`mt-1 flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-[#A1A7B3] transition-colors duration-150 ease-out hover:bg-[#16191F] hover:text-[#F5F7FA] ${focusRing}`}
        >
          <LogOut size={17} aria-hidden="true" className="text-[#6B7280]" />
          Logout
        </button>
      </div>
    </>
  );
}

function Sidebar({ open = false, onClose }) {
  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-[#252A33] bg-[#0B0D10] lg:flex">
        <SidebarBody />
      </aside>

      {/* Mobile / tablet drawer */}
      <div
        className={`fixed inset-0 z-50 transition-[visibility] duration-200 lg:hidden ${
          open ? "visible" : "invisible"
        }`}
      >
        <div
          onClick={onClose}
          aria-hidden="true"
          className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ease-out ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-[#252A33] bg-[#0B0D10] shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-transform duration-200 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarBody onNavigate={onClose} onClose={onClose} />
        </aside>
      </div>
    </>
  );
}

export default Sidebar;