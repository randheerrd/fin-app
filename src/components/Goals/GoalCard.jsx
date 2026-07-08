import { useState, useEffect, useRef } from 'react';
import { History, Pencil, Coins, Sparkles, Settings2, MoreVertical, Plus } from 'lucide-react';
import { CATEGORIES, getCategoryChip } from '../../data/categories';
import CategoryIcon from '../CategoryIcon';
import AddMoneyModal from './AddMoneyModal';
import { goalProjection, availableToSave } from '../../lib/goalMath';
import { getToday } from '../../lib/utils';

const fmt = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || 'Other';
const fmtDate = (d) => {
  const x = new Date(d);
  return isNaN(x) ? d : x.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function GoalCard({
  goal,
  transactions = [],
  allGoals = [],
  onEdit,
  onContribute,
  onEditContribution,
  onRemoveContribution,
}) {
  const [dismissed, setDismissed] = useState(false); // session-only dismissal of the suggestion
  const [showHistory, setShowHistory] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [editEntry, setEditEntry] = useState(null); // contribution being edited (opens the modal)
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


  const stats = [
    { label: 'Complete', value: `${Math.round(progress)}%` },
    { label: 'Saved', value: fmt(saved) },
    { label: 'Remaining', value: fmt(remaining) },
    { label: 'Need / mo', value: proj.requiredMonthly ? fmt(proj.requiredMonthly) : '—' },
  ];

  // Available to save this month (a suggestion, opt-in). Surplus from shared
  // categories is split across linking goals, so it's never offered twice.
  const avail = availableToSave(goal, transactions, allGoals);
  const showAvail = !dismissed && avail.total > 0 && remaining > 0;
  const topCat = avail.cats[0]?.cat;

  // Readable list of the categories contributing the surplus.
  const availNames = avail.cats.map((c) => catName(c.cat));
  const reasonCats =
    availNames.length === 0
      ? 'linked'
      : availNames.length === 1
        ? availNames[0]
        : `${availNames.slice(0, -1).join(', ')} & ${availNames[availNames.length - 1]}`;

  const handleMove = () => {
    onContribute?.(goal.id, avail.total, {
      id: crypto.randomUUID(),
      type: 'auto',
      label: availNames.length <= 1 ? `From ${reasonCats} surplus` : 'From linked-category surplus',
      amount: avail.total,
      date: getToday(),
      categoryId: topCat,
    });
    setDismissed(true);
  };

  const log = [...(goal.contributionLog || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Outline + a very subtle wash reflect status: green when reached, yellow once
  // the deadline passed.
  const cardTone = done
    ? 'border-[#86C7A6] bg-[#F6FBF8]'
    : atRisk
      ? 'border-[#F2C94C] bg-[#FEFCF3]'
      : 'border-[#ECEEF0] bg-white';

  return (
    <div
      onClick={() => setShowHistory((s) => !s)}
      className={`border ${cardTone} rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6 cursor-pointer transition-shadow hover:shadow-[0_4px_14px_rgba(16,24,40,0.07)]`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-bold text-[#111827]">{goal.name}</p>
          <p className="text-xs text-[#374151] mt-0.5">
            Target {fmt(goal.target)}
            {goal.deadline && ` · by ${goal.deadline}`}
            {proj.status === 'on-track' && proj.requiredMonthly > 0 && (
              <span className="font-medium"> (Save {fmt(proj.requiredMonthly)}/mo)</span>
            )}
            {proj.status === 'overdue' && (
              <span className="font-medium">
                {' '}({fmt(remaining)} left ·{' '}
                <button onClick={() => onEdit(true)} className="hover:underline">
                  extend deadline
                </button>
                )
              </span>
            )}
            {proj.status === 'planning' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(true);
                }}
                className="ml-1.5 inline-flex items-center font-medium text-[#6b7280] hover:text-[#374151] hover:underline align-baseline"
              >
                (<Plus size={12} className="mx-0.5" />Add a deadline)
              </button>
            )}
            {done && <span className="font-medium text-[#15803D]"> · Reached 🎉</span>}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${badge.cls}`}>{badge.text}</span>
          <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-1 rounded-lg hover:bg-[#f3f4f6] transition-colors"
              aria-label="Goal options"
            >
              <MoreVertical size={18} className="text-[#9ca3af]" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 z-20 bg-white border border-[#e5e7eb] rounded-lg shadow-lg py-1 min-w-[170px]">
                <button
                  onClick={() => {
                    setShowAddMoney(true);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-[#374151] hover:bg-[#f9fafb] whitespace-nowrap"
                >
                  <Plus size={15} className="text-[#6b7280]" /> Add contribution
                </button>
                <button
                  onClick={() => {
                    setShowHistory((s) => !s);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-[#374151] hover:bg-[#f9fafb] whitespace-nowrap"
                >
                  <History size={15} className="text-[#6b7280]" /> Contributions
                </button>
                <button
                  onClick={() => {
                    onEdit();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-[#374151] hover:bg-[#f9fafb] whitespace-nowrap"
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
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-4 rounded-xl bg-[#F0F7F3] border border-[#0E3F2E]/15 p-4"
        >
          <p className="text-[11px] font-semibold text-[#0E3F2E] uppercase tracking-wide">Available to save this month</p>
          <p className="text-2xl font-bold text-[#111827] mt-1 mb-1">{fmt(avail.total)}</p>
          <p className="text-xs text-[#6b7280]">
            You're {fmt(avail.total)} under your usual {reasonCats} spend this month. Move it to {goal.name}?
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

      {/* Contributions — toggled by the ⋮ menu or by clicking the card; animated open/close */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${showHistory ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-4 rounded-xl bg-[#f9fafb] border border-[#eef0f2] overflow-hidden cursor-default"
          >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#eef0f2]">
            <p className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide">Contributions</p>
            <p className="text-[11px] text-[#9ca3af]">{log.length} {log.length === 1 ? 'entry' : 'entries'}</p>
          </div>
          {log.length === 0 ? (
            <p className="text-sm text-[#9ca3af] text-center py-6 px-4">
              No contributions yet. Manual saves and moved amounts will show up here.
            </p>
          ) : (
            <div className="divide-y divide-[#f0f1f3]">
              {log.map((c) => {
                const isManual = c.type === 'manual';
                return (
                  <div
                    key={c.id}
                    className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white"
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isManual ? 'bg-[#E7F4ED] text-[#0E7C4A]' : 'bg-[#EFEFF1] text-[#6b7280]'
                      }`}
                    >
                      {isManual ? <Coins size={15} /> : <Sparkles size={15} />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#111827] truncate">{c.label}</p>
                      <p className="text-[11px] text-[#9ca3af] mt-0.5">
                        {fmtDate(c.date)}
                        {!isManual && ' · auto'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#0E7C4A] whitespace-nowrap">+{fmt(c.amount)}</span>
                    {/* Reserved action slot keeps amounts aligned; the edit action fades in
                        on hover (delete lives inside the edit modal). Auto (surplus) moves are
                        app-managed, so the control is disabled with a custom tooltip explaining
                        why (native title won't fire on a disabled button — the wrapping span
                        carries the hover instead). */}
                    <div className="w-8 flex items-center justify-end flex-shrink-0">
                      {isManual ? (
                        <button
                          onClick={() => setEditEntry(c)}
                          className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#374151] hover:bg-[#eef0f2] opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Edit contribution"
                        >
                          <Pencil size={13} />
                        </button>
                      ) : (
                        <span className="relative group/tip flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="p-1.5 rounded-lg text-[#cbd0d6] cursor-not-allowed">
                            <Pencil size={13} />
                          </span>
                          <span
                            role="tooltip"
                            className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-2 w-max max-w-[220px] rounded-lg bg-[#111827] text-white text-[11px] leading-snug px-2.5 py-1.5 opacity-0 group-hover/tip:opacity-100 transition-opacity z-30 shadow-lg"
                          >
                            Auto surplus moves are managed by the app — they can't be edited.
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </div>
        </div>
      </div>

      {(showAddMoney || editEntry) && (
        <div onClick={(e) => e.stopPropagation()}>
          <AddMoneyModal
            goal={goal}
            entry={editEntry}
            onContribute={onContribute}
            onEditContribution={onEditContribution}
            onRemoveContribution={onRemoveContribution}
            onClose={() => {
              setShowAddMoney(false);
              setEditEntry(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
