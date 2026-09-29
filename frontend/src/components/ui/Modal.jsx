import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { IconButton } from "./Button";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

const widths = { md: "max-w-md", lg: "max-w-lg" };

/**
 * Presentational modal shell. It owns no business logic:
 * parents keep deciding when it is mounted and what onClose does.
 * Put submit buttons in `footer` and link them to a form with the `form` attribute.
 */
function Modal({
  title,
  description,
  icon: Icon,
  iconTone = "purple",
  onClose,
  closeDisabled = false,
  closeLabel = "Close modal",
  size = "lg",
  children,
  footer,
}) {
  const panelRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      if (!closeDisabled) onClose?.();
      return;
    }

    if (e.key === "Tab" && panelRef.current) {
      const items = panelRef.current.querySelectorAll(FOCUSABLE);

      if (items.length === 0) {
        e.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const iconStyles =
    iconTone === "red"
      ? "bg-[#EF4444]/10 text-[#F87171]"
      : "bg-[#7C3AED]/10 text-[#A78BFA]";

  return (
    <div
      className="tf-overlay-in fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
      onKeyDown={handleKeyDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`tf-modal-in flex max-h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden rounded-[14px] border border-[#252A33] bg-[#1B1F27] shadow-[0_8px_30px_rgba(0,0,0,0.35)] outline-none ${widths[size]}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#252A33] px-5 py-4">
          <div className="flex min-w-0 items-start gap-3">
            {Icon && (
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyles}`}
              >
                <Icon size={18} aria-hidden="true" />
              </div>
            )}

            <div className="min-w-0">
              <h2
                id={titleId}
                className="text-base font-semibold tracking-[-0.01em] text-[#F5F7FA]"
              >
                {title}
              </h2>

              {description && (
                <p className="mt-0.5 text-[13px] text-[#A1A7B3]">
                  {description}
                </p>
              )}
            </div>
          </div>

          <IconButton
            icon={X}
            label={closeLabel}
            onClick={onClose}
            disabled={closeDisabled}
            className="-mr-1.5 -mt-1"
          />
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-[#252A33] bg-[#16191F] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;