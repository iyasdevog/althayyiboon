import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DemoNoticeBanner from '../components/DemoNoticeBanner';
import ProfileCard from '../components/ProfileCard';
import { useProfiles } from '../context/ProfilesContext';
import { Heart, ArrowLeft, ArrowRight, Sparkles, Filter, Trash2 } from 'lucide-react';

export default function SavedProfilesPage({
  onOpenAddModal,
  onOpenSignIn,
  onOpenWalletModal,
  onOpenAdminPortal,
  onOpenEditModal,
  onShowToast
}) {
  const navigate = useNavigate();
  const { profiles, rawProfiles, bookmarks, toggleBookmark, totalCount, activeFilterCount } = useProfiles();
  const [selectedGender, setSelectedGender] = useState('All');

  useEffect(() => {
    const prev = document.title;
    document.title = 'Saved Proposals | Al-ThayyiBoon – Your Bookmarked Matrimonial Profiles';
    return () => { document.title = prev; };
  }, []);

  // Filter bookmarked profiles
  const bookmarkedProfiles = rawProfiles.filter(p => bookmarks.includes(p.id));
  const filteredBookmarks = selectedGender === 'All' 
    ? bookmarkedProfiles 
    : bookmarkedProfiles.filter(p => {
        const isBride = p.basicInfo?.gender === 'Bride' || p.gender === 'female';
        return selectedGender === 'Bride' ? isBride : !isBride;
      });

  const brideCount = bookmarkedProfiles.filter(p => p.basicInfo?.gender === 'Bride' || p.gender === 'female').length;
  const groomCount = bookmarkedProfiles.filter(p => p.basicInfo?.gender === 'Groom' || p.gender === 'male').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      <DemoNoticeBanner onOpenSignIn={(role) => onOpenSignIn?.(role)} />

      <Navbar
        totalProfiles={totalCount}
        activeFilterCount={activeFilterCount}
        bookmarkCount={bookmarks.length}
        showFavoritesOnly={true}
        onOpenAddModal={onOpenAddModal ? onOpenAddModal : () => navigate('/add')}
        onOpenPosterGenerator={() => navigate('/poster')}
        onOpenWalletModal={onOpenWalletModal ? onOpenWalletModal : () => navigate('/wallet')}
        onOpenSignIn={onOpenSignIn ? onOpenSignIn : () => navigate('/login')}
        onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Link to="/profiles" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Directory</span>
              </Link>
              <span>/</span>
              <span className="text-slate-200 font-semibold">Saved Proposals</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Heart className="w-5 h-5 fill-rose-500/20" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Saved Favorites</span>
                  <span className="text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {bookmarkedProfiles.length}
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Proposals you have bookmarked for easy family review
                </p>
              </div>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          {bookmarkedProfiles.length > 0 && (
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl shrink-0 text-xs">
              <button
                onClick={() => setSelectedGender('All')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                  selectedGender === 'All' 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({bookmarkedProfiles.length})
              </button>
              <button
                onClick={() => setSelectedGender('Bride')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                  selectedGender === 'Bride' 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                    : 'text-slate-400 hover:text-rose-300'
                }`}
              >
                Brides ({brideCount})
              </button>
              <button
                onClick={() => setSelectedGender('Groom')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                  selectedGender === 'Groom' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'text-slate-400 hover:text-emerald-300'
                }`}
              >
                Grooms ({groomCount})
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        {bookmarkedProfiles.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">No Saved Proposals Yet</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              When browsing proposals in the directory, click the heart icon on any proposal card to save it here for family consultations.
            </p>
            <div className="pt-2">
              <Link
                to="/profiles"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore Matrimonial Directory</span>
              </Link>
            </div>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="text-sm">No saved {selectedGender} proposals found.</p>
            <button
              onClick={() => setSelectedGender('All')}
              className="mt-2 text-xs font-semibold text-emerald-400 hover:underline cursor-pointer"
            >
              Show all saved proposals ({bookmarkedProfiles.length})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredBookmarks.map(p => (
              <ProfileCard
                key={p.id}
                profile={p}
                onSelectProfile={(item) => navigate(`/profile/${item.id}`)}
                isBookmarked={true}
                onToggleBookmark={toggleBookmark}
                onOpenEditModal={onOpenEditModal}
                onShowToast={onShowToast}
                onOpenPosterModal={(item) => navigate(`/poster/${item.id}`)}
              />
            ))}
          </div>
        )}

      </main>

      <Footer onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')} />
    </div>
  );
}
