import { Check } from 'lucide-react';

// Friendly empty state: an icon tile, a title, a line of copy, an optional CTA
// (children), and optional benefit chips to hint at what the section offers.
export default function EmptyState({ icon: Icon, title, subtitle, children, benefits }) {
  return (
    <div className="border border-dashed border-[#e5e7eb] rounded-2xl px-8 py-14 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F0F7F3] to-[#E3F0E9] ring-1 ring-[#0E3F2E]/10 shadow-sm flex items-center justify-center mb-5">
        <Icon size={28} strokeWidth={1.75} className="text-[#0E3F2E]" />
      </div>
      <p className="text-base font-semibold text-[#111827] mb-1.5">{title}</p>
      {subtitle && <p className="text-sm text-[#9ca3af] mb-6 max-w-sm">{subtitle}</p>}
      {children}
      {benefits && benefits.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-7">
          {benefits.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f9fafb] border border-[#f0f1f3] text-xs text-[#6b7280]"
            >
              <Check size={12} className="text-[#0E3F2E]" /> {b}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
