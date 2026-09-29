import { AlertCircle, CheckCircle2 } from "lucide-react";

const tones = {
  error: "border-[#EF4444]/25 bg-[#EF4444]/[0.07] text-[#F87171]",
  success: "border-[#22C55E]/25 bg-[#22C55E]/[0.07] text-[#4ADE80]",
};

export function Alert({ tone = "error", children, className = "" }) {
  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[13px] leading-5 ${tones[tone]} ${className}`}
    >
      <Icon size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action, className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-[#252A33] bg-[#16191F]/60 px-6 py-12 text-center ${className}`}
    >
      {Icon && (
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[#252A33] bg-[#1B1F27] text-[#A78BFA]">
          <Icon size={18} aria-hidden="true" />
        </div>
      )}

      <h3 className="text-sm font-medium text-[#F5F7FA]">{title}</h3>

      {description && (
        <p className="mt-1 max-w-sm text-[13px] leading-5 text-[#A1A7B3]">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Spinner({ className = "" }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`h-5 w-5 animate-spin rounded-full border-2 border-[#252A33] border-t-[#7C3AED] ${className}`}
    />
  );
}

export function TaskSkeleton({ rows = 5 }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading tasks"
      className="divide-y divide-[#252A33] overflow-hidden rounded-xl border border-[#252A33] bg-[#16191F]"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-3 px-4 py-4 sm:px-5">
          <div className="h-4 w-4 rounded-full bg-[#252A33]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-[#252A33]" />
            <div className="h-2.5 w-2/3 rounded bg-[#1B1F27]" />
          </div>
          <div className="hidden h-5 w-16 rounded-full bg-[#252A33] md:block" />
          <div className="hidden h-5 w-20 rounded-full bg-[#252A33] md:block" />
        </div>
      ))}
    </div>
  );
}