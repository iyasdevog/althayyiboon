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
import { useProfiles } from './hooks/useProfiles';

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
    addNewProfile,
    updateProfile,
    deleteProfile,
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Sticky Header Navbar */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        totalProfiles={totalCount}
        onToggleMobileFilter={() => setIsMobileFilterOpen(true)}
        activeFilterCount={activeFilterCount}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
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

      {/* Main Directory Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 w-full">
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
            onResetFilters={resetFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onOpenEditModal={(p) => {
              setIsAdminOverrideEdit(false);
              setEditingProfile(p);
            }}
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
