import React from 'react';
import ProfileCard from './ProfileCard';
import { SlidersHorizontal, RefreshCw, Heart, X, Filter } from 'lucide-react';

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
  onShowToast,
  onOpenPosterModal,
  showCountNumber = true
}) {
  return (
    <section aria-label="Proposals directory" className="flex-1 space-y-3 sm:space-y-4 min-w-0">
      
      {/* Favorites Mode Active Banner */}
      {showFavoritesOnly && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3 text-xs text-rose-200 animate-fade-in">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />
            <span>
              Viewing your <strong className="text-white font-bold">Saved Favorites</strong> ({profiles.length} proposals)
            </span>
          </div>
          <button
            onClick={onToggleShowFavorites}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors shadow-sm"
          >
            <X className="w-3.5 h-3.5" />
            <span>View All Directory</span>
          </button>
        </div>
      )}

      {/* Grid Top Bar: Counter & Sorting */}
      <div className="flex items-center justify-between gap-2 bg-slate-900/70 backdrop-blur-md px-3 py-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></div>
          <span className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
            {showCountNumber ? (
              <>
                <span className="text-emerald-400 font-extrabold text-sm sm:text-base">{profiles.length}</span>
                <span className="ml-1 text-slate-400">
                  <span className="sm:hidden">{showFavoritesOnly ? 'Saved' : 'Proposals'}</span>
                  <span className="hidden sm:inline">{showFavoritesOnly ? 'Saved Proposals' : 'Matching Proposals Found'}</span>
                </span>
              </>
            ) : (
              <span className="text-emerald-300 font-bold">
                {showFavoritesOnly ? 'Saved Proposals' : 'Verified Proposals Directory'}
              </span>
            )}
          </span>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden xs:inline" />
          <label htmlFor="sort-proposals" className="text-xs text-slate-400 hidden sm:inline">Sort:</label>
          <select
            id="sort-proposals"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-950 text-white text-[11px] sm:text-xs font-medium py-1.5 px-2 sm:px-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm"
            aria-label="Sort proposals"
          >
            <option value="newest">Newest First</option>
            <option value="ageAsc">Youngest</option>
            <option value="ageDesc">Eldest</option>
          </select>
        </div>
      </div>

      {/* Profile Cards Grid */}
      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-5">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onSelectProfile={onSelectProfile}
              isBookmarked={bookmarks.includes(profile.id)}
              onToggleBookmark={onToggleBookmark}
              onOpenEditModal={onOpenEditModal}
              onShowToast={onShowToast}
              onOpenPosterModal={onOpenPosterModal}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-3xl p-8 sm:p-14 text-center max-w-lg mx-auto my-6 sm:my-12 border border-slate-800 shadow-2xl animate-fade-in">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900/90 text-amber-400 mx-auto flex items-center justify-center mb-4 border border-slate-800 shadow-inner">
            {showFavoritesOnly ? (
              <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-rose-400 fill-rose-400/20" />
            ) : (
              <Filter className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
            {showFavoritesOnly ? 'No Saved Proposals' : 'No Matching Proposals Found'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 max-w-sm mx-auto">
            {showFavoritesOnly
              ? 'You have not saved any proposal favorites yet. Click the heart icon on any proposal card to bookmark it here!'
              : 'No listings match all your selected filters. Try loosening some filters or clearing your search keywords.'}
          </p>
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{showFavoritesOnly ? 'View All Proposals' : 'Reset All Filters'}</span>
          </button>
        </div>
      )}

    </section>
  );
}
