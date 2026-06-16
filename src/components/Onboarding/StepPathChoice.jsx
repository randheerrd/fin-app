import { BarChart2, Target, ChevronRight } from 'lucide-react';

export default function StepPathChoice({ onChoose }) {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">What do you want to do first?</h1>
        <p className="text-[#6b7280] text-sm">FinApp shapes itself around the answer. You can do both later.</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onChoose('track')}
          className="w-full p-5 bg-white border border-[#e5e7eb] rounded-xl hover:border-[#1B3A2F] hover:shadow-sm transition-all text-left group flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg border border-[#e5e7eb] flex items-center justify-center flex-shrink-0 group-hover:border-[#1B3A2F]/30">
            <BarChart2 size={20} className="text-[#6b7280]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#111827] text-sm">Understand my spending</p>
            <p className="text-[#6b7280] text-xs mt-0.5">See where the money actually goes, each month</p>
          </div>
          <ChevronRight size={18} className="text-[#9ca3af] flex-shrink-0" />
        </button>

        <button
          onClick={() => onChoose('goal')}
          className="w-full p-5 bg-white border border-[#e5e7eb] rounded-xl hover:border-[#1B3A2F] hover:shadow-sm transition-all text-left group flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg border border-[#e5e7eb] flex items-center justify-center flex-shrink-0 group-hover:border-[#1B3A2F]/30">
            <Target size={20} className="text-[#6b7280]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#111827] text-sm">Works towards a goal</p>
            <p className="text-[#6b7280] text-xs mt-0.5">connect everyday spending to something that matters</p>
          </div>
          <ChevronRight size={18} className="text-[#9ca3af] flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}
