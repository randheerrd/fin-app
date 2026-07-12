import { Search, Home, CreditCard, Target, Sparkles, Settings } from 'lucide-react';
import FinAppLogo from './FinAppLogo';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'spend', label: 'Spend', icon: CreditCard },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'insights', label: 'Insights', icon: Sparkles },
];

export default function Sidebar({ activeView, setActiveView, onSearch }) {
  // Every row shares the same 20px left gutter: outer px-2 (8) + inner px-3 (12).
  return (
    <div className="w-56 bg-[#0E3F2E] flex flex-col h-screen fixed left-0 top-0 z-10 px-2">
      {/* Logo */}
      <div className="h-14 flex items-center px-3">
        <FinAppLogo color="#ffffff" className="h-6 w-auto" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto">
        <button
          onClick={onSearch}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Search size={18} />
          <span>Search</span>
        </button>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-[#1B5740] text-white font-medium' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile → settings */}
      <button
        onClick={() => setActiveView('settings')}
        className="mb-3 flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
      >
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">RK</span>
        </div>
        <span className="text-white text-sm font-medium flex-1 text-left truncate">Randheer Kumar</span>
        <Settings size={15} className="text-white/40" />
      </button>
    </div>
  );
}
