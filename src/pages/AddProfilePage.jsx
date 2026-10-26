import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DemoNoticeBanner from '../components/DemoNoticeBanner';
import AddProfileModal from '../components/AddProfileModal';
import { useProfiles } from '../context/ProfilesContext';

export default function AddProfilePage({
  onOpenSignIn,
  onOpenWalletModal,
  onOpenAdminPortal,
  onShowToast
}) {
  const navigate = useNavigate();
  const { addNewProfile, selectedGender, totalCount, activeFilterCount, bookmarks } = useProfiles();

  const handleClose = () => {
    navigate('/profiles');
  };

  const handleSubmit = async (formData) => {
    try {
      const newDoc = await addNewProfile(formData);
      const propType = newDoc.basicInfo?.gender === 'Bride' || newDoc.gender === 'female' ? 'Bride' : 'Groom';
      onShowToast?.(`Proposal for ${propType} added successfully!`);
      if (newDoc?.id) {
        navigate(`/profile/${newDoc.id}`);
      } else {
        navigate('/profiles');
      }
    } catch (e) {
      console.error("Error creating proposal:", e);
      onShowToast?.("Failed to add proposal. Please check details and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      <DemoNoticeBanner onOpenSignIn={(role) => onOpenSignIn?.(role)} />

      <Navbar
        totalProfiles={totalCount}
        activeFilterCount={activeFilterCount}
        bookmarkCount={bookmarks.length}
        onOpenAddModal={() => {}}
        onOpenPosterGenerator={() => navigate('/poster')}
        onOpenWalletModal={onOpenWalletModal ? onOpenWalletModal : () => navigate('/wallet')}
        onOpenSignIn={onOpenSignIn ? onOpenSignIn : () => navigate('/login')}
        onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')}
      />

      <main className="flex-1">
        <AddProfileModal
          onClose={handleClose}
          onSubmitProfile={handleSubmit}
          defaultGender={selectedGender !== 'All' ? selectedGender : 'Bride'}
        />
      </main>

      <Footer onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')} />
    </div>
  );
}
