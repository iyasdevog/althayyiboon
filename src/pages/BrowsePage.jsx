import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import StatsBar from '../components/StatsBar';
import FilterSidebar from '../components/FilterSidebar';
import ProfileGrid from '../components/ProfileGrid';
import DemoNoticeBanner from '../components/DemoNoticeBanner';
import Footer from '../components/Footer';
import { useProfiles } from '../context/ProfilesContext';
import { useAuth } from '../context/AuthContext';

export default function BrowsePage({
  onOpenAddModal,
  onOpenSignIn,
  onOpenWalletModal,
  onOpenPosterModal,
  onOpenEditModal,
  onOpenAdminPortal,
  onRequestFilterModal,
  onShowToast
}) {
  const navigate = useNavigate();
  const {
    profiles,
    rawProfiles,
    totalCount,
    searchQuery,
    setSearchQuery,
    selectedGender,
    setSelectedGender,
    activeQuickTag,
    setActiveQuickTag,
    filters,
    setFilters,
    resetFilters,
    activeFilterCount,
    sortBy,
    setSortBy,
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    bookmarks,
    toggleBookmark,
    showFavoritesOnly,
    setShowFavoritesOnly,
    approvedCustomFilters
  } = useProfiles();

  const { isStatsNumbersVisible, currentUser, isDemo } = useAuth();
  const showStatsNumbers = isStatsNumbersVisible ? isStatsNumbersVisible(rawProfiles.length) : true;

  // Guard: Redirect unauthenticated non-demo guests to landing (home)
  // /profiles should only be accessible to signed-in members or demo mode users
  useEffect(() => {
    if (!currentUser && !isDemo) {
      navigate('/', { replace: true });
    }
  }, [currentUser, isDemo, navigate]);

  // Update page title for SEO
  useEffect(() => {
    const prev = document.title;
    document.title = 'Browse Proposals | Al-ThayyiBoon Matrimony – Kerala & Gulf Islamic Directory';
    return () => { document.title = prev; };
  }, []);

  const handleSelectProfile = (profile) => {
    if (profile?.id) {
      navigate(`/profile/${profile.id}`);
    }
  };

  // Don't render while redirecting
  if (!currentUser && !isDemo) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      {/* Top Demo Notice Banner */}
      <DemoNoticeBanner 
        onOpenSignIn={(role) => onOpenSignIn?.(role)} 
      />

      {/* Sticky Header Navbar */}
      <Navbar
        onOpenAddModal={onOpenAddModal ? onOpenAddModal : () => navigate('/add')}
        totalProfiles={totalCount}
        onToggleMobileFilter={() => setIsMobileFilterOpen(true)}
        activeFilterCount={activeFilterCount}
        onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')}
        bookmarkCount={bookmarks.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleShowFavorites={() => setShowFavoritesOnly(prev => !prev)}
        onOpenPosterGenerator={onOpenPosterModal ? onOpenPosterModal : () => navigate('/poster')}
        onOpenWalletModal={onOpenWalletModal ? onOpenWalletModal : () => navigate('/wallet')}
        onOpenSignIn={onOpenSignIn ? onOpenSignIn : () => navigate('/login')}
      />

      {/* Hero Banner with Search Bar & Quick Tags */}
      <HeroBanner
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
        activeQuickTag={activeQuickTag}
        setActiveQuickTag={setActiveQuickTag}
      />

      {/* Aggregate Statistics Overview */}
      {showStatsNumbers && (
        <StatsBar profiles={profiles} />
      )}

      {/* Main Directory Layout Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex-1 w-full">
        <div className="flex gap-8 items-start">
          
          {/* Desktop & Mobile Filter Drawer */}
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onResetFilters={resetFilters}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            approvedCustomFilters={approvedCustomFilters}
            onRequestCustomFilter={onRequestFilterModal ? onRequestFilterModal : () => {}}
          />

          {/* Proposals Grid Display */}
          <ProfileGrid
            profiles={profiles}
            showCountNumber={showStatsNumbers}
            onSelectProfile={handleSelectProfile}
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
            showFavoritesOnly={showFavoritesOnly}
            onToggleShowFavorites={() => setShowFavoritesOnly(prev => !prev)}
            onResetFilters={resetFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onOpenEditModal={onOpenEditModal}
            onShowToast={onShowToast}
            onOpenPosterModal={(p) => {
              if (p?.id) {
                navigate(`/poster/${p.id}`);
              } else if (onOpenPosterModal) {
                onOpenPosterModal(p);
              }
            }}
            onOpenSignIn={onOpenSignIn ? onOpenSignIn : (role) => navigate('/login')}
          />

        </div>
      </main>

      {/* Footer */}
      <Footer onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')} />
    </div>
  );
}
