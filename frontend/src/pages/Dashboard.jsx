import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  ListChecks,
  ListTodo,
  Plus,
} from "lucide-react";

import AppShell from "../components/layout/AppShell";

import TaskList from "../components/tasks/TaskList";
import CreateTaskModal from "../components/tasks/CreateTaskModal";

import Button from "../components/ui/Button";
import StatCard from "../components/ui/StatCard";
import { EmptyState, TaskSkeleton } from "../components/ui/Feedback";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

// Presentation helper
const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

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
  // DISPLAY HELPERS (presentation only)
  // --------------------------------------------------

  const statsUnavailable = loadingStats || statsError;

  const display = (value) => (statsUnavailable ? "—" : value);

  const percent = (value) =>
    !statsUnavailable && stats.total > 0
      ? Math.min(100, (value / stats.total) * 100)
      : 0;

  const completionRate =
    !statsUnavailable && stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

  const firstName = (user?.name || "").trim().split(" ")[0];

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <AppShell>

      {/* --------------------------------------------------
          PAGE HEADER
      -------------------------------------------------- */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.025em] sm:text-[32px]">
            {getGreeting()}, {firstName || "there"}
          </h1>

          <p className="mt-1.5 text-sm text-[#A1A7B3]">
            Here's what's happening with your tasks.
          </p>
        </div>

        <Button
          icon={Plus}
          onClick={() => setIsCreateTaskOpen(true)}
          className="w-full sm:w-auto"
        >
          New Task
        </Button>
      </div>

      {/* --------------------------------------------------
          STATISTICS
      -------------------------------------------------- */}

      <section
        aria-label="Task statistics"
        className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Total Tasks"
          value={display(stats.total)}
          icon={ListTodo}
          tone="neutral"
          hint="In your workspace"
        />

        <StatCard
          label="Completed"
          value={display(stats.completed)}
          icon={CheckCircle2}
          tone="green"
          hint="Successfully finished"
        />

        <StatCard
          label="In Progress"
          value={display(stats.inProgress)}
          icon={CircleDot}
          tone="purple"
          hint="Currently being worked on"
        />

        <StatCard
          label="Overdue"
          value={display(stats.overdue)}
          icon={AlertCircle}
          tone="red"
          hint="Need your attention"
        />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* --------------------------------------------------
            RECENT TASKS
        -------------------------------------------------- */}

        <section className="min-w-0 lg:col-span-2">

          {/* Section Header */}
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-[-0.01em]">
                Recent Tasks
              </h2>
            </div>

            <Link
              to="/tasks"
              className="group flex items-center gap-1.5 rounded text-sm font-medium text-[#A78BFA] transition-colors duration-150 hover:text-[#C4B5FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/50"
            >
              View all tasks

              <ArrowRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Loading */}
          {loadingTasks && <TaskSkeleton rows={5} />}

          {/* Error */}
          {!loadingTasks && taskError && (
            <div
              role="alert"
              className="flex min-h-48 items-center justify-center rounded-xl border border-[#EF4444]/25 bg-[#EF4444]/[0.05] px-4"
            >
              <div className="text-center">
                <p className="text-sm font-medium text-[#F87171]">
                  Unable to load recent tasks
                </p>

                <p className="mt-1 text-xs text-[#F87171]/70">
                  {taskError}
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loadingTasks &&
            !taskError &&
            tasks.length === 0 && (
              <EmptyState
                icon={ListTodo}
                title="No tasks yet"
                description="Create your first task to start organizing your work."
                action={
                  <Button
                    icon={Plus}
                    onClick={() =>
                      setIsCreateTaskOpen(true)
                    }
                  >
                    Create Task
                  </Button>
                }
              />
            )}

          {/* Recent Task List */}
          {!loadingTasks &&
            !taskError &&
            tasks.length > 0 && (
              <TaskList
                tasks={tasks}
                showActions={false}
              />
            )}
        </section>

        {/* --------------------------------------------------
            SIDE PANEL: PROGRESS + QUICK ACTIONS
        -------------------------------------------------- */}

        <aside className="min-w-0 space-y-6">

          {/* Progress */}
          <section className="rounded-xl border border-[#252A33] bg-[#16191F] p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-medium">Progress</h2>

              <span className="text-2xl font-semibold tracking-[-0.02em]">
                {statsUnavailable ? "—" : `${completionRate}%`}
              </span>
            </div>

            <div
              role="progressbar"
              aria-label="Tasks completed"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={completionRate}
              className="mt-4 flex h-2 overflow-hidden rounded-full bg-[#111318]"
            >
              <div
                className="h-full bg-[#22C55E] transition-[width] duration-500 ease-out"
                style={{ width: `${percent(stats.completed)}%` }}
              />
              <div
                className="h-full bg-[#7C3AED] transition-[width] duration-500 ease-out"
                style={{ width: `${percent(stats.inProgress)}%` }}
              />
            </div>

            <dl className="mt-4 space-y-2.5 text-[13px]">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-[#A1A7B3]">
                  <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                  Completed
                </dt>
                <dd className="font-medium">{display(stats.completed)}</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-[#A1A7B3]">
                  <span className="h-2 w-2 rounded-full bg-[#7C3AED]" />
                  In Progress
                </dt>
                <dd className="font-medium">{display(stats.inProgress)}</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-[#A1A7B3]">
                  <span className="h-2 w-2 rounded-full bg-[#6B7280]" />
                  Pending
                </dt>
                <dd className="font-medium">{display(stats.pending)}</dd>
              </div>
            </dl>
          </section>

          {/* Quick actions */}
          <section className="rounded-xl border border-[#252A33] bg-[#16191F] p-5">
            <h2 className="text-sm font-medium">Quick actions</h2>

            <div className="mt-3 flex flex-col gap-2">
              <Button
                variant="secondary"
                icon={Plus}
                onClick={() => setIsCreateTaskOpen(true)}
                className="justify-start"
              >
                Create Task
              </Button>

              <Link
                to="/tasks"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#252A33] bg-[#16191F] px-4 text-sm font-medium text-[#F5F7FA] transition-colors duration-150 ease-out hover:border-[#323845] hover:bg-[#1B1F27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/50 sm:h-10"
              >
                <ListChecks size={16} aria-hidden="true" />
                View All Tasks
              </Link>
            </div>
          </section>
        </aside>
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

    </AppShell>
  );
}

export default Dashboard;