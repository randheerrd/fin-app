import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  X,
  ArrowRight,
  CornerDownLeft,
  Plus,
  Home,
  CreditCard,
  Target,
  Sparkles,
  Settings as SettingsIcon,
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import MerchantLogo from './MerchantLogo';

const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || 'Other';

const PAGES = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'spend', label: 'Spend', icon: CreditCard },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'insights', label: 'Insights', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

function SectionLabel({ children }) {
  return (
    <p className="px-4 pt-3 pb-1.5 text-[11px] uppercase tracking-wide text-[#9ca3af] font-semibold">
      {children}
    </p>
  );
}

function Row({ idx, active, onActivate, onSelect, children }) {
  return (
    <button
      data-active={idx === active}
      onMouseMove={() => onActivate(idx)}
      onClick={() => onSelect(idx)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
        idx === active ? 'bg-[#F0F7F3]' : 'hover:bg-[#f9fafb]'
      }`}
    >
      {children}
    </button>
  );
}

// Rank a merchant group against the query: prefix > word-start > substring.
function scoreMerchant(group, q) {
  const m = group.merchant.toLowerCase();
  const c = catName(group.category).toLowerCase();
  if (m.startsWith(q)) return 100;
  if (m.split(/\s+/).some((w) => w.startsWith(q))) return 80;
  if (m.includes(q)) return 60;
  if (c.startsWith(q)) return 40;
  if (c.includes(q)) return 20;
  return 0;
}

export default function SearchModal({ transactions, onClose, onNavigate, onOpenMerchant, onAddExpense }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const query = q.trim().toLowerCase();
  const listRef = useRef(null);

  // Collapse transactions into merchant groups (count + total + recency).
  const groups = useMemo(() => {
    const map = new Map();
    for (const t of transactions) {
      const g = map.get(t.merchant) || {
        merchant: t.merchant,
        category: t.category,
        count: 0,
        total: 0,
        last: '',
      };
      g.count += 1;
      g.total += t.amount;
      if (t.date > g.last) g.last = t.date;
      map.set(t.merchant, g);
    }
    return [...map.values()];
  }, [transactions]);

  // Transaction results: ranked when searching, most recent/biggest when idle.
  const merchantResults = useMemo(() => {
    if (!query) {
      return [...groups].sort((a, b) => (b.last > a.last ? 1 : b.total - a.total)).slice(0, 4);
    }
    return groups
      .map((g) => ({ g, s: scoreMerchant(g, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || b.g.count - a.g.count)
      .slice(0, 6)
      .map((x) => x.g);
  }, [groups, query]);

  const pageResults = useMemo(
    () => (query ? PAGES.filter((p) => p.label.toLowerCase().includes(query)) : PAGES),
    [query]
  );

  const actionResults = useMemo(() => {
    const all = [{ id: 'add-expense', label: 'Add expense', icon: Plus, run: onAddExpense }];
    return query ? all.filter((a) => a.label.toLowerCase().includes(query)) : all;
  }, [query, onAddExpense]);

  // Flat, ordered list of selectable items for keyboard navigation.
  const items = useMemo(() => {
    const out = [];
    merchantResults.forEach((g) =>
      out.push({ type: 'merchant', key: `m-${g.merchant}`, data: g, run: () => onOpenMerchant(g.merchant) })
    );
    pageResults.forEach((p) =>
      out.push({ type: 'page', key: `p-${p.id}`, data: p, run: () => onNavigate(p.id) })
    );
    actionResults.forEach((a) =>
      out.push({ type: 'action', key: `a-${a.id}`, data: a, run: a.run })
    );
    return out;
  }, [merchantResults, pageResults, actionResults, onOpenMerchant, onNavigate]);

  const select = (idx) => {
    const it = items[idx];
    if (!it) return;
    it.run();
    onClose();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      select(active);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Scroll the active row into view.
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  // Section offsets into the flat `items` list (merchants, then pages, then actions).
  const pageOffset = merchantResults.length;
  const actionOffset = pageOffset + pageResults.length;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-4 pt-28"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-[#f3f4f6]">
          <Search size={18} className="text-[#9ca3af]" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search transactions, pages, actions…"
            className="flex-1 py-4 text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
          />
          <button onClick={onClose} className="p-1.5 hover:bg-[#f3f4f6] rounded-lg transition-colors">
            <X size={16} className="text-[#6b7280]" />
          </button>
        </div>

        <div ref={listRef} className="max-h-96 overflow-y-auto pb-2">
          {items.length === 0 && (
            <p className="px-4 py-8 text-sm text-[#9ca3af] text-center">No matches for “{q}”.</p>
          )}

          {merchantResults.length > 0 && (
            <>
              <SectionLabel>{query ? 'Transactions' : 'Recent'}</SectionLabel>
              {merchantResults.map((g, i) => {
                const idx = i;
                return (
                  <Row key={`m-${g.merchant}`} idx={idx} active={active} onActivate={setActive} onSelect={select}>
                    <MerchantLogo name={g.merchant} size={34} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111827] truncate">{g.merchant}</p>
                      <p className="text-xs text-[#9ca3af]">
                        {g.count} {g.count === 1 ? 'txn' : 'txns'} · {catName(g.category)}
                      </p>
                    </div>
                  </Row>
                );
              })}
            </>
          )}

          {pageResults.length > 0 && (
            <>
              <SectionLabel>Go to</SectionLabel>
              {pageResults.map((p, i) => {
                const idx = pageOffset + i;
                const Icon = p.icon;
                return (
                  <Row key={`p-${p.id}`} idx={idx} active={active} onActivate={setActive} onSelect={select}>
                    <span className="w-[34px] h-[34px] rounded-lg bg-[#f3f4f6] flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-[#374151]" />
                    </span>
                    <span className="flex-1 text-sm font-medium text-[#111827]">{p.label}</span>
                    <ArrowRight size={15} className="text-[#9ca3af]" />
                  </Row>
                );
              })}
            </>
          )}

          {actionResults.length > 0 && (
            <>
              <SectionLabel>Actions</SectionLabel>
              {actionResults.map((a, i) => {
                const idx = actionOffset + i;
                const Icon = a.icon;
                return (
                  <Row key={`a-${a.id}`} idx={idx} active={active} onActivate={setActive} onSelect={select}>
                    <span className="w-[34px] h-[34px] rounded-lg bg-[#f3f4f6] flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-[#374151]" />
                    </span>
                    <span className="flex-1 text-sm font-medium text-[#111827]">{a.label}</span>
                  </Row>
                );
              })}
            </>
          )}
        </div>

        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[#f3f4f6] text-[11px] text-[#9ca3af]">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[#f3f4f6] rounded">↑</kbd>
            <kbd className="px-1.5 py-0.5 bg-[#f3f4f6] rounded">↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[#f3f4f6] rounded">
              <CornerDownLeft size={11} />
            </kbd>
            select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[#f3f4f6] rounded">esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
