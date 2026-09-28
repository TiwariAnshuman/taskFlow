import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

import TaskList from "../components/tasks/TaskList";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import EditTaskModal from "../components/tasks/EditTaskModal";
import DeleteTaskModal from "../components/tasks/DeleteTaskModal";

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
  // UI
  // =========================================================

  return (
    <div className="flex min-h-screen bg-[#11100E] text-[#F5F5F4]">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar />

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div className="flex min-w-0 flex-1 flex-col">

        <Topbar />

        <main className="flex-1 overflow-auto p-6">

          {/* =================================================
              PAGE HEADING
          ================================================== */}

          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#F59E0B]">
                Workspace
              </p>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#F5F5F4]">
                Tasks
              </h1>

              <p className="mt-1 text-sm text-[#78716C]">
                Manage, organize, and track your tasks.
              </p>
            </div>

            {/* Create Task */}

            <button
              type="button"
              onClick={() =>
                setShowCreateModal(true)
              }
              className="flex items-center justify-center gap-2 rounded-md bg-[#F59E0B] px-4 py-2.5 text-sm font-medium text-[#11100E] transition-colors hover:bg-[#D97706]"
            >
              <Plus size={17} />

              Create Task
            </button>
          </div>

          {/* =================================================
              FILTER TOOLBAR
          ================================================== */}

          <div className="mb-5 rounded-lg border border-[#302D29] bg-[#191816] p-4">

            <div className="mb-4 flex items-center gap-2">

              <SlidersHorizontal
                size={17}
                className="text-[#F59E0B]"
              />

              <h2 className="text-sm font-medium text-[#F5F5F4]">
                Filter Tasks
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">

              {/* Search */}

              <div className="relative">

                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    handleSearchChange(
                      e.target.value
                    )
                  }
                  placeholder="Search tasks..."
                  className="w-full rounded-md border border-[#302D29] bg-[#11100E] py-2.5 pl-9 pr-3 text-sm text-[#F5F5F4] outline-none placeholder:text-[#57534E] focus:border-[#F59E0B]"
                />
              </div>

              {/* Status */}

              <select
                value={status}
                onChange={(e) =>
                  handleStatusChange(
                    e.target.value
                  )
                }
                className="w-full rounded-md border border-[#302D29] bg-[#11100E] px-3 py-2.5 text-sm text-[#A8A29E] outline-none focus:border-[#F59E0B]"
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
              </select>

              {/* Priority */}

              <select
                value={priority}
                onChange={(e) =>
                  handlePriorityChange(
                    e.target.value
                  )
                }
                className="w-full rounded-md border border-[#302D29] bg-[#11100E] px-3 py-2.5 text-sm text-[#A8A29E] outline-none focus:border-[#F59E0B]"
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
              </select>

              {/* Due Date */}

              <select
                value={dueDateFilter}
                onChange={(e) =>
                  handleDueDateChange(
                    e.target.value
                  )
                }
                className="w-full rounded-md border border-[#302D29] bg-[#11100E] px-3 py-2.5 text-sm text-[#A8A29E] outline-none focus:border-[#F59E0B]"
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
              </select>
            </div>

            {/* Sort */}

            <div className="mt-3 flex flex-col gap-3 border-t border-[#302D29] pt-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-2">

                <span className="text-xs text-[#78716C]">
                  Sort by
                </span>

                <select
                  value={getCurrentSort()}
                  onChange={(e) =>
                    handleSortChange(
                      e.target.value
                    )
                  }
                  className="rounded-md border border-[#302D29] bg-[#11100E] px-3 py-2 text-xs text-[#A8A29E] outline-none focus:border-[#F59E0B]"
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
                </select>
              </div>

              {/* Clear Filters */}

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-xs text-[#A8A29E] transition-colors hover:text-[#F59E0B]"
                >
                  <X size={14} />

                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* =================================================
              TASK CONTENT
          ================================================== */}

          {loading && (
            <div className="rounded-lg border border-[#302D29] bg-[#191816] p-6">
              <p className="text-sm text-[#A8A29E]">
                Loading tasks...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="mb-5 rounded-lg border border-red-900/40 bg-[#191816] p-6">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          {!loading && (
            <>
              {/* Task Count */}

              <div className="mb-3 flex items-center justify-between">

                <p className="text-sm text-[#A8A29E]">
                  {totalTasks === 0
                    ? "No tasks found"
                    : `${totalTasks} ${
                        totalTasks === 1
                          ? "task"
                          : "tasks"
                      }`}
                </p>

                {totalTasks > 0 && (
                  <p className="text-xs text-[#57534E]">
                    Showing {count} on this page
                  </p>
                )}
              </div>

              {/* Task List */}

              <TaskList
                tasks={tasks}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />

              {/* Pagination */}

              {totalPages > 1 && (
                <div className="mt-5 flex items-center justify-between border-t border-[#302D29] pt-4">

                  <p className="text-xs text-[#78716C]">
                    Page {page} of {totalPages}
                  </p>

                  <div className="flex items-center gap-2">

                    {/* Previous */}

                    <button
                      type="button"
                      onClick={handlePreviousPage}
                      disabled={!canGoPrevious}
                      className="flex items-center gap-1 rounded-md border border-[#302D29] px-3 py-2 text-xs text-[#A8A29E] transition-colors hover:border-[#F59E0B] hover:text-[#F59E0B] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={15} />

                      Previous
                    </button>

                    {/* Current Page */}

                    <div className="flex h-8 min-w-8 items-center justify-center rounded-md bg-[#F59E0B] px-2 text-xs font-medium text-[#11100E]">
                      {page}
                    </div>

                    {/* Next */}

                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={!canGoNext}
                      className="flex items-center gap-1 rounded-md border border-[#302D29] px-3 py-2 text-xs text-[#A8A29E] transition-colors hover:border-[#F59E0B] hover:text-[#F59E0B] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next

                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

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
        onClose={() => {
          if (deleteLoading) return;

          setShowDeleteModal(false);
          setSelectedTask(null);
        }}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
}

export default Tasks;