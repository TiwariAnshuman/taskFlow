import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Circle,
  CircleDot,
  Feather,
  LayoutDashboard,
  ListChecks,
  ListTodo,
  Menu,
  MonitorSmartphone,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  X,
  Zap,
  CheckSquare,
} from "lucide-react";

import Logo from "../components/ui/Logo";
import Avatar from "../components/ui/Avatar";
import { StatusBadge, PriorityBadge } from "../components/ui/Badge";
import { focusRing } from "../components/ui/Button";

// ---------------------------------------------------------
// Content
// ---------------------------------------------------------

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Security", href: "#security" },
];

const benefits = [
  { icon: Feather, label: "Simple" },
  { icon: Zap, label: "Fast" },
  { icon: ShieldCheck, label: "Secure" },
  { icon: ListChecks, label: "Organized" },
];

const features = [
  {
    icon: ListTodo,
    title: "Task Management",
    text: "Organize work without unnecessary complexity.",
  },
  {
    icon: SlidersHorizontal,
    title: "Smart Filtering",
    text: "Find exactly what needs your attention.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    text: "Understand what is completed and what remains.",
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "Secure Authentication",
    text: "Keep your workspace protected.",
  },
  {
    icon: MonitorSmartphone,
    title: "Responsive Workspace",
    text: "Work comfortably across desktop, tablet, and mobile.",
  },
  {
    icon: Target,
    title: "Clean Productivity",
    text: "A distraction-free interface designed for focus.",
  },
];

const steps = [
  { title: "Create", text: "Capture a task in seconds with a title, priority, and due date." },
  { title: "Organize", text: "Filter, search, and sort to see what matters right now." },
  { title: "Execute", text: "Move work to in progress and keep your focus on one thing." },
  { title: "Complete", text: "Mark it done and watch your progress add up." },
];

const previewTasks = [
  { title: "Ship onboarding flow", desc: "Finalize copy and empty states", status: "in-progress", priority: "high", due: "Oct 3" },
  { title: "Review pull requests", desc: "Two open from the design team", status: "pending", priority: "medium", due: "Oct 4" },
  { title: "Write release notes", desc: "Summarize changes for v1.2", status: "pending", priority: "low", due: "Oct 8" },
  { title: "Fix login redirect", desc: "Send users back to their last page", status: "completed", priority: "high", due: "Sep 28" },
  { title: "Update API docs", desc: "Document the new filter params", status: "completed", priority: "medium", due: "Sep 26" },
];

const previewStats = [
  { label: "Total", value: "24", tone: "text-[#A1A7B3]", icon: ListTodo },
  { label: "Completed", value: "14", tone: "text-[#4ADE80]", icon: CheckCircle2 },
  { label: "In Progress", value: "7", tone: "text-[#A78BFA]", icon: CircleDot },
  { label: "Overdue", value: "2", tone: "text-[#F87171]", icon: Circle },
];

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Security", href: "#security" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "GitHub", href: "https://github.com" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", to: "/login" },
      { label: "Register", to: "/register" },
    ],
  },
];

// ---------------------------------------------------------
// Shared bits
// ---------------------------------------------------------

const primaryLink =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-5 text-sm font-medium text-white transition-colors duration-150 ease-out hover:bg-[#6D28D9]";

const secondaryLink =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#252A33] bg-[#16191F] px-5 text-sm font-medium text-[#F5F7FA] transition-colors duration-150 ease-out hover:border-[#323845] hover:bg-[#1B1F27]";

function SectionHeading({ title, text }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
        {title}
      </h2>

      {text && (
        <p className="mt-3 text-[15px] leading-relaxed text-[#A1A7B3]">
          {text}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------
// Stylized product preview (uses the real UI language)
// ---------------------------------------------------------

function AppPreview({ full = false }) {
  const rows = full ? previewTasks : previewTasks.slice(0, 3);

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-[14px] border border-[#252A33] bg-[#0B0D10] text-left shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
    >
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-48 shrink-0 flex-col border-r border-[#252A33] md:flex">
          <div className="px-4 py-4">
            <Logo />
          </div>

          <div className="space-y-0.5 px-2.5">
            {[
              { label: "Dashboard", icon: LayoutDashboard, active: true },
              { label: "Tasks", icon: CheckSquare },
              { label: "Settings", icon: Settings },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium ${
                  item.active
                    ? "bg-[#7C3AED]/10 text-[#F5F7FA]"
                    : "text-[#A1A7B3]"
                }`}
              >
                <item.icon
                  size={15}
                  className={item.active ? "text-[#A78BFA]" : "text-[#6B7280]"}
                />
                {item.label}
              </div>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-2.5 border-t border-[#252A33] p-3.5">
            <Avatar name="Alex Morgan" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">Alex Morgan</p>
              <p className="truncate text-[11px] text-[#6B7280]">alex@example.com</p>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <p className="text-lg font-semibold tracking-[-0.02em]">
            Good morning, Alex
          </p>

          <p className="mt-0.5 text-xs text-[#A1A7B3]">
            Here's what's happening with your tasks.
          </p>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {previewStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-[#252A33] bg-[#16191F] p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#A1A7B3]">{stat.label}</span>
                  <stat.icon size={13} className={stat.tone} />
                </div>
                <p className="mt-2 text-xl font-semibold leading-none">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Progress */}
          {full && (
            <div className="mt-2.5 rounded-lg border border-[#252A33] bg-[#16191F] p-3">
              <div className="flex items-center justify-between text-[11px] text-[#A1A7B3]">
                <span>Overall progress</span>
                <span className="font-medium text-[#F5F7FA]">58%</span>
              </div>
              <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-[#111318]">
                <div className="w-[58%] bg-[#22C55E]" />
                <div className="w-[29%] bg-[#7C3AED]" />
              </div>
            </div>
          )}

          {/* Filters */}
          {full && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["All", "Pending", "In Progress", "Completed"].map((chip, i) => (
                <span
                  key={chip}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                    i === 0
                      ? "border-[#7C3AED]/40 bg-[#7C3AED]/10 text-[#C4B5FD]"
                      : "border-[#252A33] text-[#A1A7B3]"
                  }`}
                >
                  {chip}
                </span>
              ))}
            </div>
          )}

          {/* Rows */}
          <div className="mt-4 divide-y divide-[#252A33] overflow-hidden rounded-lg border border-[#252A33] bg-[#16191F]">
            {rows.map((task) => {
              const done = task.status === "completed";

              return (
                <div key={task.title} className="flex items-center gap-3 px-3 py-2.5">
                  {done ? (
                    <CheckCircle2 size={15} className="shrink-0 text-[#22C55E]" />
                  ) : task.status === "in-progress" ? (
                    <CircleDot size={15} className="shrink-0 text-[#A78BFA]" />
                  ) : (
                    <Circle size={15} className="shrink-0 text-[#6B7280]" />
                  )}

                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-[13px] font-medium ${
                        done ? "text-[#6B7280] line-through" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="hidden truncate text-[11px] text-[#A1A7B3] sm:block">
                      {task.desc}
                    </p>
                  </div>

                  <div className="hidden items-center gap-2 sm:flex">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>

                  <span className="hidden w-12 text-right text-[11px] text-[#A1A7B3] lg:block">
                    {task.due}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Page
// ---------------------------------------------------------

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F7FA]">

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-[#252A33] bg-[#0B0D10]/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            aria-label="TaskFlow home"
            className={`rounded-md ${focusRing}`}
          >
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`rounded text-sm text-[#A1A7B3] transition-colors duration-150 hover:text-[#F5F7FA] ${focusRing}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/login"
              className={`inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium text-[#A1A7B3] transition-colors duration-150 hover:bg-[#16191F] hover:text-[#F5F7FA] ${focusRing}`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className={`inline-flex h-9 items-center rounded-lg bg-[#7C3AED] px-3.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#6D28D9] ${focusRing}`}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-menu"
            className={`-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#A1A7B3] transition-colors hover:bg-[#16191F] hover:text-[#F5F7FA] md:hidden ${focusRing}`}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div
            id="landing-mobile-menu"
            className="tf-fade-in border-t border-[#252A33] bg-[#0B0D10] px-4 pb-4 pt-2 md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex h-11 items-center rounded-lg px-3 text-sm text-[#A1A7B3] hover:bg-[#16191F] hover:text-[#F5F7FA]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link to="/login" className={secondaryLink}>
                Login
              </Link>
              <Link to="/register" className={primaryLink}>
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-80 w-[46rem] max-w-full -translate-x-1/2 rounded-full bg-[#7C3AED]/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8">
            <div className="tf-fade-in mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-[56px]">
                Turn scattered tasks into focused progress.
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#A1A7B3] sm:text-lg">
                A simple, powerful workspace for organizing your tasks,
                tracking progress, and staying focused on what matters.
              </p>

              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link to="/register" className={`${primaryLink} ${focusRing}`}>
                  Get Started
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>

                <Link to="/dashboard" className={`${secondaryLink} ${focusRing}`}>
                  View Dashboard
                </Link>
              </div>
            </div>

            {/* Product preview */}
            <div className="relative mx-auto mt-14 max-w-5xl sm:mt-16">
              <AppPreview />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B0D10] to-transparent"
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            VALUE STRIP
        ====================================================== */}

        <section className="border-y border-[#252A33] bg-[#111318]">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
            <p className="text-sm font-medium text-[#A1A7B3]">
              Built for focused work.
            </p>

            <ul className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4 md:w-auto md:gap-10">
              {benefits.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2.5 text-sm font-medium"
                >
                  <item.icon
                    size={17}
                    aria-hidden="true"
                    className="text-[#A78BFA]"
                  />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* =====================================================
            FEATURES
        ====================================================== */}

        <section
          id="features"
          className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
        >
          <SectionHeading
            title="Everything you need, nothing you don't"
            text="TaskFlow keeps the essentials close so you can spend less time managing tasks and more time finishing them."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                id={feature.id}
                className="scroll-mt-24 rounded-xl border border-[#252A33] bg-[#16191F] p-5 transition-colors duration-150 ease-out hover:border-[#323845] sm:p-6"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#252A33] bg-[#111318] text-[#A78BFA]">
                  <feature.icon size={17} aria-hidden="true" />
                </span>

                <h3 className="mt-4 text-base font-semibold tracking-[-0.01em]">
                  {feature.title}
                </h3>

                <p className="mt-1.5 text-sm leading-relaxed text-[#A1A7B3]">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            WORKFLOW
        ====================================================== */}

        <section
          id="workflow"
          className="scroll-mt-16 border-y border-[#252A33] bg-[#111318]"
        >
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <SectionHeading
              title="A workflow that stays out of your way"
              text="From first idea to finished work in four steps."
            />

            <ol className="mt-14 grid gap-2 md:grid-cols-4 md:gap-6">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-4 md:block">
                  <div className="flex flex-col items-center md:flex-row">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/10 text-sm font-medium text-[#C4B5FD]">
                      {index + 1}
                    </span>

                    {index < steps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="my-2 min-h-6 w-px flex-1 bg-[#252A33] md:mx-3 md:my-0 md:h-px md:min-h-0 md:w-auto"
                      />
                    )}
                  </div>

                  <div className="pb-6 md:mt-5 md:pb-0">
                    <h3 className="text-base font-semibold tracking-[-0.01em]">
                      {step.title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-relaxed text-[#A1A7B3]">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* =====================================================
            PRODUCT PREVIEW
        ====================================================== */}

        <section
          id="preview"
          className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
        >
          <SectionHeading
            title="Your work, at a glance"
            text="Statistics, filters, and task rows in one calm workspace."
          />

          <div className="mx-auto mt-12 max-w-5xl">
            <AppPreview full />
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
          <div className="relative overflow-hidden rounded-[14px] border border-[#252A33] bg-[#16191F] px-6 py-14 text-center sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 h-48 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-[#7C3AED]/10 blur-3xl"
            />

            <div className="relative">
              <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
                Ready to get your work under control?
              </h2>

              <div className="mt-8 flex justify-center">
                <Link to="/register" className={`${primaryLink} ${focusRing}`}>
                  Start using TaskFlow
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-[#252A33] bg-[#0B0D10]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo />
              <p className="mt-3 max-w-xs text-sm text-[#A1A7B3]">
                A calm workspace for focused work.
              </p>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-medium">{column.title}</h3>

                <ul className="mt-3 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.to ? (
                        <Link
                          to={link.to}
                          className="rounded text-sm text-[#A1A7B3] transition-colors duration-150 hover:text-[#F5F7FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/50"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="rounded text-sm text-[#A1A7B3] transition-colors duration-150 hover:text-[#F5F7FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/50"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-12 border-t border-[#252A33] pt-6 text-xs text-[#6B7280]">
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;