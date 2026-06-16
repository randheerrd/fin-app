import { CATEGORIES } from '../../data/categories';

export default function GoalsCard({ goals }) {
  return (
    <div className="space-y-4">
      {goals.slice(0, 3).map(goal => {
        const progress = (goal.saved / goal.target) * 100;
        const isOnTrack = goal.isNew || progress >= 55;

        return (
          <div key={goal.id} className="bg-bg-secondary border border-neutral-700 rounded-lg p-5 hover:border-neutral-600 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <p className="font-semibold text-text-primary text-sm">{goal.name}</p>
                <p className="text-text-tertiary text-xs mt-1">
                  {goal.deadline && `by ${goal.deadline}`}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full font-semibold whitespace-nowrap ml-2 ${
                isOnTrack
                  ? 'bg-emerald/20 text-emerald-light'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {isOnTrack ? 'On track' : 'Attention'}
              </span>
            </div>

            <div className="w-full bg-bg-tertiary rounded-full h-2 overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 ${isOnTrack ? 'bg-emerald' : 'bg-yellow-500'}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-text-tertiary">₹{goal.saved.toLocaleString('en-IN')}</span>
              <span className="text-text-primary font-semibold">{Math.round(progress)}%</span>
            </div>

            {goal.linked && goal.linked.length > 0 && (
              <div className="mt-3 pt-3 border-t border-neutral-700 flex flex-wrap gap-1">
                {goal.linked.slice(0, 2).map(catId => {
                  const cat = CATEGORIES.find(c => c.id === catId);
                  return (
                    <span key={catId} className="text-xs bg-bg-tertiary rounded px-2 py-1 text-text-tertiary">
                      {cat?.emoji} {cat?.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
