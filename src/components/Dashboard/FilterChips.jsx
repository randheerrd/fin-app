import { CATEGORIES } from '../../data/categories';

export default function FilterChips({ categories, activeFilter, onSelectCategory }) {
  return (
    <div className="px-8 py-6 border-b border-neutral-700 flex gap-3 overflow-x-auto">
      {categories.map(item => {
        const cat = CATEGORIES.find(c => c.id === item.category);
        const isActive = activeFilter === item.category;
        return (
          <button
            key={item.category}
            onClick={() => onSelectCategory(isActive ? null : item.category)}
            className={`px-4 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 ${
              isActive
                ? 'bg-emerald text-bg shadow-md'
                : 'bg-bg-secondary border border-neutral-700 text-text-secondary hover:border-neutral-600'
            }`}
          >
            {cat?.emoji} {cat?.name}
          </button>
        );
      })}
    </div>
  );
}
