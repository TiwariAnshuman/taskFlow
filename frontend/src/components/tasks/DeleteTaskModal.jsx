import { AlertTriangle, Loader2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { StatusBadge, PriorityBadge } from "../ui/Badge";

function DeleteTaskModal({
  isOpen,
  task,
  onClose,
  onConfirm,
  deleteLoading = false,
}) {
  if (!isOpen || !task) {
    return null;
  }

  return (
    <Modal
      size="md"
      icon={AlertTriangle}
      iconTone="red"
      title="Delete task"
      description="This action cannot be undone."
      onClose={onClose}
      closeDisabled={deleteLoading}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={deleteLoading}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Task"
            )}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-6 text-[#A1A7B3]">
        Are you sure you want to delete this task?
      </p>

      {/* Task Preview */}
      <div className="mt-4 rounded-lg border border-[#252A33] bg-[#111318] p-4">
        <h3 className="truncate text-sm font-medium text-[#F5F7FA]">
          {task.title}
        </h3>

        {task.description && (
          <p className="mt-1 truncate text-[13px] text-[#A1A7B3]">
            {task.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
      </div>
    </Modal>
  );
}

export default DeleteTaskModal;