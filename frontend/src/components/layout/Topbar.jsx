
import { Bell, Plus } from "lucide-react";

function Topbar({ onNewTask }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#302D29] bg-[#11100E] px-6">

      {/* Left */}
      <div>
        <p className="text-xs uppercase tracking-widest text-[#A8A29E]">
          Workspace
        </p>

        <h1 className="text-lg font-semibold text-[#F5F5F4]">
          My Tasks
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Notifications */}
        <button
          type="button"
          className="rounded-lg p-2 text-[#A8A29E] transition-colors hover:bg-[#211F1C] hover:text-[#F5F5F4]"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        {/* New Task */}
        <button
          type="button"
          onClick={onNewTask}
          className="flex items-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-2 text-sm font-medium text-[#11100E] transition-colors hover:bg-[#D97706]"
        >
          <Plus size={17} />
          New Task
        </button>

      </div>
    </header>
  );
}

export default Topbar;
