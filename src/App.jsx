import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ProfileDetailPage from './pages/ProfileDetailPage';
import SavedProfilesPage from './pages/SavedProfilesPage';
import PosterMakerPage from './pages/PosterMakerPage';
import AddProfilePage from './pages/AddProfilePage';
import AdminPage from './pages/AdminPage';
import WalletPage from './pages/WalletPage';
import SignInPage from './pages/SignInPage';
import NotFoundPage from './pages/NotFoundPage';
import CampaignPage from './components/CampaignPage';
import LandingPage from './components/LandingPage';

import EditProfileModal from './components/EditProfileModal';
import RequestFilterModal from './components/RequestFilterModal';
import SharePosterModal from './components/SharePosterModal';
import WalletRechargeModal from './components/WalletRechargeModal';
import SignInModal from './components/SignInModal';
import AddProfileModal from './components/AddProfileModal';

import { useProfiles } from './context/ProfilesContext';
import { useAuth } from './context/AuthContext';
import { Check } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();

  const {
    rawProfiles,
    addNewProfile,
    updateProfile,
    deleteProfile,
    handleUserFilterRequest,
    selectedGender
  } = useProfiles();

  const { 
    switchUserPersona, 
    isCheckoutOpen, 
    setIsCheckoutOpen
  } = useAuth();

  // Modals state
  const [editingProfile, setEditingProfile] = useState(null);
  const [isAdminOverrideEdit, setIsAdminOverrideEdit] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInDefaultRole, setSignInDefaultRole] = useState('groom');
  const [isRequestFilterOpen, setIsRequestFilterOpen] = useState(false);
  const [posterProfile, setPosterProfile] = useState(null);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  // Global Toast Notification State
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // Backwards compatibility for legacy query params: ?profile=XYZ or ?id=XYZ
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const profileId = params.get('profile') || params.get('id');
    if (profileId) {
      navigate(`/profile/${profileId}`, { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      
      {/* Global Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce-in bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs sm:text-sm border border-emerald-400">
          <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Multi-Page Routes */}
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenSignIn={(role) => {
                setSignInDefaultRole(role || 'groom');
                setIsSignInModalOpen(true);
              }}
              onOpenWalletModal={() => setIsCheckoutOpen(true)}
              onOpenPosterModal={(p) => {
                setPosterProfile(p || null);
                setIsPosterModalOpen(true);
              }}
              onOpenEditModal={(p) => {
                setIsAdminOverrideEdit(false);
                setEditingProfile(p);
              }}
              onOpenAdminPortal={() => navigate('/admin')}
              onRequestFilterModal={() => setIsRequestFilterOpen(true)}
              onShowToast={showToast}
            />
          } 
        />

        <Route 
          path="/profiles" 
          element={
            <BrowsePage
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenSignIn={(role) => {
                setSignInDefaultRole(role || 'groom');
                setIsSignInModalOpen(true);
              }}
              onOpenWalletModal={() => setIsCheckoutOpen(true)}
              onOpenPosterModal={(p) => {
                setPosterProfile(p || null);
                setIsPosterModalOpen(true);
              }}
              onOpenEditModal={(p) => {
                setIsAdminOverrideEdit(false);
                setEditingProfile(p);
              }}
              onOpenAdminPortal={() => navigate('/admin')}
              onRequestFilterModal={() => setIsRequestFilterOpen(true)}
              onShowToast={showToast}
            />
          } 
        />

        <Route 
          path="/browse" 
          element={
            <BrowsePage
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenSignIn={(role) => {
                setSignInDefaultRole(role || 'groom');
                setIsSignInModalOpen(true);
              }}
              onOpenWalletModal={() => setIsCheckoutOpen(true)}
              onOpenPosterModal={(p) => {
                setPosterProfile(p || null);
                setIsPosterModalOpen(true);
              }}
              onOpenEditModal={(p) => {
                setIsAdminOverrideEdit(false);
                setEditingProfile(p);
              }}
              onOpenAdminPortal={() => navigate('/admin')}
              onRequestFilterModal={() => setIsRequestFilterOpen(true)}
              onShowToast={showToast}
            />
          } 
        />

        <Route 
          path="/profile/:id" 
          element={
            <ProfileDetailPage
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenSignIn={(role) => {
                setSignInDefaultRole(role || 'groom');
                setIsSignInModalOpen(true);
              }}
              onOpenWalletModal={() => setIsCheckoutOpen(true)}
              onOpenAdminPortal={() => navigate('/admin')}
              onShowToast={showToast}
            />
          } 
        />

        <Route 
          path="/saved" 
          element={
            <SavedProfilesPage
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenSignIn={(role) => {
                setSignInDefaultRole(role || 'groom');
                setIsSignInModalOpen(true);
              }}
              onOpenWalletModal={() => setIsCheckoutOpen(true)}
              onOpenAdminPortal={() => navigate('/admin')}
              onOpenEditModal={(p) => {
                setIsAdminOverrideEdit(false);
                setEditingProfile(p);
              }}
              onShowToast={showToast}
            />
          } 
        />

        <Route 
          path="/bookmarks" 
          element={
            <SavedProfilesPage
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenSignIn={(role) => {
                setSignInDefaultRole(role || 'groom');
                setIsSignInModalOpen(true);
              }}
              onOpenWalletModal={() => setIsCheckoutOpen(true)}
              onOpenAdminPortal={() => navigate('/admin')}
              onOpenEditModal={(p) => {
                setIsAdminOverrideEdit(false);
                setEditingProfile(p);
              }}
              onShowToast={showToast}
            />
          } 
        />

        <Route 
          path="/poster" 
          element={
            <PosterMakerPage
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenSignIn={(role) => {
                setSignInDefaultRole(role || 'groom');
                setIsSignInModalOpen(true);
              }}
              onOpenWalletModal={() => setIsCheckoutOpen(true)}
              onOpenAdminPortal={() => navigate('/admin')}
              onShowToast={showToast}
            />
          } 
        />

        <Route 
          path="/poster/:id" 
          element={
            <PosterMakerPage
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenSignIn={(role) => {
                setSignInDefaultRole(role || 'groom');
                setIsSignInModalOpen(true);
              }}
              onOpenWalletModal={() => setIsCheckoutOpen(true)}
              onOpenAdminPortal={() => navigate('/admin')}
              onShowToast={showToast}
            />
          } 
        />

        <Route 
          path="/add" 
          element={
            <AddProfilePage
              onOpenSignIn={(role) => {
                setSignInDefaultRole(role || 'groom');
                setIsSignInModalOpen(true);
              }}
              onOpenWalletModal={() => setIsCheckoutOpen(true)}
              onOpenAdminPortal={() => navigate('/admin')}
              onShowToast={showToast}
            />
          } 
        />

        <Route 
          path="/register" 
          element={
            <AddProfilePage
              onOpenSignIn={(role) => {
                setSignInDefaultRole(role || 'groom');
                setIsSignInModalOpen(true);
              }}
              onOpenWalletModal={() => setIsCheckoutOpen(true)}
              onOpenAdminPortal={() => navigate('/admin')}
              onShowToast={showToast}
            />
          } 
        />

        <Route 
          path="/admin" 
          element={
            <AdminPage
              onSelectEditProfile={(p) => {
                setIsAdminOverrideEdit(true);
                setEditingProfile(p);
              }}
              onShowToast={showToast}
            />
          } 
        />

        <Route 
          path="/wallet" 
          element={
            <WalletPage
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenSignIn={(role) => {
                setSignInDefaultRole(role || 'groom');
                setIsSignInModalOpen(true);
              }}
              onOpenAdminPortal={() => navigate('/admin')}
              onShowToast={showToast}
            />
          } 
        />

        <Route 
          path="/pricing" 
          element={
            <WalletPage
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenSignIn={(role) => {
                setSignInDefaultRole(role || 'groom');
                setIsSignInModalOpen(true);
              }}
              onOpenAdminPortal={() => navigate('/admin')}
              onShowToast={showToast}
            />
          } 
        />

        <Route 
          path="/login" 
          element={
            <SignInPage onShowToast={showToast} />
          } 
        />

        <Route 
          path="/signin" 
          element={
            <SignInPage onShowToast={showToast} />
          } 
        />

        <Route 
          path="/campaign" 
          element={
            <CampaignPage
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenSignIn={(role) => {
                setSignInDefaultRole(role || 'groom');
                setIsSignInModalOpen(true);
              }}
              onSwitchPersona={(role) => {
                switchUserPersona(role);
                showToast(`Switched to ${role} demo mode (Sample Data)!`);
                navigate('/profiles');
              }}
              onOpenAdminPortal={() => navigate('/admin')}
            />
          } 
        />

        <Route 
          path="/welcome" 
          element={
            <LandingPage
              onSignIn={(role) => {
                setSignInDefaultRole(role || 'groom');
                setIsSignInModalOpen(true);
              }}
              onSwitchPersona={(role) => {
                switchUserPersona(role);
                showToast(`Switched to ${role} demo mode (Sample Data)!`);
                navigate('/profiles');
              }}
              onOpenAdminPortal={() => navigate('/admin')}
            />
          } 
        />

        <Route 
          path="/landing" 
          element={
            <LandingPage
              onSignIn={(role) => {
                setSignInDefaultRole(role || 'groom');
                setIsSignInModalOpen(true);
              }}
              onSwitchPersona={(role) => {
                switchUserPersona(role);
                showToast(`Switched to ${role} demo mode (Sample Data)!`);
                navigate('/profiles');
              }}
              onOpenAdminPortal={() => navigate('/admin')}
            />
          } 
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

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

      {/* Public "Add Profile" Submission Form Modal (when triggered via shortcut) */}
      {isAddModalOpen && (
        <AddProfileModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmitProfile={async (formData) => {
            const newDoc = await addNewProfile(formData);
            const propType = newDoc.basicInfo?.gender === 'Bride' || newDoc.gender === 'female' ? 'Bride' : 'Groom';
            showToast(`Proposal for ${propType} added successfully!`);
            setIsAddModalOpen(false);
            if (newDoc?.id) {
              navigate(`/profile/${newDoc.id}`);
            }
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

      {/* Social Media Poster Generator Modal (when triggered via shortcut) */}
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

      {/* In-App Wallet & Recharge Checkout Modal (when triggered via shortcut) */}
      <WalletRechargeModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onShowToast={showToast}
        onOpenAdminPortal={() => {
          setIsCheckoutOpen(false);
          navigate('/admin');
        }}
      />

      {/* Unified Sign-In Modal (when triggered via shortcut) */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSuccess={() => {
          setIsSignInModalOpen(false);
          navigate('/profiles');
        }}
        onShowToast={showToast}
        defaultRole={signInDefaultRole}
        profiles={rawProfiles}
      />

    </div>
  );
}
