// Friendly empty state: an icon tile, a title, a line of copy, and an optional CTA.
export default function EmptyState({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="border border-dashed border-[#e5e7eb] rounded-2xl px-8 py-16 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F0F7F3] to-[#E3F0E9] ring-1 ring-[#0E3F2E]/10 shadow-sm flex items-center justify-center mb-5">
        <Icon size={28} strokeWidth={1.75} className="text-[#0E3F2E]" />
      </div>
      <p className="text-base font-semibold text-[#111827] mb-1.5">{title}</p>
      {subtitle && <p className="text-sm text-[#9ca3af] mb-6 max-w-sm">{subtitle}</p>}
      {children}
    </div>
  );
}
