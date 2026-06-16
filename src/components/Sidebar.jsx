import { Plus, BarChart3, TrendingUp, RefreshCw, Eye, Settings, RotateCcw } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'spend', label: 'Spend', icon: TrendingUp },
  { id: 'goals', label: 'Goals', icon: Eye },
  { id: 'recurring', label: 'Recurring', icon: RefreshCw },
  { id: 'insights', label: 'Insights', icon: Eye },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeView, setActiveView, onAddExpense, onRestart }) {
  return (
    <div className="w-[216px] bg-bg-raise border-r border-line flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-line">
        <h1 className="font-serif text-2xl text-text-primary">Fin-app</h1>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sage text-bg'
                  : 'text-text-dim hover:bg-bg-card'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="border-t border-line p-4 space-y-2">
        <button
          onClick={onAddExpense}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sage text-bg rounded-lg text-sm font-medium hover:bg-sage/90 transition-colors"
        >
          <Plus size={18} />
          <span>N for expense</span>
        </button>
        <button
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-text-dim hover:bg-bg-card rounded-lg text-sm font-medium transition-colors"
        >
          <RotateCcw size={18} />
          <span>Restart</span>
        </button>
      </div>
    </div>
  );
}
