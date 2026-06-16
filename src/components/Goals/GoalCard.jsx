import { CATEGORIES } from '../../data/categories';

export default function GoalCard({ goal }) {
  const progress = (goal.saved / goal.target) * 100;
  const expected = goal.detected ? 20 : 55;
  const isOnTrack = goal.isNew || progress >= expected;
  const remaining = goal.target - goal.saved;
  const monthsLeft = goal.monthly ? (remaining / goal.monthly).toFixed(1) : null;

  return (
    <div className="bg-bg-card border border-line rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium text-text-primary text-lg">{goal.name}</h3>
          <p className="text-text-faint text-sm mt-1">
            Target ₹{goal.target.toLocaleString('en-IN')}
            {goal.deadline && ` · by ${goal.deadline}`}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
          isOnTrack
            ? 'bg-sage/20 text-sage'
            : 'bg-amber/20 text-amber'
        }`}>
          {isOnTrack ? 'On track' : 'Needs attention'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full bg-bg-raise rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${isOnTrack ? 'bg-sage' : 'bg-amber'}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-baseline mt-2">
          <span className="text-text-faint text-xs">₹{goal.saved.toLocaleString('en-IN')} saved</span>
          <span className="text-text-primary font-medium text-xs">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 py-4 border-y border-line my-4">
        <div>
          <p className="text-text-faint text-xs mb-1">Saved</p>
          <p className="font-serif text-lg text-text-primary">₹{goal.saved.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-text-faint text-xs mb-1">Remaining</p>
          <p className="font-serif text-lg text-text-primary">₹{remaining.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-text-faint text-xs mb-1">Per month</p>
          <p className="font-serif text-lg text-text-primary">₹{goal.monthly?.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Linked categories */}
      {goal.linked && goal.linked.length > 0 && (
        <div className="mt-4 pt-4 border-t border-line">
          <p className="text-text-faint text-xs mb-2">Watched categories</p>
          <div className="flex flex-wrap gap-2">
            {goal.linked.map(catId => {
              const cat = CATEGORIES.find(c => c.id === catId);
              return (
                <span key={catId} className="inline-flex items-center gap-1 px-2 py-1 bg-bg rounded text-xs text-text-faint">
                  {cat?.emoji} {cat?.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {monthsLeft && (
        <p className="text-xs text-text-faint mt-4">
          At ₹{goal.monthly?.toLocaleString('en-IN')}/month → {monthsLeft} months to go
        </p>
      )}
    </div>
  );
}
