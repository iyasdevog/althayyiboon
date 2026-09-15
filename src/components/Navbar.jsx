import React, { useState } from 'react';
import { Heart, UserPlus, Filter, ShieldCheck, Lock, X, BadgeCheck, Gift } from 'lucide-react';

export default function Navbar({ 
  onOpenAddModal, 
  totalProfiles, 
  onToggleMobileFilter, 
  activeFilterCount,
  onOpenAdminPortal,
  bookmarkCount = 0,
  showFavoritesOnly = false,
  onToggleShowFavorites
}) {
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <header className="sticky top-0 z-40">
      
      {/* ===== FREE SERVICES ANNOUNCEMENT BANNER ===== */}
      {bannerVisible && (
        <div className="free-banner animate-slide-down border-b border-emerald-700/50">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Gift className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <p className="text-[11px] sm:text-xs font-semibold text-emerald-100 truncate leading-relaxed">
                <span className="font-extrabold text-white">🎉 100% FREE</span>
                <span className="hidden xs:inline"> — All services on Al-ThayyiBoon are completely free. We do </span>
                <span className="xs:hidden"> — We do </span>
                <span className="font-bold text-amber-300">NOT</span>
                {' '}request payment for any service. No subscriptions. No hidden fees. Ever.
              </p>
            </div>
            <button
              onClick={() => setBannerVisible(false)}
              className="shrink-0 p-1.5 rounded-full text-emerald-300 hover:text-white hover:bg-emerald-800/60 transition-colors touch-target"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ===== MAIN NAVBAR ===== */}
      <div className="glass-panel border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            
            {/* Logo & Branding */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 p-0.5 shadow-lg shadow-emerald-900/30 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[12px] sm:rounded-[14px] flex items-center justify-center">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 fill-emerald-400/20" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-200 to-amber-300 bg-clip-text text-transparent truncate">
                    Al-ThayyiBoon
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                    <ShieldCheck className="w-3 h-3" /> Community Directory
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:block">
                  Open-Source Matrimony Directory • <span className="text-emerald-400 font-bold">Zero Cost</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">

              {/* Mobile Filter Toggle */}
              <button
                id="mobile-filter-toggle"
                onClick={onToggleMobileFilter}
                className="lg:hidden relative inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors touch-target"
                aria-label="Open filters"
              >
                <Filter className="w-4 h-4 text-emerald-400" />
                <span className="hidden xs:inline">Filter</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center shadow-md">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Favorites / Bookmarked Toggle Button */}
              <button
                onClick={onToggleShowFavorites}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all touch-target ${
                  showFavoritesOnly
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold shadow-md shadow-rose-500/10'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="View Saved Bookmarked Proposals"
                aria-label="View Saved Bookmarked Proposals"
              >
                <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly || bookmarkCount > 0 ? 'text-rose-400 fill-rose-400' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">Saved</span>
                {bookmarkCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              {/* Active Count Badge — Desktop Only */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                <span>{totalProfiles} Active</span>
              </div>

              {/* FREE Badge — Mobile visible */}
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[10px] sm:text-xs font-bold whitespace-nowrap">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden xs:inline">FREE</span>
              </div>

              {/* Admin Portal Button */}
              <button
                id="admin-portal-btn"
                onClick={onOpenAdminPortal}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors touch-target"
                title="Admin Moderation Portal"
                aria-label="Open admin portal"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Admin</span>
              </button>

              {/* Add Profile CTA Button */}
              <button
                id="add-profile-btn"
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] touch-target whitespace-nowrap"
                aria-label="Add matrimony profile"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden xs:inline">Add Profile</span>
                <span className="xs:hidden">Add</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
