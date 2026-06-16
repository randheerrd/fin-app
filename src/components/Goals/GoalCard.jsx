import { CATEGORIES, getCategoryChip } from '../../data/categories';

const fmt = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || 'Other';
const catEmoji = (id) => CATEGORIES.find((c) => c.id === id)?.emoji || '•';

export default function GoalCard({ goal, onEdit }) {
  const progress = Math.min((goal.saved / goal.target) * 100, 100);
  const isOnTrack = goal.isNew || progress >= (goal.detected ? 20 : 55);
  const remaining = Math.max(goal.target - goal.saved, 0);

  const stats = [
    { label: 'Complete', value: `${Math.round(progress)}%` },
    { label: 'Saved', value: fmt(goal.saved) },
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
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              isOnTrack ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'
            }`}
          >
            {isOnTrack ? 'On Track' : 'Needs Attention'}
          </span>
          <button onClick={onEdit} className="text-sm font-medium text-[#6b7280] hover:text-[#111827]">
            Edit
          </button>
        </div>
      </div>

      <div className="w-full bg-[#f3f4f6] rounded-full h-2.5 overflow-hidden mb-4">
        <div
          className={`h-full rounded-full ${isOnTrack ? 'bg-[#0E3F2E]' : 'bg-[#F08A5D]'}`}
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
        <div className="flex flex-wrap gap-2 mt-4">
          {goal.linked.map((id) => {
            const chip = getCategoryChip(id);
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium"
                style={{ backgroundColor: chip.bg, color: chip.text }}
              >
                {catEmoji(id)} {catName(id)}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
