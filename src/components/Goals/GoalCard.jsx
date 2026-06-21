import { useState, useEffect, useRef } from 'react';
import { CalendarClock, AlertTriangle, CheckCircle2, History, Pencil, ArrowRight, Settings2, MoreVertical } from 'lucide-react';
import { CATEGORIES, getCategoryChip } from '../../data/categories';
import CategoryIcon from '../CategoryIcon';
import { goalProjection, availableToSave } from '../../lib/goalMath';
import { getToday } from '../../lib/utils';

const fmt = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || 'Other';
const fmtDate = (d) => {
  const x = new Date(d);
  return isNaN(x) ? d : x.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function GoalCard({ goal, transactions = [], onEdit, onContribute }) {
  const [dismissed, setDismissed] = useState(false); // session-only dismissal of the suggestion
  const [showHistory, setShowHistory] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false);
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  const saved = goal.saved || 0;
  const progress = Math.min((saved / goal.target) * 100, 100);
  const remaining = Math.max(goal.target - saved, 0);

  // Deadline-driven projection: status + the monthly it now takes (derived).
  const proj = goalProjection(goal);
  const atRisk = proj.status === 'overdue';
  const done = proj.status === 'done';
  const badge = done
    ? { text: 'Completed', cls: 'bg-green-50 text-green-700' }
    : atRisk
      ? { text: 'Overdue', cls: 'bg-orange-50 text-orange-600' }
      : { text: 'On Track', cls: 'bg-green-50 text-green-700' };

  // Sentiment-colored status icon (detail shown on hover) beside the badge.
  const StatusIcon = proj.tone === 'warn' ? AlertTriangle : done ? CheckCircle2 : CalendarClock;
  const statusColor =
    proj.tone === 'warn' ? 'text-[#B45309]' : proj.tone === 'neutral' ? 'text-[#9ca3af]' : 'text-[#15803D]';

  const stats = [
    { label: 'Complete', value: `${Math.round(progress)}%` },
    { label: 'Saved', value: fmt(saved) },
    { label: 'Remaining', value: fmt(remaining) },
    { label: 'Need / mo', value: proj.requiredMonthly ? fmt(proj.requiredMonthly) : '—' },
  ];

  // Available to save this month (a suggestion, opt-in).
  const avail = availableToSave(goal, transactions);
  const showAvail = !dismissed && avail.total > 0 && remaining > 0;
  const topCat = avail.cats[0]?.cat;

  const handleMove = () => {
    onContribute?.(goal.id, avail.total, {
      id: crypto.randomUUID(),
      type: 'auto',
      label: topCat ? `From ${catName(topCat)} surplus` : 'Available surplus',
      amount: avail.total,
      date: getToday(),
      categoryId: topCat,
    });
    setDismissed(true);
  };

  const log = [...(goal.contributionLog || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-bold text-[#111827]">{goal.name}</p>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Target {fmt(goal.target)}
            {goal.deadline && ` · by ${goal.deadline}`}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${badge.cls}`}>{badge.text}</span>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-1 rounded-lg hover:bg-[#f3f4f6] transition-colors"
              aria-label="Goal options"
            >
              <MoreVertical size={18} className="text-[#9ca3af]" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 z-20 bg-white border border-[#e5e7eb] rounded-lg shadow-lg py-1 min-w-[150px]">
                <button
                  onClick={() => {
                    setShowHistory((s) => !s);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-[#374151] hover:bg-[#f9fafb]"
                >
                  <History size={15} className="text-[#6b7280]" /> History
                </button>
                <button
                  onClick={() => {
                    onEdit();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-[#374151] hover:bg-[#f9fafb]"
                >
                  <Settings2 size={15} className="text-[#6b7280]" /> Edit goal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full bg-[#f3f4f6] rounded-full h-2.5 overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-300 ${atRisk ? 'bg-[#F08A5D]' : 'bg-[#0E3F2E]'}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-4 bg-[#f9fafb] rounded-xl overflow-hidden">
        {stats.map((s, i) => (
          <div key={s.label} className={`px-5 py-4 ${i > 0 ? 'border-l border-[#eef0f2]' : ''}`}>
            <p className="text-lg font-bold text-[#111827]">{s.value}</p>
            <p className="text-[11px] uppercase tracking-wide text-[#9ca3af] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Available to save this month — opt-in suggestion */}
      {showAvail && (
        <div className="mt-4 rounded-xl bg-[#F0F7F3] border border-[#0E3F2E]/15 p-4">
          <p className="text-[11px] font-semibold text-[#0E3F2E] uppercase tracking-wide">Available to save this month</p>
          <p className="text-2xl font-bold text-[#111827] mt-1 mb-1">{fmt(avail.total)}</p>
          <p className="text-xs text-[#6b7280]">
            You're {fmt(avail.total)} under your usual {topCat ? catName(topCat) : 'linked'}{' '}
            {avail.cats.length > 1 ? 'spend' : 'spend'} this month. Move it to {goal.name}?
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleMove}
              className="px-4 py-2 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
            >
              Move to goal
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-2 text-sm text-[#6b7280] hover:text-[#111827] transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {/* Linked categories */}
      {goal.linked && goal.linked.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#9ca3af] mr-0.5">Linked categories</span>
          {goal.linked.map((id) => {
            const chip = getCategoryChip(id);
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
                style={{ backgroundColor: chip.bg, color: chip.text }}
              >
                <CategoryIcon id={id} size={13} /> {catName(id)}
              </span>
            );
          })}
        </div>
      )}

      {/* Derived monthly target — sentiment-colored, no box */}
      {proj.text && (
        <p className={`flex items-center gap-2 mt-3.5 text-sm font-medium ${statusColor}`}>
          <StatusIcon size={15} className="flex-shrink-0" />
          {proj.text}
        </p>
      )}

      {/* Contribution history (read-only, toggled from the ⋮ menu) */}
      {showHistory && (
        <div className="mt-4 rounded-xl bg-[#f9fafb] border border-[#eef0f2] p-4">
          {log.length === 0 ? (
            <p className="text-sm text-[#9ca3af] text-center py-2">
              No contributions yet. Manual saves or moved amounts will show up here.
            </p>
          ) : (
            <div className="space-y-2.5">
              {log.map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-white border border-[#eef0f2] flex items-center justify-center flex-shrink-0">
                    {e.type === 'manual' ? (
                      <Pencil size={13} className="text-[#6b7280]" />
                    ) : (
                      <ArrowRight size={13} className="text-[#0E3F2E]" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#111827] truncate">{e.label}</p>
                    <p className="text-[11px] text-[#9ca3af]">{fmtDate(e.date)}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#15803D] whitespace-nowrap">+{fmt(e.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
