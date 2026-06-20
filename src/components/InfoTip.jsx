import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

// Small info icon that reveals an explanatory popover on hover/click.
export default function InfoTip({ children, size = 16, align = 'left' }) {
  const [open, setOpen] = useState(false);
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

  return (
    <span className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        aria-label="How this is calculated"
        className="text-[#9ca3af] hover:text-[#0E3F2E] transition-colors"
      >
        <Info size={size} />
      </button>
      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className={`absolute top-7 z-30 w-72 bg-white border border-[#e5e7eb] rounded-xl shadow-lg p-4 text-xs text-[#6b7280] leading-relaxed ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {children}
        </div>
      )}
    </span>
  );
}
