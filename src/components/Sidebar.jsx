import { Search, Home, MessageSquare, LayoutGrid, Bookmark, PanelLeftClose, ChevronsUpDown } from 'lucide-react';
import FinAppLogo from './FinAppLogo';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'spend', label: 'Spend', icon: MessageSquare },
  { id: 'goals', label: 'Goals', icon: LayoutGrid },
  { id: 'insights', label: 'Insights', icon: Bookmark },
];

export default function Sidebar({ activeView, setActiveView, onRestart }) {
  return (
    <div className="w-56 bg-[#0E3F2E] flex flex-col h-screen fixed left-0 top-0 z-10">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5">
        <FinAppLogo color="#ffffff" className="h-6 w-auto" />
        <PanelLeftClose size={16} className="text-white/50" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors">
          <Search size={17} />
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
              <Icon size={17} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Restart (demo helper) */}
      <button
        onClick={onRestart}
        className="text-white/25 text-xs hover:text-white/50 py-1 transition-colors text-center"
      >
        Restart demo
      </button>

      {/* Profile → settings */}
      <button
        onClick={() => setActiveView('settings')}
        className="m-3 flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">RK</span>
        </div>
        <span className="text-white text-sm font-medium flex-1 text-left">Randheer Kumar</span>
        <ChevronsUpDown size={15} className="text-white/40" />
      </button>
    </div>
  );
}
