
const variants = {
  primary:
    "border border-transparent bg-[#7C3AED] text-white hover:bg-[#6D28D9]",

  secondary:
    "border border-[#252A33] bg-[#16191F] text-[#F5F7FA] hover:border-[#323845] hover:bg-[#1B1F27]",

  danger:
    "border border-transparent bg-[#EF4444] text-white hover:bg-[#DC2626]",

  dangerOutline:
    "border border-[#EF4444]/30 bg-transparent text-[#F87171] hover:bg-[#EF4444]/10 hover:text-[#FCA5A5]",

  ghost:
    "border border-transparent bg-transparent text-[#A1A7B3] hover:bg-[#1B1F27] hover:text-[#F5F7FA]",
};

const sizes = {
  sm: "h-9 px-3",
  md: "h-11 px-4 sm:h-10",
  lg: "h-11 px-5",
};

// Exported so other components can reuse the same focus style
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D10]";

function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  type = "button",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`
        inline-flex shrink-0 items-center justify-center gap-2
        rounded-lg text-sm font-medium
        transition-colors duration-150 ease-out
        disabled:cursor-not-allowed disabled:opacity-50
        ${focusRing}
        ${variants[variant] ?? variants.primary}
        ${sizes[size] ?? sizes.md}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={16} aria-hidden="true" />}
      {children}
    </button>
  );
}

export function IconButton({
  icon: Icon,
  label,
  className = "",
  iconSize = 17,
  ...props
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`
        inline-flex h-9 w-9 shrink-0
        items-center justify-center
        rounded-lg text-[#A1A7B3]
        transition-colors duration-150 ease-out
        disabled:cursor-not-allowed disabled:opacity-50
        hover:bg-[#1B1F27] hover:text-[#F5F7FA]
        ${focusRing}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={iconSize} aria-hidden="true" />}
    </button>
  );
}

export default Button;
