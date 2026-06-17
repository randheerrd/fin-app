import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const parseVal = (v) => {
  const m = /^(\d{4})-(\d{1,2})$/.exec(v || '');
  return m ? { year: +m[1], month: +m[2] - 1 } : null;
};

// Themed month + year picker. `value`/`onChange` use "YYYY-MM" strings.
// `min` (Date or "YYYY-MM") disables earlier months.
export default function MonthYearPicker({ value, onChange, min, placeholder = 'Select month', className = '' }) {
  const sel = parseVal(value);
  const today = new Date();
  const minD = min
    ? typeof min === 'string'
      ? parseVal(min)
      : { year: min.getFullYear(), month: min.getMonth() }
    : null;
  const minYear = minD?.year ?? -Infinity;

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(sel?.year ?? today.getFullYear());
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isDisabled = (idx) => minD && (viewYear < minD.year || (viewYear === minD.year && idx < minD.month));
  const label = sel ? `${MONTHS[sel.month]} ${sel.year}` : '';

  const pick = (idx) => {
    if (isDisabled(idx)) return;
    onChange(`${viewYear}-${String(idx + 1).padStart(2, '0')}`);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setViewYear(sel?.year ?? Math.max(today.getFullYear(), minYear === -Infinity ? today.getFullYear() : minYear));
          setOpen((o) => !o);
        }}
        className={`flex items-center justify-between gap-2 ${className} ${open ? 'border-[#0E3F2E]' : ''}`}
      >
        <span className={label ? 'text-[#111827]' : 'text-[#9ca3af]'}>{label || placeholder}</span>
        <Calendar size={16} className="text-[#9ca3af] flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-64 bg-white border border-[#e5e7eb] rounded-xl shadow-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewYear((y) => Math.max(y - 1, minYear))}
              disabled={viewYear <= minYear}
              className="p-1.5 rounded-lg hover:bg-[#f3f4f6] disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous year"
            >
              <ChevronLeft size={16} className="text-[#374151]" />
            </button>
            <span className="text-sm font-semibold text-[#111827]">{viewYear}</span>
            <button
              type="button"
              onClick={() => setViewYear((y) => y + 1)}
              className="p-1.5 rounded-lg hover:bg-[#f3f4f6]"
              aria-label="Next year"
            >
              <ChevronRight size={16} className="text-[#374151]" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {MONTHS.map((m, idx) => {
              const selected = sel && sel.year === viewYear && sel.month === idx;
              const disabled = isDisabled(idx);
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => pick(idx)}
                  disabled={disabled}
                  className={`py-2 rounded-lg text-sm transition-colors ${
                    selected
                      ? 'bg-[#0E3F2E] text-white font-medium'
                      : disabled
                        ? 'text-[#d1d5db] cursor-not-allowed'
                        : 'text-[#374151] hover:bg-[#F0F7F3]'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
