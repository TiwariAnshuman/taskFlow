import { ChevronDown } from "lucide-react";

const base =
  "w-full rounded-lg border bg-[#111318] text-sm text-[#F5F7FA] outline-none transition-colors duration-150 ease-out placeholder:text-[#6B7280] focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60";

const tone = (error) =>
  error
    ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20"
    : "border-[#252A33] hover:border-[#323845] focus:border-[#7C3AED] focus:ring-[#7C3AED]/25";

export function Field({ label, htmlFor, hint, error, children, className = "" }) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="mb-1.5 block text-[13px] font-medium text-[#F5F7FA]"
        >
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-[#F87171]">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-[#6B7280]">{hint}</p>
      )}
    </div>
  );
}

export function Input({
  icon: Icon,
  right,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
        />
      )}
      <input
        aria-invalid={error ? "true" : undefined}
        className={`${base} ${tone(error)} h-11 sm:h-10 ${
          Icon ? "pl-9" : "pl-3"
        } ${right ? "pr-10" : "pr-3"} ${className}`}
        {...props}
      />
      {right && (
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
          {right}
        </div>
      )}
    </div>
  );
}

export function Textarea({ error, className = "", ...props }) {
  return (
    <textarea
      aria-invalid={error ? "true" : undefined}
      className={`${base} ${tone(error)} resize-none px-3 py-2.5 leading-relaxed ${className}`}
      {...props}
    />
  );
}

export function Select({ error, className = "", children, ...props }) {
  return (
    <div className="relative">
      <select
        aria-invalid={error ? "true" : undefined}
        className={`${base} ${tone(error)} h-11 appearance-none pl-3 pr-9 sm:h-10 [&>option]:bg-[#16191F] ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={15}
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
      />
    </div>
  );
}

export const dateInputClass = "[color-scheme:dark]";