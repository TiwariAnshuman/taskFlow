import {
  CheckCircle2,
  Circle,
  CircleDot,
  ListTodo,
  Pencil,
  Trash2,
} from "lucide-react";

import { StatusBadge, PriorityBadge } from "../ui/Badge";
import { EmptyState } from "../ui/Feedback";
import { IconButton } from "../ui/Button";

// ---------------------------------------------------------
// Display helpers (presentation only)
// ---------------------------------------------------------

const parseDueDate = (value) => {
  if (!value) return null;

  const [year, month, day] = String(value).split("T")[0].split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
};

const formatDueDate = (date) => {
  if (!date) return "No due date";

  const sameYear = date.getFullYear() === new Date().getFullYear();

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
};

const isOverdue = (date, status) => {
  if (!date || status === "completed") return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date < today;
};

function StatusIndicator({ status }) {
  if (status === "completed") {
    return (
      <CheckCircle2
        size={18}
        aria-hidden="true"
        className="text-[#22C55E]"
      />
    );
  }

  if (status === "in-progress") {
    return (
      <CircleDot
        size={18}
        aria-hidden="true"
        className="text-[#A78BFA]"
      />
    );
  }

  return (
    <Circle
      size={18}
      aria-hidden="true"
      className="text-[#6B7280]"
    />
  );
}

function DueDate({ task, className = "" }) {
  const date = parseDueDate(task.dueDate);
  const overdue = isOverdue(date, task.status);

  return (
    <span
      className={`whitespace-nowrap text-xs ${
        overdue ? "text-[#F87171]" : "text-[#A1A7B3]"
      } ${className}`}
    >
      {overdue ? "Overdue · " : ""}
      {formatDueDate(date)}
    </span>
  );
}

function TaskList({
  tasks,
  onEditTask,
  onDeleteTask,
  showActions = true,
  filtered = false,
}) {
  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        icon={ListTodo}
        title={filtered ? "No matching tasks" : "No tasks yet"}
        description={
          filtered
            ? "Try adjusting your search or clearing your filters."
            : "Create your first task to get started."
        }
        className="min-h-56"
      />
    );
  }

  return (
    <ul className="divide-y divide-[#252A33] overflow-hidden rounded-xl border border-[#252A33] bg-[#16191F]">
      {tasks.map((task) => {
        const completed = task.status === "completed";

        return (
          <li
            key={task._id}
            className="group flex items-start gap-3 px-4 py-3.5 transition-colors duration-150 ease-out hover:bg-[#1B1F27]/70 sm:px-5"
          >
            {/* Status indicator */}
            <div className="mt-0.5 shrink-0">
              <StatusIndicator status={task.status} />
            </div>

            {/* Task information */}
            <div className="min-w-0 flex-1">
              <h4
                className={`truncate text-sm font-medium ${
                  completed
                    ? "text-[#6B7280] line-through"
                    : "text-[#F5F7FA]"
                }`}
              >
                {task.title}
              </h4>

              {task.description && (
                <p
                  className={`mt-0.5 truncate text-[13px] ${
                    completed ? "text-[#6B7280]/80" : "text-[#A1A7B3]"
                  }`}
                >
                  {task.description}
                </p>
              )}

              {/* Mobile metadata */}
              <div
                className={`mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 md:hidden ${
                  completed ? "opacity-70" : ""
                }`}
              >
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                <DueDate task={task} />
              </div>
            </div>

            {/* Desktop metadata */}
            <div
              className={`hidden shrink-0 items-center gap-3 md:flex ${
                completed ? "opacity-70" : ""
              }`}
            >
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
              <DueDate task={task} className="w-24 text-right" />
            </div>

            {/* Actions */}
            {showActions && (
              <div className="-mr-1.5 flex shrink-0 items-center gap-0.5">
                <IconButton
                  icon={Pencil}
                  label={`Edit ${task.title}`}
                  onClick={() => onEditTask?.(task)}
                  className="hover:text-[#A78BFA]"
                />

                <IconButton
                  icon={Trash2}
                  label={`Delete ${task.title}`}
                  onClick={() => onDeleteTask?.(task)}
                  className="hover:bg-[#EF4444]/10 hover:text-[#F87171]"
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default TaskList;