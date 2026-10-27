import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import { 
  SlidersHorizontal, 
  RefreshCw, 
  Heart, 
  X, 
  Filter, 
  LayoutGrid, 
  List, 
  Scale,
  MessageSquare,
  ShieldCheck,
  Lock,
  ExternalLink,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  showCountNumber = true,
  onOpenSignIn
}) {
  const navigate = useNavigate();
  const { currentUser, isDemo, isAdmin, pricing } = useAuth();
  const isDemoMode = Boolean(isDemo || currentUser?.isDemo || !currentUser);
  const isCampaignModeActive = Boolean(pricing?.campaignMode && !isAdmin && !currentUser?.isDemo);
  const whatsappGroupLink = pricing?.whatsappGroupLink || 'https://chat.whatsapp.com/sample-althayyiboon-group';
  const rewardCredits = pricing?.campaignRewardCredits || 3;
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [compareIds, setCompareIds] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const toggleCompare = (profileId) => {
    setCompareIds(prev => {
      if (prev.includes(profileId)) {
        return prev.filter(id => id !== profileId);
      }
      if (prev.length >= 3) {
        if (onShowToast) onShowToast("You can compare up to 3 proposals at a time.");
        return prev;
      }
      const updated = [...prev, profileId];
      if (onShowToast) onShowToast(`Added to comparison (${updated.length}/3)`);
      return updated;
    });
  };

  const comparedProfiles = profiles.filter(p => compareIds.includes(p.id));

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
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>View All Directory</span>
          </button>
        </div>
      )}

      {/* Grid Top Bar: Counter, View Mode Toggle & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-2 bg-slate-900/70 backdrop-blur-md px-3 py-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className={`w-2 h-2 rounded-full shrink-0 ${isCampaignModeActive ? 'bg-amber-400 animate-ping' : isDemoMode && !showFavoritesOnly && !showCountNumber ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`}></div>
          {isCampaignModeActive ? (
            <span className="text-xs sm:text-sm text-emerald-300 font-bold flex items-center gap-1.5 truncate">
              <span>ഡാറ്റാ ശേഖരണം പുരോഗമിക്കുന്നു • പ്രൊഫൈലുകൾ നിലവിൽ രഹസ്യമാണ്</span>
            </span>
          ) : showCountNumber ? (
            <span className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
              <span className="text-emerald-400 font-extrabold text-sm sm:text-base">{profiles.length}</span>
              <span className="ml-1 text-slate-400">
                <span className="sm:hidden">{showFavoritesOnly ? 'Saved' : 'Proposals'}</span>
                <span className="hidden sm:inline">{showFavoritesOnly ? 'Saved Proposals' : 'Matching Proposals Found'}</span>
              </span>
            </span>
          ) : showFavoritesOnly ? (
            <span className="text-xs sm:text-sm text-emerald-300 font-bold">
              Saved Proposals
            </span>
          ) : isDemoMode ? (
            <p className="text-xs sm:text-sm text-slate-300 leading-snug">
              You are viewing <strong className="text-amber-300 font-bold">Fake / Sample Data</strong>. To browse real verified matrimonial proposals,{' '}
              <button
                type="button"
                onClick={() => onOpenSignIn ? onOpenSignIn('groom') : navigate('/login')}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-2 transition-colors cursor-pointer inline"
              >
                sign in as Groom
              </button>
              {' '}or{' '}
              <button
                type="button"
                onClick={() => onOpenSignIn ? onOpenSignIn('bride') : navigate('/login')}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-2 transition-colors cursor-pointer inline"
              >
                Bride
              </button>
              .
            </p>
          ) : (
            <span className="text-xs sm:text-sm text-emerald-300 font-bold">
              Verified Proposals Directory
            </span>
          )}
        </div>

        {/* View Mode & Sort Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Grid vs List View Switcher */}
          <div className="hidden xs:inline-flex p-0.5 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Compact List View"
              aria-label="Compact List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
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
      </div>

      {/* Profile Cards Grid / List OR Campaign Mode Hidden State */}
      {isCampaignModeActive ? (
        <div className="rounded-3xl p-6 sm:p-10 text-center max-w-2xl mx-auto my-3 sm:my-6 bg-gradient-to-b from-slate-900/95 via-slate-900 to-emerald-950/40 border border-emerald-500/40 shadow-2xl relative overflow-hidden animate-fade-in">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-500/15 text-emerald-400 mx-auto flex items-center justify-center mb-4 border border-emerald-500/30 shadow-xl shadow-emerald-950/50">
            <ShieldCheck className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-400" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>പ്രൊഫൈലുകൾ നിലവിൽ രഹസ്യമാണ് (Profiles Protected &amp; Hidden)</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white mb-2.5 tracking-tight">
            ഡാറ്റാ ശേഖരണം പുരോഗമിക്കുന്നു
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 max-w-xl mx-auto font-normal">
            അൽ-ത്വയ്യിബൂൻ പ്രീ-ലോഞ്ച് കാമ്പയിൻ കാലയളവിൽ ഉദ്യോഗാർത്ഥികളുടെ സ്വകാര്യത ഉറപ്പാക്കാൻ എല്ലാ പ്രൊഫൈലുകളും താല്ക്കാലികമായി മറച്ചിരിക്കുകയാണ്. പ്ലാറ്റ്‌ഫോം പൊതുജനങ്ങൾക്കായി തുറക്കുമ്പോൾ ആദ്യമേ വിവരങ്ങൾ അറിയാനും, <strong className="text-amber-300 font-bold">{rewardCredits} സൗജന്യ കോൺടാക്റ്റ് അൺലോക്ക് ക്രെഡിറ്റുകൾ</strong> ആസ്വദിക്കാനും ഞങ്ങളുടെ ഔദ്യോഗിക വാട്സാപ്പ് ഗ്രൂപ്പിൽ അംഗമാകൂ!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <a
              href={whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>വാട്സാപ്പ് ഗ്രൂപ്പിൽ ചേരുക</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 font-bold text-xs sm:text-sm border border-emerald-500/40 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>സൗജന്യ രജിസ്ട്രേഷൻ (₹0)</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mt-5">
            ✨ കാമ്പയിൻ കാലയളവിൽ പ്രൊപ്പോസൽ രജിസ്ട്രേഷൻ തികച്ചും സൗജന്യമാണ് (₹0 Fee).
          </p>
        </div>
      ) : profiles.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-5" 
            : "space-y-3"
        }>
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
              isCompared={compareIds.includes(profile.id)}
              onToggleCompare={() => toggleCompare(profile.id)}
              viewMode={viewMode}
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
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{showFavoritesOnly ? 'View All Proposals' : 'Reset All Filters'}</span>
          </button>
        </div>
      )}

      {/* Floating Comparison Drawer Indicator */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-3 animate-slide-up">
          <div className="flex items-center gap-1.5 text-xs text-slate-200">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Comparing <strong>{compareIds.length}</strong> of 3</span>
          </div>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            Compare Now
          </button>
          <button
            onClick={() => setCompareIds([])}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Clear comparison"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Comparison Modal */}
      {isCompareModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <div 
            onClick={() => setIsCompareModalOpen(false)}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
          ></div>

          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-5 sm:p-6 z-10 animate-fade-in my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Side-by-Side Proposal Comparison</h3>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="p-3 text-slate-400 font-bold uppercase tracking-wider w-1/4">Criteria</th>
                    {comparedProfiles.map(p => (
                      <th key={p.id} className="p-3 text-white font-bold text-sm">
                        <div className="truncate">{p.basicInfo?.fullName || p.id}</div>
                        <div className="text-[10px] text-emerald-400 font-mono font-normal">ID: {p.id}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  <tr>
                    <td className="p-3 text-slate-400 font-medium">Gender &amp; Age</td>
                    {comparedProfiles.map(p => (
                      <td key={p.id} className="p-3 font-semibold">
                        {p.basicInfo?.gender || (p.gender === 'female' ? 'Bride' : 'Groom')}, {p.basicInfo?.age} Yrs
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-medium">Islamic Degree</td>
                    {comparedProfiles.map(p => {
                      const list = Array.isArray(p.islamicQualification) ? p.islamicQualification.join(', ') : (p.islamicBackground?.qualification || 'None');
                      return (
                        <td key={p.id} className="p-3 font-semibold text-emerald-300">
                          {list}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-medium">Academic Qualification</td>
                    {comparedProfiles.map(p => (
                      <td key={p.id} className="p-3">
                        {p.generalEducation?.degreeName || p.educationOccupation?.degree || p.educationOccupation?.education || 'Not specified'}
                        {p.generalEducation?.specialization ? ` (${p.generalEducation.specialization})` : ''}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-medium">Profession</td>
                    {comparedProfiles.map(p => (
                      <td key={p.id} className="p-3 font-semibold text-amber-300">
                        {p.educationOccupation?.profession || 'Not specified'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-medium">District &amp; Location</td>
                    {comparedProfiles.map(p => (
                      <td key={p.id} className="p-3">
                        {p.locationFamily?.homeDistrict || 'Kerala'}, {p.locationFamily?.nativePlace || ''}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-medium">Marital Status &amp; Height</td>
                    {comparedProfiles.map(p => (
                      <td key={p.id} className="p-3">
                        {p.basicInfo?.maritalStatus || 'Never Married'} • {p.basicInfo?.height || 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-medium">Actions</td>
                    {comparedProfiles.map(p => (
                      <td key={p.id} className="p-3">
                        <button
                          onClick={() => {
                            setIsCompareModalOpen(false);
                            onSelectProfile(p);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                        >
                          View Full Details
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
