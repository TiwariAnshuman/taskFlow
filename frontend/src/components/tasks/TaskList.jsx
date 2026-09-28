import {
  CheckCircle2,
  Circle,
  Clock3,
  Pencil,
  
  Trash2,

} from "lucide-react";

function TaskList({ tasks, 
    onEditTask,
    onDeleteTask,


}) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex min-h-56 items-center justify-center rounded-lg border border-dashed border-[#302D29] bg-[#191816]">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[#302D29]">
            <Circle size={18} className="text-[#F59E0B]" />
          </div>

          <h4 className="font-medium text-[#F5F5F4]">
            No tasks yet
          </h4>

          <p className="mt-1 text-sm text-[#A8A29E]">
            Create your first task to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#302D29]">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="relative flex items-center gap-4 border-b border-[#302D29] bg-[#191816] px-5 py-4 last:border-b-0"
        >
          {/* Amber task indicator */}
          <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#F59E0B]" />

          {/* Status icon */}
          <div className="shrink-0">
            {task.status === "completed" ? (
              <CheckCircle2
                size={19}
                className="text-green-500"
              />
            ) : (
              <Clock3
                size={19}
                className="text-[#A8A29E]"
              />
            )}
          </div>

          {/* Task information */}
          <div className="min-w-0 flex-1">
            <h4
              className={`text-sm font-medium ${
                task.status === "completed"
                  ? "text-[#78716C] line-through"
                  : "text-[#F5F5F4]"
              }`}
            >
              {task.title}
            </h4>

            {task.description && (
              <p className="mt-1 truncate text-xs text-[#78716C]">
                {task.description}
              </p>
            )}
          </div>

          {/* Status */}
          <span className="hidden shrink-0 rounded-md border border-[#302D29] bg-[#211F1C] px-2.5 py-1 text-xs text-[#A8A29E] sm:inline-flex">
            {task.status}
          </span>

          {/* Priority */}
          <span className="hidden shrink-0 text-xs text-[#A8A29E] md:inline-flex">
            {task.priority}
          </span>

          {/* Edit */}
          <button
            type="button"
            onClick={() => onEditTask?.(task)}
            className="shrink-0 rounded-lg p-2 text-[#78716C] transition-colors hover:bg-[#211F1C] hover:text-[#F59E0B]"
            aria-label={`Edit ${task.title}`}
          >
            <Pencil size={17} />
          </button>
          <button
  type="button"
  onClick={() => onDeleteTask?.(task)}
  className="shrink-0 rounded-lg p-2 text-[#78716C] transition-colors hover:bg-[#211F1C] hover:text-red-400"
  aria-label={`Delete ${task.title}`}
>
  <Trash2 size={17} />
</button>
        </div>
      ))}
    </div>
  );
}

export default TaskList;