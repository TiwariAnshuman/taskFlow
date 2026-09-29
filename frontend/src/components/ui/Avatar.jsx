export function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const sizes = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

function Avatar({ name, size = "md", className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/15 font-medium text-[#C4B5FD] ${sizes[size]} ${className}`}
    >
      {getInitials(name)}
    </span>
  );
}

export default Avatar;