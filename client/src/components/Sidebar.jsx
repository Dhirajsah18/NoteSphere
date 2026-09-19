import React from 'react';
import { 
  Pin, 
  User, 
  Briefcase, 
  GraduationCap, 
  MoreHorizontal, 
  Layers, 
  X
} from 'lucide-react';

export const Sidebar = ({ 
  selectedCategory, 
  setSelectedCategory, 
  categoryCounts = {}, 
  isOpen, 
  onClose, 
  isPinnedFilter, 
  setIsPinnedFilter 
}) => {
  const categories = [
    { id: 'All', label: 'All Notes', icon: Layers, countKey: 'all', color: 'text-orange-600' },
    { id: 'Personal', label: 'Personal', icon: User, countKey: 'Personal', color: 'text-orange-700' },
    { id: 'Work', label: 'Work', icon: Briefcase, countKey: 'Work', color: 'text-emerald-700' },
    { id: 'Study', label: 'Study', icon: GraduationCap, countKey: 'Study', color: 'text-amber-600' },
    { id: 'Other', label: 'Other', icon: MoreHorizontal, countKey: 'Other', color: 'text-stone-600' },
  ];

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setIsPinnedFilter(false);
    if (onClose) onClose();
  };

  const handleSelectPinned = () => {
    setIsPinnedFilter(!isPinnedFilter);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container - Docked to left */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 left-0 z-40 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-64 bg-white border-r border-stone-200/90 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out flex-shrink-0 shadow-[1px_0_4px_rgba(0,0,0,0.02)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between md:hidden pb-3 border-b border-stone-200">
            <span className="font-extrabold text-sm text-stone-800">Navigation</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category List */}
          <div>
            <div className="px-3 mb-2.5 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-stone-400">
                Categories
              </span>
              <span className="text-[11px] text-stone-500 font-bold">
                {categoryCounts.all || 0} Total
              </span>
            </div>

            <nav className="space-y-1.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id && !isPinnedFilter;
                const count = categoryCounts[cat.countKey] || 0;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group relative ${
                      isSelected
                        ? 'bg-orange-50 text-orange-900 border-l-4 border-l-orange-600 border-y border-r border-orange-200 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-orange-600' : cat.color} transition-transform group-hover:scale-110`} />
                      <span>{cat.label}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border ${
                        isSelected
                          ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Filters */}
          <div>
            <div className="px-3 mb-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-stone-400">
                Quick Filters
              </span>
            </div>

            <button
              onClick={handleSelectPinned}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isPinnedFilter
                  ? 'bg-amber-50 text-amber-900 border-l-4 border-l-amber-500 border-y border-r border-amber-200 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Pin className={`w-4 h-4 ${isPinnedFilter ? 'text-amber-600 fill-amber-600' : 'text-amber-500'}`} />
                <span>Pinned Notes</span>
              </div>
              <span
                className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border ${
                  isPinnedFilter
                    ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                    : 'bg-stone-100 text-stone-600 border-stone-200'
                }`}
              >
                {categoryCounts.Pinned || 0}
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
