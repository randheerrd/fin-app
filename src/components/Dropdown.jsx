import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Lightweight select used across filter bars (Spend, Dashboard).
export default function Dropdown({ label, value, options, onChange, leading, align = 'left' }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3.5 py-2 border border-[#e5e7eb] rounded-lg text-sm text-[#374151] hover:bg-[#f9fafb] transition-colors"
      >
        {leading}
        <span className="font-medium">
          {label ? `${label}: ` : ''}
          {value}
        </span>
        <ChevronDown size={15} className="text-[#9ca3af]" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1 z-20 bg-white border border-[#e5e7eb] rounded-lg shadow-lg py-1 min-w-[160px] max-h-64 overflow-auto`}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-sm hover:bg-[#f9fafb] ${
                  value === opt.label ? 'text-[#0E3F2E] font-medium' : 'text-[#374151]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
