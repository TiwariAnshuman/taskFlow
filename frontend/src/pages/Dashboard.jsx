
import { useEffect, useState } from "react";

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  X,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

import TaskList from "../components/tasks/TaskList";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import EditTaskModal from "../components/tasks/EditTaskModal";
import DeleteTaskModal from "../components/tasks/DeleteTaskModal";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Dashboard() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);

  // Search and filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");

  // Sorting
  const [sort, setSort] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalTasks: 0,
    count: 0,
  });

  const [loadingTasks, setLoadingTasks] = useState(true);
  const [taskError, setTaskError] = useState("");

  // Create task modal
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  // Edit task modal
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Delete task modal
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
  const [selectedDeleteTask, setSelectedDeleteTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // --------------------------------------------------
  // FETCH TASKS
  // --------------------------------------------------

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      setTaskError("");

      const response = await api.get("/tasks", {
        params: {
          search: search || undefined,
          status: status || undefined,
          priority: priority || undefined,

          // Sorting
          sort,
          sortOrder,

          // Pagination
          page: pagination.page,
          limit: pagination.limit,
        },
      });

      console.log("TASKS RESPONSE:", response.data);

      const taskData = response.data.data;

      setTasks(taskData.tasks);

      setPagination((prev) => ({
        ...prev,
        page: taskData.page,
        limit: taskData.limit,
        totalTasks: taskData.totalTasks,
        count: taskData.count,
      }));
    } catch (error) {
      console.error(
        "FETCH TASKS ERROR:",
        error.response?.data || error.message
      );

      setTaskError(
        error.response?.data?.message ||
          "Failed to load tasks."
      );
    } finally {
      setLoadingTasks(false);
    }
  };

  // --------------------------------------------------
  // FETCH WHEN FILTER / SORT / PAGE CHANGES
  // --------------------------------------------------

  useEffect(() => {
    fetchTasks();
  }, [
    pagination.page,
    search,
    status,
    priority,
    sort,
    sortOrder,
  ]);

  // --------------------------------------------------
  // DUE DATE FILTER
  // --------------------------------------------------

  const filteredTasks = tasks.filter((task) => {
    if (!dueDateFilter) {
      return true;
    }

    const hasDueDate = Boolean(task.dueDate);

    const isOverdue =
      hasDueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "completed";

    if (dueDateFilter === "has-due-date") {
      return hasDueDate;
    }

    if (dueDateFilter === "no-due-date") {
      return !hasDueDate;
    }

    if (dueDateFilter === "overdue") {
      return isOverdue;
    }

    return true;
  });

  // --------------------------------------------------
  // DASHBOARD STATS
  // --------------------------------------------------

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;

    return (
      new Date(task.dueDate) < new Date() &&
      task.status !== "completed"
    );
  }).length;

  // --------------------------------------------------
  // PAGINATION CALCULATIONS
  // --------------------------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(
      pagination.totalTasks / pagination.limit
    )
  );

  const isFirstPage = pagination.page === 1;
  const isLastPage =
    pagination.page >= totalPages;

  const startTask =
    pagination.totalTasks === 0
      ? 0
      : (pagination.page - 1) * pagination.limit + 1;

  const endTask = Math.min(
    pagination.page * pagination.limit,
    pagination.totalTasks
  );

  // --------------------------------------------------
  // PAGINATION HANDLERS
  // --------------------------------------------------

  const handlePreviousPage = () => {
    if (isFirstPage) return;

    setPagination((prev) => ({
      ...prev,
      page: prev.page - 1,
    }));
  };

  const handleNextPage = () => {
    if (isLastPage) return;

    setPagination((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  };

  // --------------------------------------------------
  // RESET TO PAGE 1
  // --------------------------------------------------

  const resetToFirstPage = () => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  // --------------------------------------------------
  // SORTING
  // --------------------------------------------------

  const handleSortChange = (value) => {
    resetToFirstPage();

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

      case "priority-low":
        setSort("priority");
        setSortOrder("asc");
        break;

      case "priority-high":
        setSort("priority");
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
  };

  // Current sort value
  const currentSort =
    sort === "createdAt" && sortOrder === "desc"
      ? "newest"
      : sort === "createdAt" && sortOrder === "asc"
      ? "oldest"
      : sort === "title" && sortOrder === "asc"
      ? "title-az"
      : sort === "title" && sortOrder === "desc"
      ? "title-za"
      : sort === "priority" && sortOrder === "asc"
      ? "priority-low"
      : sort === "priority" && sortOrder === "desc"
      ? "priority-high"
      : sort === "dueDate" && sortOrder === "asc"
      ? "due-earliest"
      : "due-latest";

  // Sort label
  const sortLabel =
    currentSort === "newest"
      ? "Newest"
      : currentSort === "oldest"
      ? "Oldest"
      : currentSort === "title-az"
      ? "Title A-Z"
      : currentSort === "title-za"
      ? "Title Z-A"
      : currentSort === "priority-low"
      ? "Priority Low-High"
      : currentSort === "priority-high"
      ? "Priority High-Low"
      : currentSort === "due-earliest"
      ? "Due Date Earliest"
      : "Due Date Latest";

  // --------------------------------------------------
  // ACTIVE FILTERS
  // --------------------------------------------------

  const hasActiveFilters =
    search ||
    status ||
    priority ||
    dueDateFilter ||
    sort !== "createdAt" ||
    sortOrder !== "desc";

  // --------------------------------------------------
  // CLEAR FILTERS
  // --------------------------------------------------

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setDueDateFilter("");

    setSort("createdAt");
    setSortOrder("desc");

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const handleSearchChange = (value) => {
    setSearch(value);
    resetToFirstPage();
  };

  // --------------------------------------------------
  // STATUS
  // --------------------------------------------------

  const handleStatusChange = (value) => {
    setStatus(value);
    resetToFirstPage();
  };

  // --------------------------------------------------
  // PRIORITY
  // --------------------------------------------------

  const handlePriorityChange = (value) => {
    setPriority(value);
    resetToFirstPage();
  };

  // --------------------------------------------------
  // DUE DATE
  // --------------------------------------------------

  const handleDueDateChange = (value) => {
    setDueDateFilter(value);
    resetToFirstPage();
  };

  // --------------------------------------------------
  // CREATE TASK
  // --------------------------------------------------

  const handleTaskCreated = () => {
    fetchTasks();
  };

  // --------------------------------------------------
  // EDIT TASK
  // --------------------------------------------------

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditTaskOpen(true);
  };

  const handleEditClose = () => {
    setIsEditTaskOpen(false);
    setSelectedTask(null);
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    handleEditClose();
  };

  // --------------------------------------------------
  // DELETE TASK
  // --------------------------------------------------

  const handleDeleteTask = (task) => {
    console.log("DELETE TASK SELECTED:", task);

    setSelectedDeleteTask(task);
    setDeleteError("");
    setIsDeleteTaskOpen(true);
  };

  const handleDeleteClose = () => {
    if (deletingTask) return;

    setIsDeleteTaskOpen(false);
    setSelectedDeleteTask(null);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteTask) return;

    try {
      setDeletingTask(true);
      setDeleteError("");

      console.log(
        "DELETING TASK:",
        selectedDeleteTask._id
      );

      const response = await api.delete(
        `/tasks/${selectedDeleteTask._id}`
      );

      console.log(
        "DELETE TASK RESPONSE:",
        response.data
      );

      await fetchTasks();

      setIsDeleteTaskOpen(false);
      setSelectedDeleteTask(null);
    } catch (error) {
      console.error(
        "DELETE TASK ERROR:",
        error.response?.data || error.message
      );

      setDeleteError(
        error.response?.data?.message ||
          "Failed to delete task."
      );
    } finally {
      setDeletingTask(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="flex min-h-screen bg-[#11100E] text-[#F5F5F4]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Topbar */}
        <Topbar
          onNewTask={() => setIsCreateTaskOpen(true)}
        />

        <main className="flex-1 overflow-auto p-6">

          {/* Page Heading */}
          <div className="mb-7">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#F59E0B]">
              Overview
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#F5F5F4]">
              Good to see you, {user?.name || "there"}.
            </h2>

            <p className="mt-1 text-sm text-[#78716C]">
              {user?.email}
            </p>
          </div>

          {/* Stats */}
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* Total */}
            <div className="group rounded-lg border border-[#302D29] bg-[#191816] p-5 transition-colors hover:border-[#454039]">
              <div className="flex items-start justify-between">
                <p className="text-sm text-[#A8A29E]">
                  Total Tasks
                </p>

                <span className="text-xs text-[#78716C]">
                  All
                </span>
              </div>

              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {pagination.totalTasks}
              </p>
            </div>

            {/* Completed */}
            <div className="group rounded-lg border border-[#302D29] bg-[#191816] p-5 transition-colors hover:border-[#454039]">
              <div className="flex items-start justify-between">
                <p className="text-sm text-[#A8A29E]">
                  Completed
                </p>

                <span className="text-xs text-green-500">
                  Done
                </span>
              </div>

              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {completedTasks}
              </p>
            </div>

            {/* Overdue */}
            <div className="group rounded-lg border border-[#302D29] bg-[#191816] p-5 transition-colors hover:border-[#454039]">
              <div className="flex items-start justify-between">
                <p className="text-sm text-[#A8A29E]">
                  Overdue
                </p>

                <span className="text-xs text-red-400">
                  Attention
                </span>
              </div>

              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {overdueTasks}
              </p>
            </div>

          </section>

          {/* Tasks */}
          <section>

            {/* Task Heading */}
            <div className="mb-4 flex items-end justify-between gap-4">

              <div>
                <h3 className="text-lg font-semibold">
                  Tasks
                </h3>

                <p className="mt-1 text-sm text-[#78716C]">
                  Manage and organize your current work.
                </p>
              </div>

              <span className="hidden text-xs text-[#78716C] sm:block">
                {pagination.totalTasks} total
              </span>

            </div>

            {/* Filter Bar */}
            <div className="mb-5 rounded-xl border border-[#302D29] bg-[#191816] p-3">

              <div className="flex flex-col gap-3">

                {/* Filter Header */}
                <div className="flex items-center justify-between px-1">

                  <div className="flex items-center gap-2">
                    <Filter
                      size={15}
                      className="text-[#F59E0B]"
                    />

                    <span className="text-xs font-medium uppercase tracking-wider text-[#A8A29E]">
                      Filters
                    </span>
                  </div>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[#78716C] transition-colors hover:bg-[#211F1C] hover:text-[#F5F5F4]"
                    >
                      <X size={13} />
                      Clear filters
                    </button>
                  )}

                </div>

                {/* Controls */}
                <div className="flex flex-col gap-2 xl:flex-row">

                  {/* Status */}
                  <div className="relative min-w-0 xl:w-40">
                    <select
                      value={status}
                      onChange={(e) =>
                        handleStatusChange(e.target.value)
                      }
                      className="w-full appearance-none rounded-lg border border-[#302D29] bg-[#11100E] px-3.5 py-2.5 pr-9 text-sm text-[#F5F5F4] outline-none transition-all hover:border-[#454039] focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/20"
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

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C]"
                    />
                  </div>

                  {/* Priority */}
                  <div className="relative min-w-0 xl:w-40">
                    <select
                      value={priority}
                      onChange={(e) =>
                        handlePriorityChange(e.target.value)
                      }
                      className="w-full appearance-none rounded-lg border border-[#302D29] bg-[#11100E] px-3.5 py-2.5 pr-9 text-sm text-[#F5F5F4] outline-none transition-all hover:border-[#454039] focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/20"
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

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C]"
                    />
                  </div>

                  {/* Due Date */}
                  <div className="relative min-w-0 xl:w-44">
                    <select
                      value={dueDateFilter}
                      onChange={(e) =>
                        handleDueDateChange(e.target.value)
                      }
                      className="w-full appearance-none rounded-lg border border-[#302D29] bg-[#11100E] px-3.5 py-2.5 pr-9 text-sm text-[#F5F5F4] outline-none transition-all hover:border-[#454039] focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/20"
                    >
                      <option value="">
                        All Due Dates
                      </option>

                      <option value="has-due-date">
                        Has Due Date
                      </option>

                      <option value="no-due-date">
                        No Due Date
                      </option>

                      <option value="overdue">
                        Overdue
                      </option>
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C]"
                    />
                  </div>

                  {/* Sort */}
                  <div className="relative min-w-0 xl:w-48">
                    <select
                      value={currentSort}
                      onChange={(e) =>
                        handleSortChange(e.target.value)
                      }
                      className="w-full appearance-none rounded-lg border border-[#302D29] bg-[#11100E] px-3.5 py-2.5 pr-9 text-sm text-[#F5F5F4] outline-none transition-all hover:border-[#454039] focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/20"
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

                      <option value="priority-low">
                        Priority Low-High
                      </option>

                      <option value="priority-high">
                        Priority High-Low
                      </option>

                      <option value="due-earliest">
                        Due Date Earliest
                      </option>

                      <option value="due-latest">
                        Due Date Latest
                      </option>
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C]"
                    />
                  </div>

                  {/* Search */}
                  <div className="relative min-w-0 flex-1">

                    <Search
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) =>
                        handleSearchChange(e.target.value)
                      }
                      placeholder="Search tasks..."
                      className="w-full rounded-lg border border-[#302D29] bg-[#11100E] py-2.5 pl-10 pr-16 text-sm text-[#F5F5F4] outline-none placeholder:text-[#57534E] transition-all hover:border-[#454039] focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/20"
                    />

                    {search && (
                      <button
                        type="button"
                        onClick={() =>
                          handleSearchChange("")
                        }
                        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md px-1.5 py-1 text-xs text-[#78716C] transition-colors hover:bg-[#211F1C] hover:text-[#F5F5F4]"
                      >
                        <X size={13} />
                        Clear
                      </button>
                    )}

                  </div>

                </div>

                {/* Filter Summary */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#302D29] px-1 pt-3">

                  <div className="flex items-center gap-2 text-xs text-[#78716C]">
                    <CalendarDays size={14} />

                    <span>
                      Showing{" "}
                      <span className="font-medium text-[#A8A29E]">
                        {filteredTasks.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-[#A8A29E]">
                        {pagination.totalTasks}
                      </span>{" "}
                      tasks
                    </span>
                  </div>

                  <span className="text-xs text-[#57534E]">
                    Sorted by{" "}
                    <span className="text-[#78716C]">
                      {sortLabel}
                    </span>
                  </span>

                </div>

              </div>
            </div>

            {/* Loading */}
            {loadingTasks && (
              <div className="flex min-h-56 items-center justify-center rounded-lg border border-[#302D29] bg-[#191816]">
                <div className="text-center">

                  <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-[#302D29] border-t-[#F59E0B]" />

                  <p className="text-sm text-[#A8A29E]">
                    Loading tasks...
                  </p>

                </div>
              </div>
            )}

            {/* Error */}
            {!loadingTasks && taskError && (
              <div className="flex min-h-56 items-center justify-center rounded-lg border border-red-900/50 bg-red-950/20">
                <div className="text-center">

                  <p className="text-sm font-medium text-red-400">
                    Unable to load tasks
                  </p>

                  <p className="mt-1 text-xs text-red-400/70">
                    {taskError}
                  </p>

                </div>
              </div>
            )}

            {/* Task List */}
            {!loadingTasks && !taskError && (
              <TaskList
                tasks={filteredTasks}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {/* Pagination */}
            {!loadingTasks &&
              !taskError &&
              pagination.totalTasks > 0 && (
                <div className="mt-4 flex flex-col gap-3 rounded-lg border border-[#302D29] bg-[#191816] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

                  {/* Page Information */}
                  <div className="text-xs text-[#78716C]">
                    Showing{" "}
                    <span className="font-medium text-[#A8A29E]">
                      {startTask}
                    </span>
                    {" – "}
                    <span className="font-medium text-[#A8A29E]">
                      {endTask}
                    </span>
                    {" of "}
                    <span className="font-medium text-[#A8A29E]">
                      {pagination.totalTasks}
                    </span>
                    {" tasks"}
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center gap-2">

                    {/* Previous */}
                    <button
                      type="button"
                      onClick={handlePreviousPage}
                      disabled={isFirstPage || loadingTasks}
                      className="flex items-center gap-1.5 rounded-lg border border-[#302D29] bg-[#211F1C] px-3 py-2 text-xs font-medium text-[#A8A29E] transition-all hover:border-[#454039] hover:bg-[#2A2723] hover:text-[#F5F5F4] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={15} />
                      Previous
                    </button>

                    {/* Page Indicator */}
                    <div className="flex h-9 items-center rounded-lg border border-[#302D29] bg-[#11100E] px-3 text-xs font-medium text-[#F5F5F4]">
                      Page{" "}
                      <span className="mx-1.5 text-[#F59E0B]">
                        {pagination.page}
                      </span>
                      of {totalPages}
                    </div>

                    {/* Next */}
                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={isLastPage || loadingTasks}
                      className="flex items-center gap-1.5 rounded-lg border border-[#302D29] bg-[#211F1C] px-3 py-2 text-xs font-medium text-[#A8A29E] transition-all hover:border-[#454039] hover:bg-[#2A2723] hover:text-[#F5F5F4] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight size={15} />
                    </button>

                  </div>

                </div>
              )}

          </section>

        </main>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onTaskCreated={handleTaskCreated}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditTaskOpen}
        task={selectedTask}
        onClose={handleEditClose}
        onTaskUpdated={handleTaskUpdated}
      />

      {/* Delete Task Modal */}
      <DeleteTaskModal
        isOpen={isDeleteTaskOpen}
        task={selectedDeleteTask}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        deleting={deletingTask}
        error={deleteError}
      />

    </div>
  );
}

export default Dashboard;
