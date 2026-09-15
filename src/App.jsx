import React, { useState } from 'react';
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
import Footer from './components/Footer';
import AdUnit from './components/AdUnit';
import { useProfiles } from './hooks/useProfiles';
import { Check, Sparkles } from 'lucide-react';

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

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(null);
  const [isAdminOverrideEdit, setIsAdminOverrideEdit] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isRequestFilterOpen, setIsRequestFilterOpen] = useState(false);

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
      <StatsBar profiles={profiles} />

      {/* ── AD SLOT: Horizontal banner (below stats bar) ──────────────────────
          When ready: uncomment the block below, set your slot ID
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3">
            <AdUnit slot="YOUR_SLOT_ID" format="horizontal" className="w-full" />
          </div>
      ──────────────────────────────────────────────────────────────────── */}

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
          />

        </div>
      </main>

      {/* Profile Detail View Modal */}
      {selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          isBookmarked={bookmarks.includes(selectedProfile.id)}
          onToggleBookmark={toggleBookmark}
          onShowToast={showToast}
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
          onSubmitProfile={addNewProfile}
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
          onClose={() => setIsAdminPortalOpen(false)}
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

      {/* Footer */}
      <Footer />

    </div>
  );
}
