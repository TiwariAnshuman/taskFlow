import { useEffect, useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ListTodo,
  Plus,
  AlertCircle,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

import TaskList from "../components/tasks/TaskList";
import CreateTaskModal from "../components/tasks/CreateTaskModal";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Dashboard() {
  const { user } = useAuth();

  // --------------------------------------------------
  // DASHBOARD TASKS
  // --------------------------------------------------

  const [tasks, setTasks] = useState([]);

  const [loadingTasks, setLoadingTasks] = useState(true);
  const [taskError, setTaskError] = useState("");

  // --------------------------------------------------
  // DASHBOARD STATS
  // --------------------------------------------------

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    overdue: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  // --------------------------------------------------
  // CREATE TASK MODAL
  // --------------------------------------------------

  const [isCreateTaskOpen, setIsCreateTaskOpen] =
    useState(false);

  // --------------------------------------------------
  // FETCH RECENT TASKS
  // --------------------------------------------------

  const fetchRecentTasks = async () => {
    try {
      setLoadingTasks(true);
      setTaskError("");

      const response = await api.get("/tasks", {
        params: {
          sort: "createdAt",
          sortOrder: "desc",
          page: 1,
          limit: 5,
        },
      });

      console.log(
        "DASHBOARD TASKS RESPONSE:",
        response.data
      );

      const taskData = response.data.data;

      setTasks(taskData.tasks || []);
    } catch (error) {
      console.error(
        "FETCH DASHBOARD TASKS ERROR:",
        error.response?.data || error.message
      );

      setTaskError(
        error.response?.data?.message ||
          "Failed to load recent tasks."
      );
    } finally {
      setLoadingTasks(false);
    }
  };

  // --------------------------------------------------
  // FETCH DASHBOARD STATS
  // --------------------------------------------------

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      setStatsError("");

      const response = await api.get("/tasks/stats");

      console.log(
        "DASHBOARD STATS RESPONSE:",
        response.data
      );

      setStats(response.data.data);
    } catch (error) {
      console.error(
        "FETCH DASHBOARD STATS ERROR:",
        error.response?.data || error.message
      );

      setStatsError(
        error.response?.data?.message ||
          "Failed to load dashboard stats."
      );
    } finally {
      setLoadingStats(false);
    }
  };

  // --------------------------------------------------
  // INITIAL DASHBOARD LOAD
  // --------------------------------------------------

  useEffect(() => {
    fetchRecentTasks();
    fetchStats();
  }, []);

  // --------------------------------------------------
  // TASK CREATED
  // --------------------------------------------------

  const handleTaskCreated = async () => {
    await fetchRecentTasks();
    await fetchStats();
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
          onNewTask={() =>
            setIsCreateTaskOpen(true)
          }
        />

        <main className="flex-1 overflow-auto p-6">

          {/* --------------------------------------------------
              WELCOME HEADER
          -------------------------------------------------- */}

          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#F59E0B]">
              Overview
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#F5F5F4]">
              Good to see you,{" "}
              {user?.name || "there"}.
            </h1>

            <p className="mt-1 text-sm text-[#78716C]">
              Here's a quick overview of your work.
            </p>
          </div>

          {/* --------------------------------------------------
              STATS
          -------------------------------------------------- */}

          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* Total Tasks */}
            <div className="rounded-lg border border-[#302D29] bg-[#191816] p-5 transition-colors hover:border-[#454039]">
              <div className="flex items-start justify-between">

                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#211F1C] text-[#F59E0B]">
                    <ListTodo size={17} />
                  </div>

                  <p className="text-sm text-[#A8A29E]">
                    Total Tasks
                  </p>
                </div>

                <span className="text-xs text-[#78716C]">
                  All
                </span>

              </div>

              <p className="mt-4 text-3xl font-semibold tracking-tight">
                {loadingStats || statsError
                  ? "—"
                  : stats.total}
              </p>

              <p className="mt-1 text-xs text-[#57534E]">
                Tasks in your workspace
              </p>
            </div>

            {/* Completed */}
            <div className="rounded-lg border border-[#302D29] bg-[#191816] p-5 transition-colors hover:border-[#454039]">
              <div className="flex items-start justify-between">

                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#211F1C] text-green-500">
                    <CheckCircle2 size={17} />
                  </div>

                  <p className="text-sm text-[#A8A29E]">
                    Completed
                  </p>
                </div>

                <span className="text-xs text-green-500">
                  Done
                </span>

              </div>

              <p className="mt-4 text-3xl font-semibold tracking-tight">
                {loadingStats || statsError
                  ? "—"
                  : stats.completed}
              </p>

              <p className="mt-1 text-xs text-[#57534E]">
                Successfully completed
              </p>
            </div>

            {/* Overdue */}
            <div className="rounded-lg border border-[#302D29] bg-[#191816] p-5 transition-colors hover:border-[#454039]">
              <div className="flex items-start justify-between">

                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#211F1C] text-red-400">
                    <AlertCircle size={17} />
                  </div>

                  <p className="text-sm text-[#A8A29E]">
                    Overdue
                  </p>
                </div>

                <span className="text-xs text-red-400">
                  Attention
                </span>

              </div>

              <p className="mt-4 text-3xl font-semibold tracking-tight">
                {loadingStats || statsError
                  ? "—"
                  : stats.overdue}
              </p>

              <p className="mt-1 text-xs text-[#57534E]">
                Require your attention
              </p>
            </div>

          </section>

          {/* --------------------------------------------------
              WORK SUMMARY
          -------------------------------------------------- */}

          <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">

            {/* Pending */}
            <div className="rounded-lg border border-[#302D29] bg-[#191816] p-5">
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#211F1C] text-[#F59E0B]">
                    <Clock3 size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#F5F5F4]">
                      Pending Tasks
                    </p>

                    <p className="mt-0.5 text-xs text-[#78716C]">
                      Tasks waiting to be started
                    </p>
                  </div>

                </div>

                <span className="text-xl font-semibold text-[#F5F5F4]">
                  {loadingStats || statsError
                    ? "—"
                    : stats.pending}
                </span>

              </div>
            </div>

            {/* In Progress */}
            <div className="rounded-lg border border-[#302D29] bg-[#191816] p-5">
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#211F1C] text-[#F59E0B]">
                    <Clock3 size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#F5F5F4]">
                      In Progress
                    </p>

                    <p className="mt-0.5 text-xs text-[#78716C]">
                      Tasks currently being worked on
                    </p>
                  </div>

                </div>

                <span className="text-xl font-semibold text-[#F5F5F4]">
                  {loadingStats || statsError
                    ? "—"
                    : stats.inProgress}
                </span>

              </div>
            </div>

          </section>

          {/* --------------------------------------------------
              RECENT TASKS
          -------------------------------------------------- */}

          <section>

            {/* Section Header */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <h2 className="text-lg font-semibold">
                  Recent Tasks
                </h2>

                <p className="mt-1 text-sm text-[#78716C]">
                  Your latest tasks at a glance.
                </p>
              </div>

              <a
                href="/tasks"
                className="group flex items-center gap-1.5 text-sm font-medium text-[#F59E0B] transition-colors hover:text-[#D97706]"
              >
                View all tasks

                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>

            </div>

            {/* Loading */}
            {loadingTasks && (
              <div className="flex min-h-48 items-center justify-center rounded-lg border border-[#302D29] bg-[#191816]">
                <div className="text-center">

                  <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-[#302D29] border-t-[#F59E0B]" />

                  <p className="text-sm text-[#A8A29E]">
                    Loading recent tasks...
                  </p>

                </div>
              </div>
            )}

            {/* Error */}
            {!loadingTasks && taskError && (
              <div className="flex min-h-48 items-center justify-center rounded-lg border border-red-900/50 bg-red-950/20">
                <div className="text-center">

                  <p className="text-sm font-medium text-red-400">
                    Unable to load recent tasks
                  </p>

                  <p className="mt-1 text-xs text-red-400/70">
                    {taskError}
                  </p>

                </div>
              </div>
            )}

            {/* Empty State */}
            {!loadingTasks &&
              !taskError &&
              tasks.length === 0 && (
                <div className="rounded-lg border border-[#302D29] bg-[#191816] px-6 py-12 text-center">

                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-[#211F1C] text-[#F59E0B]">
                    <ListTodo size={19} />
                  </div>

                  <h3 className="mt-4 text-sm font-medium text-[#F5F5F4]">
                    No tasks yet
                  </h3>

                  <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#78716C]">
                    Create your first task to start organizing your work.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setIsCreateTaskOpen(true)
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-2.5 text-sm font-medium text-[#11100E] transition-colors hover:bg-[#D97706]"
                  >
                    <Plus size={16} />
                    Create Task
                  </button>

                </div>
              )}

            {/* Recent Task List */}
            {!loadingTasks &&
              !taskError &&
              tasks.length > 0 && (
                <TaskList
                  tasks={tasks}
                  showAction={false}
                />
              )}

          </section>

        </main>
      </div>

      {/* --------------------------------------------------
          CREATE TASK MODAL
      -------------------------------------------------- */}

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() =>
          setIsCreateTaskOpen(false)
        }
        onTaskCreated={handleTaskCreated}
      />

    </div>
  );
}

export default Dashboard;