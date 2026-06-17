import { useState } from 'react';
import { Shield, LogOut, Plus } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { bankBrand } from '../../lib/logos';
import { groupINR, digitsOnly } from '../../lib/utils';
import AddBankModal from '../modals/AddBankModal';

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? 'bg-[#0E3F2E]' : 'bg-[#d1d5db]'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide px-6 pt-5 pb-3">
      {children}
    </p>
  );
}

export default function Settings({
  income,
  setIncome,
  budget,
  setBudget,
  banks,
  setBanks,
  transactions,
  setTransactions,
  onLogout,
  startInEdit = false,
}) {
  const [showAddBank, setShowAddBank] = useState(false);
  const handleAddBank = (data) => {
    setBanks((prev) => [...prev, { name: data.name, type: data.type, mask: data.mask, synced: 'just now' }]);
    setShowAddBank(false);
  };
  // Saved profile (read-only by default) vs the editable draft.
  const [profile, setProfile] = useState({
    fullName: 'Randheer Kumar',
    email: '',
    mobile: '+91 7346432221',
    city: '',
  });
  // Open straight into edit mode when launched from the dashboard income/budget prompt.
  const [editingProfile, setEditingProfile] = useState(startInEdit);
  const [draft, setDraft] = useState({ ...profile, income: income > 0 ? String(income) : '', budget: budget > 0 ? String(budget) : '' });

  const startEdit = () => {
    setDraft({ ...profile, income: income > 0 ? String(income) : '', budget: budget > 0 ? String(budget) : '' });
    setEditingProfile(true);
  };
  const saveProfile = () => {
    setProfile({ fullName: draft.fullName, email: draft.email, mobile: draft.mobile, city: draft.city });
    setIncome(parseFloat(draft.income) || income);
    setBudget(parseFloat(draft.budget) || budget);
    setEditingProfile(false);
  };

  const [notifications, setNotifications] = useState({
    weekly: true,
    budget: true,
    goal: true,
  });
  const [pausedBanks, setPausedBanks] = useState({});

  const [removeConfirm, setRemoveConfirm] = useState(null);

  const handleRemoveBank = (idx) => {
    setBanks((prev) => prev.filter((_, i) => i !== idx));
    setRemoveConfirm(null);
  };

  const togglePause = (idx) => {
    setPausedBanks((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleExportCSV = () => {
    if (!transactions.length) return;
    const headers = ['Date', 'Merchant', 'Category', 'Amount'];
    const rows = transactions.map((t) => [t.date, t.merchant, t.category, t.amount]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finapp-transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm text-[#111827] bg-white border border-[#e5e7eb] rounded-lg outline-none focus:border-[#0E3F2E] transition-colors placeholder:text-[#9ca3af]';
  const cardClass = 'border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] bg-white';

  return (
    <div className="min-h-full bg-white px-8 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-[#0E3F2E] rounded-full flex items-center justify-center mb-3">
            <span className="text-white font-bold">RK</span>
          </div>
          <p className="font-display text-2xl text-[#111827]">{profile.fullName || 'Your name'}</p>
          <p className="text-sm text-[#9ca3af] mt-0.5">Member since June 2026</p>
        </div>

        <div className="space-y-6">
          {/* Profile — read-only view by default, explicit edit mode */}
          <div className={`${cardClass} p-6`}>
            {!editingProfile ? (
              <>
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm font-semibold text-[#111827]">Profile</p>
                  <button
                    onClick={startEdit}
                    className="px-4 py-2 border border-[#e5e7eb] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#f9fafb] transition-colors"
                  >
                    Edit profile
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                  {[
                    { label: 'Full Name', value: profile.fullName || '—' },
                    { label: 'Email Address', value: profile.email || '—' },
                    { label: 'Mobile No', value: profile.mobile || '—' },
                    { label: 'City', value: profile.city || '—' },
                    { label: 'Monthly Income', value: income > 0 ? `₹${income.toLocaleString('en-IN')}` : '—' },
                    { label: 'Monthly Budget', value: budget > 0 ? `₹${budget.toLocaleString('en-IN')}` : '—' },
                  ].map((f) => (
                    <div key={f.label}>
                      <p className="text-xs text-[#9ca3af] mb-1">{f.label}</p>
                      <p className="text-sm font-medium text-[#111827]">{f.value}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Full Name</label>
                    <input
                      value={draft.fullName}
                      onChange={(e) => setDraft((d) => ({ ...d, fullName: e.target.value }))}
                      className={inputClass}
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={draft.email}
                      onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                      className={inputClass}
                      placeholder="randheerkumar149@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Mobile No</label>
                    <input
                      value={draft.mobile}
                      disabled
                      readOnly
                      className={`${inputClass} bg-[#f9fafb] text-[#9ca3af] cursor-not-allowed`}
                    />
                    <p className="text-xs text-[#9ca3af] mt-1">Your phone number can't be changed.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">City</label>
                    <input
                      value={draft.city}
                      onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
                      className={inputClass}
                      placeholder="Enter City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Monthly Income</label>
                    <div className="flex items-center border border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#0E3F2E]">
                      <span className="pl-3.5 text-[#9ca3af] text-sm">₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={groupINR(draft.income)}
                        onChange={(e) => setDraft((d) => ({ ...d, income: digitsOnly(e.target.value) }))}
                        className="flex-1 px-2 py-2.5 text-sm text-[#111827] outline-none bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Monthly Budget</label>
                    <div className="flex items-center border border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#0E3F2E]">
                      <span className="pl-3.5 text-[#9ca3af] text-sm">₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={groupINR(draft.budget)}
                        onChange={(e) => setDraft((d) => ({ ...d, budget: digitsOnly(e.target.value) }))}
                        className="flex-1 px-2 py-2.5 text-sm text-[#111827] outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => setEditingProfile(false)}
                    className="px-5 py-2.5 border border-[#e5e7eb] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#f9fafb] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    className="px-5 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className={cardClass}>
            <SectionLabel>Notifications</SectionLabel>
            <div className="px-6 pb-5 space-y-5">
              {[
                {
                  key: 'weekly',
                  title: 'Weekly spend summary',
                  sub: 'Every Sunday evening, your week in numbers',
                },
                {
                  key: 'budget',
                  title: 'Budget alert',
                  sub: 'When you hit 75% of your monthly budget',
                },
                {
                  key: 'goal',
                  title: 'Goal progress nudge',
                  sub: 'When a goal needs attention or hits a milestone',
                },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#111827]">{n.title}</p>
                    <p className="text-xs text-[#9ca3af] mt-0.5">{n.sub}</p>
                  </div>
                  <Toggle
                    checked={notifications[n.key]}
                    onChange={(v) => setNotifications((prev) => ({ ...prev, [n.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Linked accounts */}
          <div className={cardClass}>
            <SectionLabel>Linked Accounts</SectionLabel>
            <div className="px-6 pb-5">
              {banks.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-[#9ca3af] text-sm mb-4">No bank connected</p>
                  <button
                    onClick={() => setShowAddBank(true)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#374151] hover:text-[#111827] transition-colors"
                  >
                    <Plus size={15} className="text-[#9ca3af]" />
                    Link a bank
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {banks.map((bank, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-3 border border-[#f3f4f6] rounded-xl"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <BrandLogo domain={bankBrand(bank.name).domain} label={bank.name} bg={bankBrand(bank.name).bg} size={40} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#111827] truncate">
                            {bank.name} · {bank.type}
                          </p>
                          <p className="text-xs text-[#9ca3af] truncate">
                            {pausedBanks[idx]
                              ? 'Paused — not importing new transactions'
                              : `${bank.mask} · synced ${bank.synced || 'recently'}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setRemoveConfirm(idx)}
                          className="px-3 py-1.5 text-sm font-medium text-red-500 border border-[#fee2e2] rounded-lg hover:bg-[#fef2f2] transition-colors"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => togglePause(idx)}
                          className="px-3 py-1.5 text-sm font-medium text-[#374151] border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors"
                        >
                          {pausedBanks[idx] ? 'Resume' : 'Pause'}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowAddBank(true)}
                    className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-[#374151] hover:text-[#111827] transition-colors"
                  >
                    <Plus size={15} className="text-[#9ca3af]" />
                    Link another bank
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Data & privacy */}
          <div className={cardClass}>
            <SectionLabel>Data &amp; Privacy</SectionLabel>
            <div className="px-6 pb-5 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#111827]">Export my data</p>
                  <p className="text-xs text-[#9ca3af] mt-0.5">A full CSV of every transaction, yours to keep.</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  disabled={!transactions.length}
                  className="px-4 py-2 text-sm font-medium text-[#374151] border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Export CSV
                </button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#111827]">Delete all transactions</p>
                  <p className="text-xs text-[#9ca3af] mt-0.5">
                    Separate from bank management, destructive actions never sit beside frequent ones.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Delete all transactions? This cannot be undone.')) setTransactions([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-500 border border-[#fee2e2] rounded-lg hover:bg-[#fef2f2] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Protection footer */}
          <div className="bg-[#f0f7f3] rounded-2xl px-6 py-5 flex gap-3">
            <Shield size={18} className="text-[#0E3F2E] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#111827] mb-1">Your money data is protected</p>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Connections run through RBI's regulated Account Aggregator network with 256-bit encryption.
                Access is read-only — we can see transactions, never move money. Your bank credentials never
                touch our servers, and you can revoke any connection in one tap.
              </p>
            </div>
          </div>

          {/* Logout */}
          {onLogout && (
            <div className="pt-1">
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#fde0e0] text-red-500 text-sm font-medium rounded-lg hover:bg-[#fef2f2] transition-colors"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {removeConfirm !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#e5e7eb] rounded-xl max-w-sm w-full p-6 shadow-lg">
            <h3 className="font-semibold text-[#111827] mb-2">Remove bank?</h3>
            <p className="text-sm text-[#6b7280] mb-6">
              No new transactions will be imported. Your {transactions.length} existing transactions stay
              intact.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setRemoveConfirm(null)}
                className="w-full py-2.5 border border-[#e5e7eb] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#f9fafb] transition-colors"
              >
                Keep &amp; don't remove
              </button>
              <button
                onClick={() => handleRemoveBank(removeConfirm)}
                className="w-full py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove bank
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddBank && <AddBankModal onClose={() => setShowAddBank(false)} onAdd={handleAddBank} />}
    </div>
  );
}
