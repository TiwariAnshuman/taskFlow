const tones = {
  neutral: "border-[#A1A7B3]/20 bg-[#A1A7B3]/10 text-[#A1A7B3]",
  purple: "border-[#7C3AED]/30 bg-[#7C3AED]/10 text-[#A78BFA]",
  green: "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#4ADE80]",
  red: "border-[#EF4444]/25 bg-[#EF4444]/10 text-[#F87171]",
  amber: "border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#FBBF24]",
  blue: "border-[#3B82F6]/25 bg-[#3B82F6]/10 text-[#60A5FA]",
};

const dots = {
  neutral: "bg-[#A1A7B3]",
  purple: "bg-[#A78BFA]",
  green: "bg-[#4ADE80]",
  red: "bg-[#F87171]",
  amber: "bg-[#FBBF24]",
  blue: "bg-[#60A5FA]",
};

export function Badge({ tone = "neutral", dot = false, children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${dots[tone]}`}
        />
      )}
      {children}
    </span>
  );
}

const statusMap = {
  pending: { label: "Pending", tone: "neutral" },
  "in-progress": { label: "In Progress", tone: "purple" },
  completed: { label: "Completed", tone: "green" },
};

const priorityMap = {
  high: { label: "High", tone: "red" },
  medium: { label: "Medium", tone: "amber" },
  low: { label: "Low", tone: "blue" },
};

export function StatusBadge({ status }) {
  const item = statusMap[status] || { label: status || "—", tone: "neutral" };
  return (
    <Badge tone={item.tone} dot>
      {item.label}
    </Badge>
  );
}

export function PriorityBadge({ priority }) {
  const item = priorityMap[priority] || { label: priority || "—", tone: "neutral" };
  return <Badge tone={item.tone}>{item.label}</Badge>;
}

export default Badge;