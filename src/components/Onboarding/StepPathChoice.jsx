import { BarChart2, Target, ChevronRight } from 'lucide-react';

export default function StepPathChoice({ onChoose }) {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#111827] mb-2">What do you want to do first?</h1>
        <p className="text-[#6b7280] text-sm">FinApp shapes itself around the answer. You can do both later.</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => onChoose('track')}
          className="w-full p-5 bg-white border border-[#e5e7eb] rounded-2xl hover:border-[#0E3F2E] hover:shadow-sm transition-all text-left group flex items-center gap-4"
        >
          <div className="w-11 h-11 rounded-xl bg-[#f3f4f6] flex items-center justify-center flex-shrink-0">
            <BarChart2 size={20} className="text-[#374151]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#111827]">Understand my spending</p>
            <p className="text-[#9ca3af] text-sm mt-0.5">See where the money actually goes, each month</p>
          </div>
          <ChevronRight size={18} className="text-[#9ca3af] flex-shrink-0" />
        </button>

        <button
          onClick={() => onChoose('goal')}
          className="w-full p-5 bg-white border border-[#e5e7eb] rounded-2xl hover:border-[#0E3F2E] hover:shadow-sm transition-all text-left group flex items-center gap-4"
        >
          <div className="w-11 h-11 rounded-xl bg-[#f3f4f6] flex items-center justify-center flex-shrink-0">
            <Target size={20} className="text-[#374151]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#111827]">Works towards a goal</p>
            <p className="text-[#9ca3af] text-sm mt-0.5">connect everyday spending to something that matters</p>
          </div>
          <ChevronRight size={18} className="text-[#9ca3af] flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}
