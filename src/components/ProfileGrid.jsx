import React from 'react';
import ProfileCard from './ProfileCard';
import { Sparkles, SlidersHorizontal, AlertCircle, RefreshCw } from 'lucide-react';

export default function ProfileGrid({ 
  profiles, 
  onSelectProfile, 
  bookmarks, 
  onToggleBookmark, 
  onResetFilters,
  sortBy,
  setSortBy,
  onOpenEditModal 
}) {
  return (
    <div className="flex-1 space-y-5">
      
      {/* Grid Top Bar: Counter & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold text-slate-200">
            Showing <span className="text-emerald-400 font-bold">{profiles.length}</span> Proposals
          </span>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-950 text-white text-xs font-medium py-1.5 px-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
          >
            <option value="newest">Newest Listed First</option>
            <option value="ageAsc">Age: Youngest First</option>
            <option value="ageDesc">Age: Eldest First</option>
          </select>
        </div>
      </div>

      {/* Profile Cards Grid */}
      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {profiles.map(profile => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onSelectProfile={onSelectProfile}
              isBookmarked={bookmarks.includes(profile.id)}
              onToggleBookmark={onToggleBookmark}
              onOpenEditModal={onOpenEditModal}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto my-12 border border-slate-800">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-amber-400 mx-auto flex items-center justify-center mb-4 border border-slate-800">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Proposals Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            We couldn't find any matrimony listings matching your current search or filter combinations. Try loosening some filters or clearing search text.
          </p>
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

    </div>
  );
}
