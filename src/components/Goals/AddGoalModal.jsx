import { useState, useEffect } from 'react';
import { X, Plus, Check, Trash2, AlertTriangle } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import MonthYearPicker from '../MonthYearPicker';
import { parseMonthYear, fmtMonth, toMonthValue, goalInsight } from '../../lib/goalMath';
import { groupINR, digitsOnly, getToday } from '../../lib/utils';

// Normalize an incoming deadline label ("Dec 2026") to the picker's "YYYY-MM".
const initialDeadlineValue = (d) => {
  const parsed = parseMonthYear(d);
  return parsed ? toMonthValue(parsed) : '';
};

export default function AddGoalModal({ onClose, onSave, onDelete, initial, forceCreate = false }) {
  // forceCreate: prefilled (e.g. from a template) but still a brand-new goal.
  const isEdit = Boolean(initial) && !forceCreate;
  const today = new Date();
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  const [name, setName] = useState(initial?.name || '');
  const [target, setTarget] = useState(initial ? String(initial.target) : '');
  const [deadline, setDeadline] = useState(initialDeadlineValue(initial?.deadline));
  const [linked, setLinked] = useState(initial?.linked || []);
  const [manualSave, setManualSave] = useState(''); // optional one-off deposit (edit mode)

  const insight = goalInsight(target, deadline);

  const toggleCategory = (catId) =>
    setLinked((prev) => (prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]));

  const handleSave = () => {
    if (!name || !target) return;
    const manualNum = parseFloat(manualSave) || 0;
    const baseSaved = initial?.saved ?? 0;
    const baseLog = initial?.contributionLog || [];
    const contributionLog =
      manualNum > 0
        ? [...baseLog, { id: crypto.randomUUID(), type: 'manual', label: 'Manual save added', amount: manualNum, date: getToday() }]
        : baseLog;
    onSave({
      ...(initial || {}),
      name,
      target: parseFloat(target),
      saved: baseSaved + manualNum,
      deadline: parseMonthYear(deadline) ? fmtMonth(parseMonthYear(deadline)) : '',
      linked,
      contributionLog,
    });
  };

  const inputClass =
    'w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm text-[#111827] outline-none focus:border-[#0E3F2E] placeholder:text-[#9ca3af]';

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-start px-8 pt-7 pb-2">
          <h2 className="font-display text-3xl text-[#111827]">{isEdit ? 'Edit goal' : 'Declare a goal'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#f3f4f6] rounded-lg transition-colors">
            <X size={20} className="text-[#6b7280]" />
          </button>
        </div>

        <div className="px-8 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Goal Name</label>
            <input
              autoFocus
              type="text"
              placeholder="Vietnam Trip"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Target Amount</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="60,000"
                value={groupINR(target)}
                onChange={(e) => setTarget(digitsOnly(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Deadline</label>
              <MonthYearPicker
                value={deadline}
                onChange={setDeadline}
                min={today}
                placeholder="Select month"
                className={`${inputClass} text-left`}
              />
            </div>
          </div>

          {insight && (
            <div
              className={`flex items-start gap-2 rounded-xl px-4 py-3 border text-sm font-medium ${
                insight.tone === 'ok'
                  ? 'bg-[#F0F7F3] border-[#0E3F2E]/15 text-[#15803D]'
                  : 'bg-[#FEF6F1] border-[#F08A5D]/25 text-[#B45309]'
              }`}
            >
              {insight.tone === 'ok' ? (
                <Check size={15} className="mt-px flex-shrink-0" />
              ) : (
                <AlertTriangle size={15} className="mt-px flex-shrink-0" />
              )}
              <span>{insight.text}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2.5">
              Link spending categories (optional)
            </label>
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.filter((c) => c.id !== 'cash').map((cat) => {
                const active = linked.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm transition-colors ${
                      active
                        ? 'bg-[#0E3F2E] border-[#0E3F2E] text-white'
                        : 'bg-white border-[#e5e7eb] text-[#374151] hover:bg-[#f9fafb]'
                    }`}
                  >
                    {active ? <Check size={14} /> : <Plus size={14} className="text-[#9ca3af]" />}
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {isEdit && (
            <div className="pt-4 border-t border-[#f3f4f6]">
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Add a manual save (optional)</label>
              <div className="flex items-center border border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#0E3F2E]">
                <span className="pl-3.5 text-[#9ca3af] text-sm">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={groupINR(manualSave)}
                  onChange={(e) => setManualSave(digitsOnly(e.target.value))}
                  className="flex-1 px-2 py-3 text-sm text-[#111827] outline-none"
                />
              </div>
              <p className="text-xs text-[#9ca3af] mt-1.5">Adds to your saved total and logs a manual entry in your history.</p>
            </div>
          )}
        </div>

        <div className="px-8 py-5 flex items-center gap-3">
          {isEdit && onDelete && (
            <button
              onClick={() => onDelete(initial.id)}
              className="p-2.5 border border-[#fee2e2] text-red-500 rounded-lg hover:bg-[#fef2f2] transition-colors"
              aria-label="Delete goal"
            >
              <Trash2 size={16} />
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-[#e5e7eb] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#f9fafb] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name || !target}
            className="px-6 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isEdit ? 'Save changes' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
