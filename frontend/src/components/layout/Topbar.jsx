import { Bell, Plus } from "lucide-react";

function Topbar() {
  return (
    <header className="h-16 shrink-0 border-b border-[#302D29] bg-[#11100E] flex items-center justify-between px-6">
      
      <div>
        <p className="text-xs uppercase tracking-widest text-[#A8A29E]">
          Workspace
        </p>

        <h1 className="text-lg font-semibold text-[#F5F5F4]">
          My Tasks
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg text-[#A8A29E] hover:bg-[#211F1C] hover:text-[#F5F5F4] transition-colors">
          <Bell size={18} />
        </button>

        <button className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-[#11100E] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={17} />
          New Task
        </button>
      </div>
    </header>
  );
}

export default Topbar;