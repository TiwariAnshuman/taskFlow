import { Check } from "lucide-react";

function Logo({ size = "md", className = "" }) {
  const box = size === "lg" ? "h-8 w-8 rounded-lg" : "h-7 w-7 rounded-[7px]";
  const text = size === "lg" ? "text-xl" : "text-[17px]";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className={`flex items-center justify-center bg-[#7C3AED] text-white ${box}`}
      >
        <Check size={size === "lg" ? 18 : 16} strokeWidth={3} />
      </span>

      <span className={`${text} font-semibold tracking-[-0.02em] text-[#F5F7FA]`}>
        TaskFlow
      </span>
    </span>
  );
}

export default Logo;