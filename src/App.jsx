import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import StatsBar from './components/StatsBar';
import FilterSidebar from './components/FilterSidebar';
import ProfileGrid from './components/ProfileGrid';
import ProfileDetailModal from './components/ProfileDetailModal';
import AddProfileModal from './components/AddProfileModal';
import EditProfileModal from './components/EditProfileModal';
import AdminPortalModal from './components/AdminPortalModal';
import RequestFilterModal from './components/RequestFilterModal';
import SharePosterModal from './components/SharePosterModal';
import WalletRechargeModal from './components/WalletRechargeModal';
import LandingPage from './components/LandingPage';
import CampaignPage from './components/CampaignPage';
import DemoNoticeBanner from './components/DemoNoticeBanner';
import SignInModal from './components/SignInModal';
import Footer from './components/Footer';
import { useProfiles } from './hooks/useProfiles';
import { useAuth } from './context/AuthContext';
import { Check } from 'lucide-react';

export default function App() {
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
    addNewProfile,
    updateProfile,
    deleteProfile,
    bulkDeleteProfiles,
    bulkUpdateStatus,
    approvedCustomFilters,
    filterRequests,
    handleUserFilterRequest,
    handleApproveFilterRequest,
    handleRejectFilterRequest
  } = useProfiles();

  const { 
    currentUser, 
    switchUserPersona, 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    isStatsNumbersVisible, 
    pricing,
    isAdmin
  } = useAuth();
  const showStatsNumbers = isStatsNumbersVisible ? isStatsNumbersVisible(rawProfiles.length) : true;

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(null);
  const [isAdminOverrideEdit, setIsAdminOverrideEdit] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInDefaultRole, setSignInDefaultRole] = useState('groom');
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path === '/admin' || path.startsWith('/admin') || hash === '#admin';
  });
  const [isRequestFilterOpen, setIsRequestFilterOpen] = useState(false);
  const [posterProfile, setPosterProfile] = useState(null);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  // Synchronize on hash change or popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin') || hash === '#admin') {
        setIsAdminPortalOpen(true);
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleCloseAdminPortal = () => {
    setIsAdminPortalOpen(false);
    if (window.location.pathname.toLowerCase().startsWith('/admin') || window.location.hash.toLowerCase() === '#admin') {
      window.history.pushState({}, '', '/');
    }
  };

  // Global Toast Notification State
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      
      {/* Global Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce-in bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs sm:text-sm border border-emerald-400">
          <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* View Routing & Conditions */}
      {!isAdmin && pricing?.campaignMode && !currentUser?.isDemo ? (
        /* Condition 1: Active Campaign Mode for Non-Admin & Non-Demo visitors: Show Launch Countdown Page */
        <CampaignPage
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenSignIn={(role) => {
            setSignInDefaultRole(role || 'groom');
            setIsSignInModalOpen(true);
          }}
          onSwitchPersona={(role) => {
            switchUserPersona(role);
            showToast(`Switched to ${role} demo mode (Sample Data)!`);
          }}
          onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        />
      ) : !currentUser ? (
        /* Condition 2: Guest Visitor: Show Matrimonial Landing Page */
        <LandingPage
          onSignIn={(role) => {
            setSignInDefaultRole(role || 'groom');
            setIsSignInModalOpen(true);
          }}
          onSwitchPersona={(role) => {
            switchUserPersona(role);
            showToast(`Switched to ${role} demo mode (Sample Data)!`);
          }}
          onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        />
      ) : (
        /* Condition 3: Authenticated Member or Instant Demo: Show Main Directory with Sample Notice if Demo */
        <>
          {/* Top Demo Notice Banner */}
          <DemoNoticeBanner 
            onOpenSignIn={(role) => {
              setSignInDefaultRole(role || 'groom');
              setIsSignInModalOpen(true);
            }} 
          />

          {/* Sticky Header Navbar */}
          <Navbar
            onOpenAddModal={() => setIsAddModalOpen(true)}
            totalProfiles={totalCount}
            onToggleMobileFilter={() => setIsMobileFilterOpen(true)}
            activeFilterCount={activeFilterCount}
            onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
            bookmarkCount={bookmarks.length}
            showFavoritesOnly={showFavoritesOnly}
            onToggleShowFavorites={() => setShowFavoritesOnly(prev => !prev)}
            onOpenPosterGenerator={() => {
              setPosterProfile(null);
              setIsPosterModalOpen(true);
            }}
            onOpenWalletModal={() => setIsCheckoutOpen(true)}
            onOpenSignIn={() => setIsSignInModalOpen(true)}
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

          {/* Aggregate Statistics Overview (Conditionally shown if 200+ profiles or enabled by admin) */}
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
                onRequestCustomFilter={() => setIsRequestFilterOpen(true)}
              />

              {/* Proposals Grid Display */}
              <ProfileGrid
                profiles={profiles}
                showCountNumber={showStatsNumbers}
                onSelectProfile={(p) => setSelectedProfile(p)}
                bookmarks={bookmarks}
                onToggleBookmark={toggleBookmark}
                showFavoritesOnly={showFavoritesOnly}
                onToggleShowFavorites={() => setShowFavoritesOnly(prev => !prev)}
                onResetFilters={resetFilters}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onOpenEditModal={(p) => {
                  setIsAdminOverrideEdit(false);
                  setEditingProfile(p);
                }}
                onShowToast={showToast}
                onOpenPosterModal={(p) => {
                  setPosterProfile(p);
                  setIsPosterModalOpen(true);
                }}
              />

            </div>
          </main>

          {/* Footer */}
          <Footer onOpenAdminPortal={() => setIsAdminPortalOpen(true)} />
        </>
      )}

      {/* Profile Detail View Modal */}
      {selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          isBookmarked={bookmarks.includes(selectedProfile.id)}
          onToggleBookmark={toggleBookmark}
          onShowToast={showToast}
          onOpenPosterModal={(p) => {
            setPosterProfile(p);
            setIsPosterModalOpen(true);
          }}
          allProfiles={profiles}
          onSelectProfile={setSelectedProfile}
        />
      )}

      {/* Proposal Owner / Admin Edit Modal */}
      {editingProfile && (
        <EditProfileModal
          profile={editingProfile}
          onClose={() => {
            setEditingProfile(null);
            setIsAdminOverrideEdit(false);
          }}
          onSaveUpdate={updateProfile}
          onDeleteProfile={deleteProfile}
          isAdminOverride={isAdminOverrideEdit}
        />
      )}

      {/* Public "Add Profile" Submission Form Modal */}
      {isAddModalOpen && (
        <AddProfileModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmitProfile={async (formData) => {
            const newDoc = await addNewProfile(formData);
            const propType = newDoc.basicInfo?.gender === 'Bride' || newDoc.gender === 'female' ? 'Bride' : 'Groom';
            showToast(`Proposal for ${propType} added successfully!`);
          }}
          defaultGender={selectedGender !== 'All' ? selectedGender : 'Bride'}
        />
      )}

      {/* Public "+ Add Custom Filter" Request Modal */}
      {isRequestFilterOpen && (
        <RequestFilterModal
          onClose={() => setIsRequestFilterOpen(false)}
          onSubmitFilterRequest={handleUserFilterRequest}
        />
      )}

      {/* Admin Management Portal Modal */}
      {isAdminPortalOpen && (
        <AdminPortalModal
          onClose={handleCloseAdminPortal}
          profiles={rawProfiles}
          onDeleteProfile={deleteProfile}
          onUpdateProfile={updateProfile}
          onBulkDelete={bulkDeleteProfiles}
          onBulkUpdateStatus={bulkUpdateStatus}
          onSelectEditProfile={(p) => {
            setIsAdminOverrideEdit(true);
            setEditingProfile(p);
          }}
          filterRequests={filterRequests}
          onApproveFilterRequest={handleApproveFilterRequest}
          onRejectFilterRequest={handleRejectFilterRequest}
        />
      )}

      {/* Social Media Poster Generator Modal */}
      {isPosterModalOpen && (
        <SharePosterModal
          profile={posterProfile}
          onClose={() => {
            setIsPosterModalOpen(false);
            setPosterProfile(null);
          }}
          onShowToast={showToast}
        />
      )}

      {/* In-App Wallet & Recharge Checkout Modal */}
      <WalletRechargeModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onShowToast={showToast}
        onOpenAdminPortal={() => {
          setIsCheckoutOpen(false);
          setIsAdminPortalOpen(true);
        }}
      />

      {/* Unified Sign-In Modal (Google, Email/Password, Legacy ID) */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onShowToast={showToast}
        defaultRole={signInDefaultRole}
        profiles={rawProfiles}
      />

    </div>
  );
}
