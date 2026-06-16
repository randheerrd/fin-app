import { CATEGORIES } from '../../data/categories';

export default function FilterChips({ categories, activeFilter, onSelectCategory }) {
  return (
    <div className="px-8 py-6 border-b border-line flex gap-3 overflow-x-auto">
      {categories.map(item => {
        const cat = CATEGORIES.find(c => c.id === item.category);
        const isActive = activeFilter === item.category;
        return (
          <button
            key={item.category}
            onClick={() => onSelectCategory(isActive ? null : item.category)}
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-sage text-bg'
                : 'bg-bg-card border border-line text-text-dim hover:bg-bg-raise'
            }`}
          >
            {cat?.emoji} {cat?.name}
          </button>
        );
      })}
    </div>
  );
}
