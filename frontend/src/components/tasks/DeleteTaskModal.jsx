
import { AlertTriangle, X } from "lucide-react";

function DeleteTaskModal({
  isOpen,
  task,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !task) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-[#302D29] bg-[#191816] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#302D29] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-950/40">
              <AlertTriangle
                size={18}
                className="text-red-400"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#F5F5F4]">
                Delete Task
              </h2>

              <p className="mt-1 text-xs text-[#78716C]">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#78716C] transition-colors hover:bg-[#211F1C] hover:text-[#F5F5F4]"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-sm leading-6 text-[#A8A29E]">
            Are you sure you want to delete this task?
          </p>

          {/* Task Preview */}
          <div className="mt-4 rounded-lg border border-[#302D29] bg-[#11100E] p-4">
            <h3 className="truncate text-sm font-medium text-[#F5F5F4]">
              {task.title}
            </h3>

            {task.description && (
              <p className="mt-1 truncate text-xs text-[#78716C]">
                {task.description}
              </p>
            )}

            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-md border border-[#302D29] bg-[#211F1C] px-2 py-1 text-xs text-[#A8A29E]">
                {task.status}
              </span>

              <span className="text-xs text-[#78716C]">
                {task.priority} priority
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#302D29] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#302D29] bg-[#211F1C] px-4 py-2.5 text-sm font-medium text-[#D6D3D1] transition-colors hover:bg-[#2A2723] hover:text-[#F5F5F4]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Delete Task
          </button>
        </div>

      </div>
    </div>
  );
}

export default DeleteTaskModal;