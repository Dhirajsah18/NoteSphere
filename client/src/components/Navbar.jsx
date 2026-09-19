import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  LogOut, 
  User, 
  Menu, 
  X, 
  LayoutGrid, 
  List, 
  BookOpen, 
  ChevronDown,
  ArrowUpDown 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ 
  search, 
  setSearch, 
  sortBy, 
  setSortBy, 
  viewMode, 
  setViewMode, 
  onOpenCreateModal, 
  onToggleSidebar 
}) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-xl border-b border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-none transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* NoteSphere Terracotta & Amber Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer select-none group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-600 to-amber-500 p-0.5 shadow-md shadow-orange-600/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-stone-900 font-sans">
                Note<span className="text-orange-600">Sphere</span>
              </span>
              <span className="text-[10px] text-stone-400 font-semibold tracking-wide -mt-0.5 hidden sm:block">
                Workspace & Notes
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl mx-2 hidden sm:block">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-orange-600 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes by title, content or tags..."
              className="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-stone-100/70 border border-stone-200 text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-orange-600 focus:ring-3 focus:ring-orange-600/15 transition-all shadow-2xs font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Controls, Create Note & Profile */}
        <div className="flex items-center gap-3">
          
          {/* View Mode Toggle */}
          <div className="hidden lg:flex items-center bg-stone-100 border border-stone-200 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-orange-700 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-orange-700 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Compact Sort Dropdown (Desktop) */}
          <div className="hidden sm:flex items-center relative group">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 pointer-events-none group-focus-within:text-orange-600 transition-colors" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort notes by"
              className="appearance-none bg-white border border-stone-200 hover:border-stone-300 text-stone-800 text-xs font-bold py-1.5 pl-7 pr-6 rounded-xl focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600/15 cursor-pointer shadow-2xs transition-all"
            >
              <option value="updated">Recent</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title_asc">A → Z</option>
              <option value="title_desc">Z → A</option>
            </select>
            <ChevronDown className="w-3 h-3 text-stone-400 absolute right-1.5 pointer-events-none" />
          </div>

          {/* Primary Create Button in Terracotta / Amber */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 hover:from-orange-500 hover:to-amber-600 text-white text-xs sm:text-sm font-bold shadow-sm shadow-orange-600/30 transition-all duration-200 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">New Note</span>
          </button>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-stone-100 transition-colors focus:outline-none border border-transparent hover:border-stone-200"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-600 flex items-center justify-center font-extrabold text-white text-xs shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-2 border border-stone-200 shadow-xl z-50 animate-scale-in">
                  <div className="px-3 py-2.5 border-b border-stone-100 mb-1">
                    <p className="text-xs font-extrabold text-stone-900 truncate">{user?.name || 'User'}</p>
                    <p className="text-[11px] text-stone-500 font-medium truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Search & Controls Bar */}
      <div className="p-2.5 border-t border-stone-200 sm:hidden bg-stone-50 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-8 pr-7 py-1.5 rounded-xl text-xs bg-white border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-600 font-medium shadow-2xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Sort Dropdown */}
        <div className="relative flex items-center flex-shrink-0">
          <ArrowUpDown className="w-3 h-3 text-stone-500 absolute left-2 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort notes on mobile"
            className="appearance-none bg-white border border-stone-200 text-stone-800 text-[11px] font-bold py-1.5 pl-6 pr-5 rounded-xl focus:outline-none focus:border-orange-600 cursor-pointer shadow-2xs"
          >
            <option value="updated">Recent</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title_asc">A → Z</option>
            <option value="title_desc">Z → A</option>
          </select>
          <ChevronDown className="w-2.5 h-2.5 text-stone-400 absolute right-1.5 pointer-events-none" />
        </div>

        {/* Mobile View Mode Toggle */}
        <div className="flex items-center bg-white border border-stone-200 rounded-xl p-0.5 flex-shrink-0">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-1 rounded-lg text-stone-700 hover:text-orange-600"
            title="Toggle View Mode"
          >
            {viewMode === 'grid' ? <List className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
