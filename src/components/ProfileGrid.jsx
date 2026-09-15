import React from 'react';
import ProfileCard from './ProfileCard';
import AdUnit from './AdUnit';
import { Sparkles, SlidersHorizontal, AlertCircle, RefreshCw, Heart, X } from 'lucide-react';

export default function ProfileGrid({ 
  profiles, 
  onSelectProfile, 
  bookmarks, 
  onToggleBookmark, 
  onResetFilters,
  sortBy,
  setSortBy,
  onOpenEditModal,
  showFavoritesOnly,
  onToggleShowFavorites,
  onShowToast
}) {
  return (
    <div className="flex-1 space-y-3 sm:space-y-5 min-w-0">
      
      {/* Favorites Mode Active Banner */}
      {showFavoritesOnly && (
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3 text-xs text-rose-200 animate-fade-in">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />
            <span>
              Showing your <strong className="text-white font-bold">Saved Favorites</strong> ({profiles.length} proposals)
            </span>
          </div>
          <button
            onClick={onToggleShowFavorites}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-semibold transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>View All</span>
          </button>
        </div>
      )}

      {/* Grid Top Bar: Counter & Sorting */}
      <div className="flex items-center justify-between gap-2 bg-slate-900/60 px-3 py-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-slate-200">
            <span className="text-emerald-400 font-bold">{profiles.length}</span>
            <span className="ml-1">{showFavoritesOnly ? 'Saved Proposals' : 'Proposals'}</span>
          </span>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3 h-3 text-slate-500 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-950 text-white text-xs font-medium py-1 px-2 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500"
          >
            <option value="newest">Newest First</option>
            <option value="ageAsc">Youngest First</option>
            <option value="ageDesc">Eldest First</option>
          </select>
        </div>
      </div>

      {/* Profile Cards Grid */}
      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
          {profiles.map((profile, idx) => (
            <React.Fragment key={profile.id}>
              <ProfileCard
                profile={profile}
                onSelectProfile={onSelectProfile}
                isBookmarked={bookmarks.includes(profile.id)}
                onToggleBookmark={onToggleBookmark}
                onOpenEditModal={onOpenEditModal}
                onShowToast={onShowToast}
              />
              {/* ── AD SLOT: Mid-feed after every 6 cards ───────────────────────
                  When ready: uncomment below and set your slot ID
                  {(idx + 1) % 6 === 0 && idx + 1 < profiles.length && (
                    <div className="col-span-1 sm:col-span-2 xl:col-span-3">
                      <AdUnit slot="YOUR_SLOT_ID" format="horizontal" className="w-full py-1" />
                    </div>
                  )}
              ──────────────────────────────────────────────────────────────── */}
            </React.Fragment>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-6 sm:my-12 border border-slate-800">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-900 text-amber-400 mx-auto flex items-center justify-center mb-3 border border-slate-800">
            {showFavoritesOnly ? <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400 fill-rose-400/20" /> : <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8" />}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-2">
            {showFavoritesOnly ? 'No Saved Proposals' : 'No Proposals Found'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-5">
            {showFavoritesOnly
              ? 'You have not saved any proposal favorites yet. Click the heart icon on any proposal card to bookmark proposals here!'
              : 'No listings match your current filters. Try loosening some filters or clearing your search.'}
          </p>
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{showFavoritesOnly ? 'View All Proposals' : 'Reset All Filters'}</span>
          </button>
        </div>
      )}

    </div>
  );
}
