import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Filter, 
  Plus, 
  Heart, 
  Menu, 
  User,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav({
  activeFilterCount = 0,
  bookmarkCount = 0,
  showFavoritesOnly = false,
  onToggleMobileFilter,
  onToggleShowFavorites,
  onOpenAddModal,
  onOpenMobileMenu
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAdmin } = useAuth();

  const isBrowsePath = location.pathname === '/' || location.pathname === '/profiles' || location.pathname === '/browse';
  const isBrowseActive = isBrowsePath && !showFavoritesOnly;
  const isSavedActive = showFavoritesOnly || location.pathname === '/saved' || location.pathname === '/bookmarks';

  const handleBrowseClick = () => {
    if (showFavoritesOnly && onToggleShowFavorites) {
      onToggleShowFavorites();
    }
    if (!isBrowsePath) {
      navigate('/profiles');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFilterClick = () => {
    if (!isBrowsePath) {
      navigate('/profiles');
      setTimeout(() => onToggleMobileFilter?.(), 150);
    } else {
      onToggleMobileFilter?.();
    }
  };

  const handleSavedClick = () => {
    if (onToggleShowFavorites) {
      onToggleShowFavorites();
    } else {
      navigate('/saved');
    }
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 shadow-2xl pb-safe transition-all"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        
        {/* 1. Browse Tab */}
        <button
          onClick={handleBrowseClick}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95 touch-target cursor-pointer ${
            isBrowseActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Browse all candidate proposals"
        >
          <div className="relative">
            <LayoutGrid className={`w-5 h-5 ${isBrowseActive ? 'text-emerald-400' : 'text-slate-400'}`} />
            {isBrowseActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Browse</span>
        </button>

        {/* 2. Filter Tab */}
        <button
          onClick={handleFilterClick}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95 touch-target cursor-pointer ${
            activeFilterCount > 0 ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Filter proposals"
        >
          <div className="relative">
            <Filter className={`w-5 h-5 ${activeFilterCount > 0 ? 'text-emerald-400' : 'text-slate-400'}`} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center shadow-md shadow-emerald-500/40">
                {activeFilterCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">
            {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filters'}
          </span>
        </button>

        {/* 3. Center Action: Add Proposal (+) */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={onOpenAddModal}
            className="w-12 h-12 -mt-5 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-xl shadow-emerald-600/35 border-2 border-slate-950 flex flex-col items-center justify-center active:scale-90 transition-all cursor-pointer group"
            title="Register New Matrimonial Proposal"
            aria-label="Register new proposal"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
            <span className="sr-only">Add Proposal</span>
          </button>
        </div>

        {/* 4. Saved Favorites Tab */}
        <button
          onClick={handleSavedClick}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95 touch-target cursor-pointer ${
            isSavedActive ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="View saved favorite proposals"
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${isSavedActive ? 'fill-rose-400 text-rose-400' : 'text-slate-400'}`} />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {bookmarkCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Saved</span>
        </button>

        {/* 5. Menu Drawer Tab */}
        <button
          onClick={onOpenMobileMenu}
          className="flex-1 flex flex-col items-center justify-center py-1 text-slate-400 hover:text-slate-200 transition-all active:scale-95 touch-target cursor-pointer"
          aria-label="Open navigation and account menu"
        >
          <div className="relative">
            {currentUser ? (
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
            ) : (
              <Menu className="w-5 h-5 text-slate-400" />
            )}
            {isAdmin && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-950" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Menu</span>
        </button>

      </div>
    </nav>
  );
}

