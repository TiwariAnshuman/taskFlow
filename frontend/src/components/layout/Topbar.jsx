import { Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";
import { IconButton } from "../ui/Button";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/tasks": "Tasks",
  "/settings": "Settings",
};

function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const title = pageTitles[pathname] || "Workspace";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-[#252A33] bg-[#0B0D10]/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-2">
        <IconButton
          icon={Menu}
          label="Open navigation"
          onClick={onMenuClick}
          aria-controls="mobile-navigation"
          className="-ml-2 lg:hidden"
          iconSize={19}
        />

        <div className="flex min-w-0 items-center gap-2 text-sm">
          <span className="hidden text-[#6B7280] sm:inline">Workspace</span>
          <span aria-hidden="true" className="hidden text-[#323845] sm:inline">
            /
          </span>
          <span className="truncate font-medium text-[#F5F7FA]">{title}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <IconButton icon={Bell} label="Notifications" />

        <div className="ml-1 flex items-center gap-2.5 border-l border-[#252A33] pl-3 sm:pl-4">
          <Avatar name={user?.name} />

          <span className="hidden max-w-[10rem] truncate text-sm text-[#F5F7FA] sm:block">
            {user?.name || "Account"}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;