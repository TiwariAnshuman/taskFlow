import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import AppShell from "../components/layout/AppShell";

import TaskList from "../components/tasks/TaskList";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import EditTaskModal from "../components/tasks/EditTaskModal";
import DeleteTaskModal from "../components/tasks/DeleteTaskModal";

import Button, { focusRing } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { TaskSkeleton } from "../components/ui/Feedback";

import api from "../services/api";

function Tasks() {
  // =========================================================
  // TASK STATE
  // =========================================================

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================================
  // FILTER STATE
  // =========================================================

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [priority, setPriority] = useState("");

  const [dueDateFilter, setDueDateFilter] = useState("");

  // =========================================================
  // SORT STATE
  // =========================================================

  const [sort, setSort] = useState("createdAt");

  const [sortOrder, setSortOrder] = useState("desc");

  // =========================================================
  // PAGINATION STATE
  // =========================================================

  const [page, setPage] = useState(1);

  const [limit] = useState(5);

  const [totalTasks, setTotalTasks] = useState(0);

  const [count, setCount] = useState(0);

  // =========================================================
  // MODAL STATE
  // =========================================================

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  // =========================================================
  // UI-ONLY STATE (mobile filter panel)
  // =========================================================

  const [filtersOpen, setFiltersOpen] = useState(false);

  // =========================================================
  // FETCH TASKS
  // =========================================================

  const fetchTasks = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await api.get("/tasks", {
        params: {
          search,
          status,
          priority,
          dueDateFilter,
          page,
          limit,
          sort,
          sortOrder,
        },
      });

      const taskData = response.data.data;

      setTasks(taskData.tasks);

      setTotalTasks(taskData.totalTasks);

      setCount(taskData.count);
    } catch (error) {
      console.error(
        "FETCH TASKS ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to fetch tasks."
      );

      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH WHEN QUERY CHANGES
  // =========================================================

  useEffect(() => {
    fetchTasks();
  }, [
    search,
    status,
    priority,
    dueDateFilter,
    page,
    sort,
    sortOrder,
  ]);

  // =========================================================
  // FILTER HANDLERS
  // =========================================================

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
    setPage(1);
  };

  const handleDueDateChange = (value) => {
    setDueDateFilter(value);
    setPage(1);
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setDueDateFilter("");
    setPage(1);
  };

  const hasActiveFilters =
    search ||
    status ||
    priority ||
    dueDateFilter;

  // =========================================================
  // SORT HANDLER
  // =========================================================

  const handleSortChange = (value) => {
    switch (value) {
      case "newest":
        setSort("createdAt");
        setSortOrder("desc");
        break;

      case "oldest":
        setSort("createdAt");
        setSortOrder("asc");
        break;

      case "title-az":
        setSort("title");
        setSortOrder("asc");
        break;

      case "title-za":
        setSort("title");
        setSortOrder("desc");
        break;

      case "due-earliest":
        setSort("dueDate");
        setSortOrder("asc");
        break;

      case "due-latest":
        setSort("dueDate");
        setSortOrder("desc");
        break;

      default:
        setSort("createdAt");
        setSortOrder("desc");
    }

    setPage(1);
  };

  // =========================================================
  // CURRENT SORT VALUE
  // =========================================================

  const getCurrentSort = () => {
    if (
      sort === "createdAt" &&
      sortOrder === "desc"
    ) {
      return "newest";
    }

    if (
      sort === "createdAt" &&
      sortOrder === "asc"
    ) {
      return "oldest";
    }

    if (
      sort === "title" &&
      sortOrder === "asc"
    ) {
      return "title-az";
    }

    if (
      sort === "title" &&
      sortOrder === "desc"
    ) {
      return "title-za";
    }

    if (
      sort === "dueDate" &&
      sortOrder === "asc"
    ) {
      return "due-earliest";
    }

    if (
      sort === "dueDate" &&
      sortOrder === "desc"
    ) {
      return "due-latest";
    }

    return "newest";
  };

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.ceil(
    totalTasks / limit
  );

  const canGoPrevious = page > 1;

  const canGoNext = page < totalPages;

  const handlePreviousPage = () => {
    if (canGoPrevious) {
      setPage(
        (currentPage) => currentPage - 1
      );
    }
  };

  const handleNextPage = () => {
    if (canGoNext) {
      setPage(
        (currentPage) => currentPage + 1
      );
    }
  };

  // =========================================================
  // CREATE TASK
  // =========================================================

  const handleTaskCreated = async () => {
    setShowCreateModal(false);

    setPage(1);

    await fetchTasks();
  };

  // =========================================================
  // EDIT TASK
  // =========================================================

  const handleEditTask = (task) => {
    setSelectedTask(task);

    setShowEditModal(true);
  };

  // =========================================================
  // UPDATE TASK
  // =========================================================

  const handleTaskUpdated = async () => {
    setShowEditModal(false);

    setSelectedTask(null);

    await fetchTasks();
  };

  // =========================================================
  // DELETE TASK
  // =========================================================

  const handleDeleteTask = (task) => {
    setSelectedTask(task);

    setShowDeleteModal(true);
  };

  // =========================================================
  // CONFIRM DELETE
  // =========================================================

  const handleConfirmDelete = async () => {
    if (!selectedTask) {
      return;
    }

    try {
      setDeleteLoading(true);

      await api.delete(
        `/tasks/${selectedTask._id}`
      );

      setShowDeleteModal(false);

      setSelectedTask(null);

      /*
        If we deleted the only task on the current
        page and we're not on page 1, go back one page.
      */

      if (count === 1 && page > 1) {
        setPage(
          (currentPage) => currentPage - 1
        );

        return;
      }

      await fetchTasks();
    } catch (error) {
      console.error(
        "DELETE TASK ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete task."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =========================================================
  // DISPLAY HELPERS (presentation only)
  // =========================================================

  const activeFilterCount = [
    status,
    priority,
    dueDateFilter,
  ].filter(Boolean).length;

  // =========================================================
  // UI
  // =========================================================

  return (
    <AppShell>

      {/* =================================================
          PAGE HEADING
      ================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.025em] sm:text-[32px]">
            Tasks
          </h1>

          <p className="mt-1.5 text-sm text-[#A1A7B3]">
            Manage everything you're working on.
          </p>
        </div>

        {/* Create Task */}

        <Button
          icon={Plus}
          onClick={() =>
            setShowCreateModal(true)
          }
          className="w-full sm:w-auto"
        >
          New Task
        </Button>
      </div>

      {/* =================================================
          TOOLBAR
      ================================================== */}

      <div className="mb-5 rounded-xl border border-[#252A33] bg-[#16191F] p-3">

        <div className="flex flex-wrap items-center gap-2.5">

          {/* Search */}

          <div className="min-w-0 flex-1 basis-56">
            <Input
              type="text"
              icon={Search}
              aria-label="Search tasks"
              value={search}
              onChange={(e) =>
                handleSearchChange(
                  e.target.value
                )
              }
              placeholder="Search tasks..."
            />
          </div>

          {/* Mobile filter toggle */}

          <button
            type="button"
            onClick={() =>
              setFiltersOpen((open) => !open)
            }
            aria-expanded={filtersOpen}
            aria-controls="task-filters"
            className={`inline-flex h-11 items-center gap-2 rounded-lg border px-3.5 text-sm font-medium transition-colors duration-150 ease-out md:hidden ${focusRing} ${
              filtersOpen || activeFilterCount > 0
                ? "border-[#7C3AED]/40 bg-[#7C3AED]/10 text-[#F5F7FA]"
                : "border-[#252A33] bg-[#111318] text-[#A1A7B3]"
            }`}
          >
            <SlidersHorizontal
              size={16}
              aria-hidden="true"
            />

            Filters

            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#7C3AED] px-1.5 text-[11px] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Filters + Sort */}

          <div
            id="task-filters"
            className={`${
              filtersOpen ? "grid" : "hidden"
            } w-full grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 md:flex md:w-auto md:flex-wrap md:items-center`}
          >

            {/* Status */}

            <div className="md:w-36">
              <Select
                aria-label="Filter by status"
                value={status}
                onChange={(e) =>
                  handleStatusChange(
                    e.target.value
                  )
                }
              >
                <option value="">
                  All Status
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>
              </Select>
            </div>

            {/* Priority */}

            <div className="md:w-36">
              <Select
                aria-label="Filter by priority"
                value={priority}
                onChange={(e) =>
                  handlePriorityChange(
                    e.target.value
                  )
                }
              >
                <option value="">
                  All Priority
                </option>

                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>
              </Select>
            </div>

            {/* Due Date */}

            <div className="md:w-40">
              <Select
                aria-label="Filter by due date"
                value={dueDateFilter}
                onChange={(e) =>
                  handleDueDateChange(
                    e.target.value
                  )
                }
              >
                <option value="">
                  All Due Dates
                </option>

                <option value="today">
                  Today
                </option>

                <option value="upcoming">
                  Upcoming
                </option>

                <option value="overdue">
                  Overdue
                </option>

                <option value="no-date">
                  No Due Date
                </option>
              </Select>
            </div>

            {/* Sort */}

            <div className="md:w-44">
              <Select
                aria-label="Sort tasks"
                value={getCurrentSort()}
                onChange={(e) =>
                  handleSortChange(
                    e.target.value
                  )
                }
              >
                <option value="newest">
                  Newest
                </option>

                <option value="oldest">
                  Oldest
                </option>

                <option value="title-az">
                  Title A-Z
                </option>

                <option value="title-za">
                  Title Z-A
                </option>

                <option value="due-earliest">
                  Due Date Earliest
                </option>

                <option value="due-latest">
                  Due Date Latest
                </option>
              </Select>
            </div>

            {/* Clear Filters */}

            {hasActiveFilters && (
              <Button
                variant="ghost"
                icon={X}
                onClick={clearFilters}
                className="min-[480px]:col-span-2 md:col-auto"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          TASK CONTENT
      ================================================== */}

      {loading && <TaskSkeleton rows={5} />}

      {!loading && error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-[#EF4444]/25 bg-[#EF4444]/[0.05] p-4"
        >
          <p className="text-sm text-[#F87171]">
            {error}
          </p>
        </div>
      )}

      {!loading && (
        <>
          {/* Task Count */}

          <div className="mb-3 flex items-center justify-between">

            <p className="text-sm text-[#A1A7B3]">
              {totalTasks === 0
                ? "No tasks found"
                : `${totalTasks} ${
                    totalTasks === 1
                      ? "task"
                      : "tasks"
                  }`}
            </p>

            {totalTasks > 0 && (
              <p className="text-xs text-[#6B7280]">
                Showing {count} on this page
              </p>
            )}
          </div>

          {/* Task List */}

          <TaskList
            tasks={tasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            filtered={Boolean(hasActiveFilters)}
          />

          {/* Pagination */}

          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-5 flex items-center justify-between gap-3"
            >

              <p className="text-xs text-[#A1A7B3]">
                Page {page} of {totalPages}
              </p>

              <div className="flex items-center gap-2">

                {/* Previous */}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={!canGoPrevious}
                  aria-label="Previous page"
                  className="min-w-9 max-sm:px-0 max-sm:w-9"
                >
                  <ChevronLeft
                    size={15}
                    aria-hidden="true"
                  />

                  <span className="max-sm:hidden">
                    Previous
                  </span>
                </Button>

                {/* Current Page */}

                <div
                  aria-current="page"
                  className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#7C3AED]/10 px-2 text-xs font-medium text-[#C4B5FD] ring-1 ring-inset ring-[#7C3AED]/30"
                >
                  {page}
                </div>

                {/* Next */}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!canGoNext}
                  aria-label="Next page"
                  className="min-w-9 max-sm:px-0 max-sm:w-9"
                >
                  <span className="max-sm:hidden">
                    Next
                  </span>

                  <ChevronRight
                    size={15}
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </nav>
          )}
        </>
      )}

      {/* =====================================================
          CREATE MODAL
      ====================================================== */}

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() =>
          setShowCreateModal(false)
        }
        onTaskCreated={
          handleTaskCreated
        }
      />

      {/* =====================================================
          EDIT MODAL
      ====================================================== */}

      <EditTaskModal
        isOpen={showEditModal}
        task={selectedTask}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTask(null);
        }}
        onTaskUpdated={
          handleTaskUpdated
        }
      />

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}

      <DeleteTaskModal
        isOpen={showDeleteModal}
        task={selectedTask}
        deleteLoading={deleteLoading}
        onClose={() => {
          if (deleteLoading) return;

          setShowDeleteModal(false);
          setSelectedTask(null);
        }}
        onConfirm={handleConfirmDelete}
      />

    </AppShell>
  );
}

export default Tasks;