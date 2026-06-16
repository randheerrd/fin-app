import { BarChart3, TrendingUp, Target, Eye, RefreshCw, Settings, Plus } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'spend', label: 'Transactions', icon: TrendingUp },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'recurring', label: 'Recurring', icon: RefreshCw },
  { id: 'insights', label: 'Insights', icon: Eye },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeView, setActiveView, onAddExpense, onRestart }) {
  return (
    <div className="w-56 bg-[#1B3A2F] flex flex-col h-screen fixed left-0 top-0 z-10">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <img src="/logo.svg" alt="FinApp" className="h-7 w-auto" />
      </div>

      {/* User */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">RK</span>
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-tight">Randheer Kumar</p>
            <p className="text-white/40 text-xs">Member since June 2026</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Add expense button */}
      <div className="px-4 py-3 border-t border-white/10">
        <button
          onClick={onAddExpense}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-[#1B3A2F] text-sm font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all"
        >
          <Plus size={15} />
          Add Expense
        </button>
      </div>

      {/* Restart */}
      <div className="px-4 pb-4">
        <button
          onClick={onRestart}
          className="w-full text-white/30 text-xs hover:text-white/50 py-1 transition-colors text-center"
        >
          Restart demo
        </button>
      </div>
    </div>
  );
}
