const tones = {
  neutral: "text-[#A1A7B3]",
  purple: "text-[#A78BFA]",
  green: "text-[#4ADE80]",
  red: "text-[#F87171]",
  amber: "text-[#FBBF24]",
};

function StatCard({ label, value, icon: Icon, tone = "neutral", hint }) {
  return (
    <div className="rounded-xl border border-[#252A33] bg-[#16191F] p-4 transition-colors duration-150 ease-out hover:border-[#323845] sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#A1A7B3]">{label}</p>

        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#252A33] bg-[#111318] ${tones[tone]}`}
        >
          <Icon size={16} aria-hidden="true" />
        </span>
      </div>

      <p className="mt-3 text-[28px] font-semibold leading-none tracking-[-0.02em] text-[#F5F7FA]">
        {value}
      </p>

      {hint && <p className="mt-2 text-xs text-[#6B7280]">{hint}</p>}
    </div>
  );
}

export default StatCard;