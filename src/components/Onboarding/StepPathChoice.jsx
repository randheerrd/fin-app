import { TrendingUp, Target } from 'lucide-react';

export default function StepPathChoice({ onChoose }) {
  return (
    <div className="max-w-2xl w-full px-8">
      <div className="text-center mb-16">
        <div className="flex justify-center gap-2 mb-12">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-accent' : 'bg-bg-border'}`} />
          ))}
        </div>
        <h1 className="font-serif text-4xl font-bold text-text-primary mb-4">What do you want to do first?</h1>
        <p className="text-text-secondary">FinApp shapes itself around the answer. You can do both later.</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => onChoose('track')}
          className="w-full p-6 bg-white border-2 border-bg-border rounded-lg hover:border-accent hover:bg-blue-50 transition-all text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors flex-shrink-0">
              <TrendingUp className="text-accent" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary text-lg mb-1">Understand my spending</h3>
              <p className="text-text-secondary text-sm">See where the money actually goes, each month</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onChoose('goal')}
          className="w-full p-6 bg-white border-2 border-bg-border rounded-lg hover:border-accent hover:bg-blue-50 transition-all text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors flex-shrink-0">
              <Target className="text-accent" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary text-lg mb-1">Works towards a goal</h3>
              <p className="text-text-secondary text-sm">connect everyday spending to something that matters</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
