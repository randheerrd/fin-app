import { CalendarClock, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { CATEGORIES, getCategoryChip } from '../../data/categories';
import CategoryIcon from '../CategoryIcon';
import { goalProjection, linkedSavings } from '../../lib/goalMath';

const fmt = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || 'Other';

export default function GoalCard({ goal, transactions = [], onEdit }) {
  // Linked categories fund the goal: spend below your usual pace is credited.
  const linked = linkedSavings(goal, transactions);
  const saved = Math.min((goal.saved || 0) + linked.total, goal.target);
  const progress = Math.min((saved / goal.target) * 100, 100);
  const remaining = Math.max(goal.target - saved, 0);

  // Forward-looking projection drives the badge, bar colour, and advisory line.
  const proj = goalProjection({ ...goal, saved });
  const atRisk = proj.status === 'at-risk';
  const done = proj.status === 'done';
  const badge = done
    ? { text: 'Completed', cls: 'bg-green-50 text-green-700' }
    : atRisk
      ? { text: 'At risk', cls: 'bg-orange-50 text-orange-600' }
      : { text: 'On Track', cls: 'bg-green-50 text-green-700' };

  const stats = [
    { label: 'Complete', value: `${Math.round(progress)}%` },
    { label: 'Saved', value: fmt(saved) },
    { label: 'Remaining', value: fmt(remaining) },
    { label: 'Per Month', value: goal.monthly ? fmt(goal.monthly) : '—' },
  ];

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
        <div className="flex items-center gap-4">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${badge.cls}`}>{badge.text}</span>
          <button onClick={onEdit} className="text-sm font-medium text-[#6b7280] hover:text-[#111827]">
            Edit
          </button>
        </div>
      </div>

      <div className="w-full bg-[#f3f4f6] rounded-full h-2.5 overflow-hidden mb-4">
        <div
          className={`h-full rounded-full ${atRisk ? 'bg-[#F08A5D]' : 'bg-[#0E3F2E]'}`}
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

      {goal.linked && goal.linked.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#9ca3af] mr-0.5">Funded by</span>
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
          {linked.total > 0 && (
            <p className="flex items-start gap-1.5 mt-2.5 text-xs text-[#15803D]">
              <Sparkles size={13} className="mt-px flex-shrink-0" />
              <span>
                <span className="font-semibold">{fmt(linked.total)}</span> auto-saved by spending under your usual pace
                in {linked.cats.map((c) => catName(c.cat)).join(', ')}
                {linked.thisMonth > 0 && (
                  <>
                    {' '}· <span className="font-semibold">+{fmt(linked.thisMonth)}</span> this month
                  </>
                )}
                .
              </span>
            </p>
          )}
        </div>
      )}

      {/* Projected ETA / at-risk advice */}
      {proj.text && (
        <div
          className={`flex items-start gap-2 mt-3 text-xs ${
            proj.tone === 'warn' ? 'text-[#B45309]' : proj.tone === 'neutral' ? 'text-[#9ca3af]' : 'text-[#15803D]'
          }`}
        >
          {proj.tone === 'warn' ? (
            <AlertTriangle size={14} className="mt-px flex-shrink-0" />
          ) : done ? (
            <CheckCircle2 size={14} className="mt-px flex-shrink-0" />
          ) : (
            <CalendarClock size={14} className="mt-px flex-shrink-0" />
          )}
          <span>{proj.text}</span>
        </div>
      )}
    </div>
  );
}
