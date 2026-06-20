import { useState } from 'react';
import { ChevronDown, X, Search, Check } from 'lucide-react';

// Filter select used across Spend, Dashboard, Insights.
// - Single mode (default): `value` is the display string, `onChange(value)` picks + closes.
// - Multi mode (`multi`): `value` is an array of selected values, `onChange(nextArray)`;
//   options show checkboxes and the menu stays open. Empty array = "All".
// When a value is set the control turns green with a hover-× to clear. Long lists
// get a search box automatically.
export default function Dropdown({
  label,
  value,
  options,
  onChange,
  leading,
  align = 'left',
  active = false,
  onClear,
  multi = false,
  placeholder = 'All',
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const searchable = options.length > 8;
  const query = q.trim().toLowerCase();
  const shown = query ? options.filter((o) => o.label.toLowerCase().includes(query)) : options;

  const close = () => {
    setOpen(false);
    setQ('');
  };

  const selected = multi ? value || [] : null;
  const isActive = multi ? selected.length > 0 : active;
  const display = multi
    ? selected.length === 0
      ? placeholder
      : selected.length === 1
        ? options.find((o) => o.value === selected[0])?.label ?? '1'
        : `${selected.length} selected`
    : value;

  const toggle = (val) => {
    const set = new Set(selected);
    if (set.has(val)) set.delete(val);
    else set.add(val);
    onChange([...set]);
  };
  const clear = () => (multi ? onChange([]) : onClear?.());

  return (
    <div className="relative group">
      <button
        onClick={() => (open ? close() : setOpen(true))}
        className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-sm transition-colors ${
          isActive ? 'bg-[#F0F7F3] border-[#0E3F2E]/30 text-[#0E3F2E]' : 'border-[#e5e7eb] text-[#374151] hover:bg-[#f9fafb]'
        }`}
      >
        {leading}
        <span className="font-medium">
          {label ? `${label}: ` : ''}
          {display}
        </span>
        {isActive && (multi || onClear) ? (
          <span className="relative w-4 h-4 flex items-center justify-center flex-shrink-0">
            <ChevronDown size={15} className="text-[#0E3F2E] group-hover:opacity-0 transition-opacity" />
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear filter"
              onClick={(e) => {
                e.stopPropagation();
                clear();
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
            className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1 z-20 bg-white border border-[#e5e7eb] rounded-lg shadow-lg flex flex-col min-w-[200px] max-h-80 overflow-hidden`}
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
              {shown.map((opt) =>
                multi ? (
                  <button
                    key={opt.value}
                    onClick={() => toggle(opt.value)}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-left hover:bg-[#f9fafb]"
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                        selected.includes(opt.value) ? 'bg-[#0E3F2E]' : 'border border-[#d1d5db]'
                      }`}
                    >
                      {selected.includes(opt.value) && <Check size={11} className="text-white" strokeWidth={3} />}
                    </span>
                    <span className={selected.includes(opt.value) ? 'text-[#0E3F2E] font-medium' : 'text-[#374151]'}>
                      {opt.label}
                    </span>
                  </button>
                ) : (
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
                )
              )}
            </div>
            {multi && (
              <div className="flex items-center justify-between px-3 py-2 border-t border-[#f3f4f6]">
                <button onClick={() => onChange([])} className="text-xs text-[#9ca3af] hover:text-[#111827] transition-colors">
                  Clear
                </button>
                <button onClick={close} className="text-xs font-medium text-[#0E3F2E] hover:underline">
                  Done
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
