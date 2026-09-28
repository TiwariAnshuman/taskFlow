import {
  CheckSquare,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";

function Sidebar() {
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
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#211F1C] text-[#F59E0B] text-sm">
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#A8A29E] hover:bg-[#211F1C] hover:text-[#F5F5F4] text-sm transition-colors">
          <CheckSquare size={18} />
          Tasks
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#A8A29E] hover:bg-[#211F1C] hover:text-[#F5F5F4] text-sm transition-colors">
          <Settings size={18} />
          Settings
        </button>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#302D29]">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#A8A29E] hover:bg-[#211F1C] hover:text-[#F5F5F4] text-sm transition-colors">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;