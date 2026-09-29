import { Link } from "react-router-dom";
import Logo from "../ui/Logo";

const decoration = {
  backgroundImage:
    "linear-gradient(to right, rgba(37,42,51,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,42,51,0.45) 1px, transparent 1px)",
  backgroundSize: "56px 56px",
  WebkitMaskImage:
    "radial-gradient(ellipse 60% 55% at 50% 0%, #000 20%, transparent 75%)",
  maskImage:
    "radial-gradient(ellipse 60% 55% at 50% 0%, #000 20%, transparent 75%)",
};

/**
 * Shared visual frame for Login and Register.
 * Pure presentation - forms and handlers stay in the pages.
 */
function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0B0D10] px-4 py-10 text-[#F5F7FA]">
      {/* Subtle background decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={decoration} />
        <div className="absolute left-1/2 top-0 h-72 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-[#7C3AED]/10 blur-3xl" />
      </div>

      <div className="tf-fade-in relative w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <Link
            to="/"
            aria-label="TaskFlow home"
            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/50"
          >
            <Logo size="lg" />
          </Link>
        </div>

        <div className="rounded-[14px] border border-[#252A33] bg-[#111318] p-6 sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-[-0.02em]">
              {title}
            </h1>

            <p className="mt-1.5 text-sm text-[#A1A7B3]">{subtitle}</p>
          </div>

          {children}
        </div>

        <div className="mt-6 text-center text-sm text-[#A1A7B3]">{footer}</div>
      </div>
    </main>
  );
}

export default AuthLayout;