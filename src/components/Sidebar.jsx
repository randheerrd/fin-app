import { Plus, BarChart3, TrendingUp, Eye, RefreshCw, Settings, RotateCcw } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

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
    <div className="w-64 bg-bg-secondary border-r border-neutral-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-neutral-700">
        <h1 className="font-serif text-2xl font-bold text-emerald-light">Fin-app</h1>
        <p className="text-text-tertiary text-sm mt-1">Financial clarity</p>
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald text-bg shadow-md'
                  : 'text-text-secondary hover:bg-bg-tertiary'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="border-t border-neutral-700 p-4 space-y-2">
        <button
          onClick={onAddExpense}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald text-bg rounded-lg text-sm font-semibold hover:bg-emerald-dark transition-all duration-200 shadow-md"
        >
          <Plus size={18} />
          <span>Add Expense</span>
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-bg-tertiary text-text-secondary rounded-lg text-sm font-medium hover:bg-neutral-700 transition-all duration-200">
              <RotateCcw size={18} />
              <span>Menu</span>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-bg-secondary border border-neutral-700 rounded-lg shadow-lg p-2 z-50 min-w-max"
              sideOffset={5}
            >
              <DropdownMenu.Item
                onClick={onRestart}
                className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded cursor-pointer transition-colors"
              >
                Restart Demo
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}
