import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SignInModal from '../components/SignInModal';
import { useProfiles } from '../context/ProfilesContext';

export default function SignInPage({
  onShowToast
}) {
  const navigate = useNavigate();
  const { rawProfiles, totalCount, activeFilterCount, bookmarks } = useProfiles();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      <Navbar
        totalProfiles={totalCount}
        activeFilterCount={activeFilterCount}
        bookmarkCount={bookmarks.length}
        onOpenAddModal={() => navigate('/add')}
        onOpenPosterGenerator={() => navigate('/poster')}
        onOpenWalletModal={() => navigate('/wallet')}
        onOpenSignIn={() => {}}
        onOpenAdminPortal={() => navigate('/admin')}
      />

      <main className="flex-1 flex items-center justify-center p-4">
        <SignInModal
          isOpen={true}
          onClose={() => navigate('/profiles')}
          onShowToast={onShowToast}
          profiles={rawProfiles}
        />
      </main>

      <Footer onOpenAdminPortal={() => navigate('/admin')} />
    </div>
  );
}
