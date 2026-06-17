import { useState } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';

// Lightweight select used across filter bars (Spend, Dashboard, Insights).
// When `active` (a non-default value is selected) the control turns green and,
// on hover, the chevron becomes a × that calls `onClear`. Long option lists get
// a search box automatically.
export default function Dropdown({ label, value, options, onChange, leading, align = 'left', active = false, onClear }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const searchable = options.length > 8;
  const query = q.trim().toLowerCase();
  const shown = query ? options.filter((o) => o.label.toLowerCase().includes(query)) : options;

  const close = () => {
    setOpen(false);
    setQ('');
  };

  return (
    <div className="relative group">
      <button
        onClick={() => (open ? close() : setOpen(true))}
        className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-sm transition-colors ${
          active
            ? 'bg-[#F0F7F3] border-[#0E3F2E]/30 text-[#0E3F2E]'
            : 'border-[#e5e7eb] text-[#374151] hover:bg-[#f9fafb]'
        }`}
      >
        {leading}
        <span className="font-medium">
          {label ? `${label}: ` : ''}
          {value}
        </span>
        {active && onClear ? (
          <span className="relative w-4 h-4 flex items-center justify-center flex-shrink-0">
            <ChevronDown size={15} className="text-[#0E3F2E] group-hover:opacity-0 transition-opacity" />
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear filter"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="absolute inset-0 hidden group-hover:flex items-center justify-center text-[#0E3F2E] hover:text-[#0a3122]"
            >
              <X size={15} />
            </span>
          </span>
        ) : (
          <ChevronDown size={15} className="text-[#9ca3af] flex-shrink-0" />
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={close} />
          <div
            className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1 z-20 bg-white border border-[#e5e7eb] rounded-lg shadow-lg flex flex-col min-w-[200px] max-h-72 overflow-hidden`}
          >
            {searchable && (
              <div className="flex items-center gap-2 px-3 py-2 border-b border-[#f3f4f6]">
                <Search size={14} className="text-[#9ca3af] flex-shrink-0" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search…"
                  className="flex-1 text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
                />
              </div>
            )}
            <div className="overflow-y-auto py-1">
              {shown.length === 0 && <p className="px-3.5 py-2 text-sm text-[#9ca3af]">No matches.</p>}
              {shown.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    close();
                  }}
                  className={`w-full text-left px-3.5 py-2 text-sm hover:bg-[#f9fafb] ${
                    value === opt.label ? 'text-[#0E3F2E] font-medium' : 'text-[#374151]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
