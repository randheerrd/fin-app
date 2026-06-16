import { CATEGORIES } from '../../data/categories';

export default function GoalsCard({ goals }) {
  return (
    <div className="space-y-4">
      {goals.slice(0, 3).map(goal => {
        const progress = (goal.saved / goal.target) * 100;
        const isOnTrack = goal.isNew || progress >= 55;

        return (
          <div key={goal.id} className="bg-bg-card border border-line rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium text-text-primary text-sm">{goal.name}</p>
                <p className="text-text-faint text-xs mt-1">
                  {goal.deadline && `by ${goal.deadline}`}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded font-medium ${
                isOnTrack
                  ? 'bg-sage/20 text-sage'
                  : 'bg-rose/20 text-rose'
              }`}>
                {isOnTrack ? 'On track' : 'Needs attention'}
              </span>
            </div>

            <div className="w-full bg-bg-raise rounded-full h-1.5 overflow-hidden mb-2">
              <div
                className={`h-full transition-all duration-300 ${isOnTrack ? 'bg-sage' : 'bg-amber'}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-text-faint">₹{goal.saved.toLocaleString('en-IN')}</span>
              <span className="text-text-primary font-medium">{Math.round(progress)}%</span>
            </div>

            {goal.linked && goal.linked.length > 0 && (
              <div className="mt-3 pt-3 border-t border-line flex flex-wrap gap-1">
                {goal.linked.slice(0, 2).map(catId => {
                  const cat = CATEGORIES.find(c => c.id === catId);
                  return (
                    <span key={catId} className="text-xs bg-bg rounded px-2 py-1 text-text-faint">
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
