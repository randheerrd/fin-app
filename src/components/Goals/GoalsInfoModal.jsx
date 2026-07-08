import { useEffect } from 'react';
import { X, Target, Sparkles, Scale, Plus, TrendingUp } from 'lucide-react';

function Section({ icon: Icon, title, children }) {
  return (
    <div className="flex gap-3">
      <span className="w-9 h-9 rounded-lg bg-[#F0F7F3] flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-[#0E3F2E]" />
      </span>
      <div>
        <p className="text-sm font-semibold text-[#111827] mb-0.5">{title}</p>
        <p className="text-sm text-[#6b7280] leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

export default function GoalsInfoModal({ onClose }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-[640px] w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-start px-8 pt-7 pb-2">
          <h2 className="font-display text-2xl text-[#111827]">How goals work</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#f3f4f6] rounded-lg transition-colors">
            <X size={20} className="text-[#6b7280]" />
          </button>
        </div>

        <div className="px-8 py-5 space-y-6">
          <Section icon={Target} title="Set a target and a deadline">
            That's all you enter. The app works out how much to set aside each month (the{' '}
            <span className="font-medium text-[#374151]">Need / mo</span> figure) and recalculates it as you save — so
            there are no contradictory numbers to manage.
          </Section>

          <Section icon={Sparkles} title="How “Available to save” is calculated">
            For each linked category we compare this month's spend to your{' '}
            <span className="font-medium text-[#374151]">usual monthly pace</span> (its historical average). If you're under
            it, that surplus is offered to move to the goal. When a category is linked to several goals, the surplus is{' '}
            <span className="font-medium text-[#374151]">split between them</span>, so the same rupee is never offered twice.
            Nothing moves on its own — you choose with <span className="font-medium text-[#374151]">Move to goal</span>.
          </Section>

          <Section icon={Scale} title="When two goals share a category">
            If the same category's surplus could go to two goals, we split it by{' '}
            <span className="font-medium text-[#374151]">how much each goal still has left to save</span>. The goal that
            needs more gets the bigger share — so the same money is never promised to both.
            <span className="block mt-2.5 rounded-lg bg-[#f9fafb] border border-[#eef0f2] px-3.5 py-2.5 font-mono text-[12px] text-[#374151] leading-relaxed">
              this goal's share = surplus × ( what this goal needs ÷ what both goals need )
            </span>
          </Section>

          <Section icon={Plus} title="Adding money & manual entries">
            Two ways to grow a goal: accept an “Available to save” suggestion, or open{' '}
            <span className="font-medium text-[#374151]">⋮ → Edit goal</span> and use{' '}
            <span className="font-medium text-[#374151]">Add a manual save</span>. Saved only ever changes from real
            contributions, and every one is recorded under <span className="font-medium text-[#374151]">History</span>.
          </Section>

          <Section icon={TrendingUp} title="Status">
            <span className="font-medium text-[#374151]">On Track</span> while there's still time to hit the deadline,{' '}
            <span className="font-medium text-[#374151]">Overdue</span> once it passes with money to go, and{' '}
            <span className="font-medium text-[#374151]">Completed</span> when fully funded.
          </Section>
        </div>

        <div className="px-8 py-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
