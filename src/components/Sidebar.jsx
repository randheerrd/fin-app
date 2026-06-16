import { BarChart3, TrendingUp, Target, Eye, RefreshCw, Settings, Search } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'spend', label: 'Spend', icon: TrendingUp },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'recurring', label: 'Recurring', icon: RefreshCw },
  { id: 'insights', label: 'Insights', icon: Eye },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeView, setActiveView, onAddExpense }) {
  return (
    <div className="w-64 bg-sidebar text-white flex flex-col h-screen fixed left-0 top-0">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-hover">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-sidebar font-bold text-lg">≡</span>
          </div>
          <h1 className="font-serif text-xl font-bold">FinApp</h1>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-sidebar-light" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-sidebar-hover text-white rounded-lg placeholder-sidebar-light text-sm outline-none"
          />
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sidebar-light text-white'
                  : 'text-sidebar-light hover:bg-sidebar-hover'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-hover p-4">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-hover transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-sidebar-light rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">RK</span>
          </div>
          <div className="text-left">
            <p className="font-medium text-sm">Randheer Kumar</p>
            <p className="text-xs text-sidebar-light">View profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}
