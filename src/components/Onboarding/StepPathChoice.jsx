import { TrendingUp, Target } from 'lucide-react';

export default function StepPathChoice({ onChoose }) {
  return (
    <div className="max-w-md w-full px-4">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl text-text-primary mb-2">Fin-app</h1>
        <p className="text-text-dim">Get calm clarity on your money</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => onChoose('track')}
          className="w-full p-6 bg-bg-card border border-line rounded-lg hover:bg-bg-raise transition-colors text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-sage/20 rounded-lg group-hover:bg-sage/30 transition-colors">
              <TrendingUp className="text-sage" size={24} />
            </div>
            <div>
              <h3 className="font-medium text-text-primary mb-1">Track spending</h3>
              <p className="text-sm text-text-dim">See where your money goes every month</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onChoose('goal')}
          className="w-full p-6 bg-bg-card border border-line rounded-lg hover:bg-bg-raise transition-colors text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-sage/20 rounded-lg group-hover:bg-sage/30 transition-colors">
              <Target className="text-sage" size={24} />
            </div>
            <div>
              <h3 className="font-medium text-text-primary mb-1">Work toward a goal</h3>
              <p className="text-sm text-text-dim">Save for something specific</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
