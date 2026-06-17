import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const parseISO = (v) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
  return m ? { y: +m[1], mo: +m[2] - 1, d: +m[3] } : null;
};
const toISO = (y, mo, d) => `${y}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const fmt = (y, mo, d) => new Date(y, mo, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// Themed day-level date picker. `value`/`onChange` use ISO "YYYY-MM-DD".
// `max` (ISO) disables later days (e.g. no future dates).
export default function DatePicker({ value, onChange, max, placeholder = 'Select date', className = '' }) {
  const sel = parseISO(value);
  const today = new Date();
  const maxD = max ? parseISO(max) : null;

  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() =>
    sel ? { y: sel.y, mo: sel.mo } : { y: today.getFullYear(), mo: today.getMonth() }
  );
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

  const firstDay = new Date(view.y, view.mo, 1).getDay();
  const daysInMonth = new Date(view.y, view.mo + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const afterMax = (d) => maxD && new Date(view.y, view.mo, d) > new Date(maxD.y, maxD.mo, maxD.d);
  const nextDisabled = maxD && (view.y > maxD.y || (view.y === maxD.y && view.mo >= maxD.mo));
  const isToday = (d) => view.y === today.getFullYear() && view.mo === today.getMonth() && d === today.getDate();
  const isSel = (d) => sel && sel.y === view.y && sel.mo === view.mo && sel.d === d;

  const shift = (delta) => setView((v) => {
    const nm = v.mo + delta;
    return { y: v.y + Math.floor(nm / 12), mo: ((nm % 12) + 12) % 12 };
  });

  const pick = (d) => {
    if (afterMax(d)) return;
    onChange(toISO(view.y, view.mo, d));
    setOpen(false);
  };

  const goToday = () => {
    setView({ y: today.getFullYear(), mo: today.getMonth() });
    if (!maxD || today <= new Date(maxD.y, maxD.mo, maxD.d)) {
      onChange(toISO(today.getFullYear(), today.getMonth(), today.getDate()));
      setOpen(false);
    }
  };

  const label = sel ? fmt(sel.y, sel.mo, sel.d) : '';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setView(sel ? { y: sel.y, mo: sel.mo } : { y: today.getFullYear(), mo: today.getMonth() });
          setOpen((o) => !o);
        }}
        className={`flex items-center justify-between gap-2 ${className} ${open ? 'border-[#0E3F2E]' : ''}`}
      >
        <span className={label ? 'text-[#111827]' : 'text-[#9ca3af]'}>{label || placeholder}</span>
        <Calendar size={16} className="text-[#9ca3af] flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-72 bg-white border border-[#e5e7eb] rounded-xl shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#111827]">
              {MONTHS[view.mo]} {view.y}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => shift(-1)}
                className="p-1.5 rounded-lg hover:bg-[#f3f4f6]"
                aria-label="Previous month"
              >
                <ChevronLeft size={16} className="text-[#374151]" />
              </button>
              <button
                type="button"
                onClick={() => shift(1)}
                disabled={nextDisabled}
                className="p-1.5 rounded-lg hover:bg-[#f3f4f6] disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next month"
              >
                <ChevronRight size={16} className="text-[#374151]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((w, i) => (
              <span key={i} className="text-center text-[11px] font-medium text-[#9ca3af] py-1">
                {w}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((d, i) => {
              if (d === null) return <span key={`b-${i}`} />;
              const disabled = afterMax(d);
              const selected = isSel(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => pick(d)}
                  disabled={disabled}
                  className={`h-9 w-9 mx-auto rounded-lg text-sm transition-colors ${
                    selected
                      ? 'bg-[#0E3F2E] text-white font-semibold'
                      : disabled
                        ? 'text-[#d1d5db] cursor-not-allowed'
                        : `text-[#374151] hover:bg-[#F0F7F3] ${isToday(d) ? 'ring-1 ring-[#0E3F2E]/30 font-semibold text-[#0E3F2E]' : ''}`
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end mt-2 pt-2 border-t border-[#f3f4f6]">
            <button type="button" onClick={goToday} className="text-xs font-medium text-[#0E3F2E] hover:underline">
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
