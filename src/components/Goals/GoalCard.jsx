import { CATEGORIES } from '../../data/categories';

export default function GoalCard({ goal }) {
  const progress = (goal.saved / goal.target) * 100;
  const isOnTrack = goal.isNew || progress >= (goal.detected ? 20 : 55);
  const remaining = goal.target - goal.saved;

  return (
    <div className="border border-[#f3f4f6] rounded-xl p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-semibold text-[#111827]">{goal.name}</p>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Target ₹{goal.target.toLocaleString('en-IN')}
            {goal.deadline && ` · by ${goal.deadline}`}
          </p>
        </div>
        <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
          isOnTrack ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'
        }`}>
          {isOnTrack ? 'On track' : 'Needs attention'}
        </span>
      </div>

      <div className="w-full bg-[#f3f4f6] rounded-full h-1.5 overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all ${isOnTrack ? 'bg-[#1B3A2F]' : 'bg-orange-400'}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="flex justify-between mb-5">
        <span className="text-xs text-[#9ca3af]">₹{goal.saved.toLocaleString('en-IN')} saved</span>
        <span className="text-xs font-medium text-[#374151]">{Math.round(progress)}%</span>
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-[#f3f4f6] pt-4">
        {[
          { label: 'Saved', value: `₹${goal.saved.toLocaleString('en-IN')}` },
          { label: 'Remaining', value: `₹${remaining.toLocaleString('en-IN')}` },
          { label: 'Per month', value: goal.monthly ? `₹${goal.monthly.toLocaleString('en-IN')}` : '—' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-[#9ca3af] mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-[#111827]">{value}</p>
          </div>
        ))}
      </div>

      {goal.linked && goal.linked.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#f3f4f6]">
          <p className="text-xs text-[#9ca3af] mb-2">Watched categories</p>
          <div className="flex flex-wrap gap-2">
            {goal.linked.map(catId => {
              const cat = CATEGORIES.find(c => c.id === catId);
              return (
                <span key={catId} className="inline-flex items-center gap-1 px-2 py-1 bg-[#f3f4f6] rounded text-xs text-[#6b7280]">
                  {cat?.emoji} {cat?.name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
