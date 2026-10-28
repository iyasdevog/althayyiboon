import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SignInModal from '../components/SignInModal';
import { useProfiles } from '../context/ProfilesContext';

export default function SignInPage({
  onShowToast
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { rawProfiles, totalCount, activeFilterCount, bookmarks } = useProfiles();

  const searchParams = new URLSearchParams(location.search);
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'signin';
  const initialRole = searchParams.get('role') === 'bride' ? 'bride' : 'groom';

  useEffect(() => {
    const prev = document.title;
    document.title = initialMode === 'register'
      ? 'Register Candidate | Al-ThayyiBoon – Kerala & Gulf Islamic Matrimony'
      : 'Sign In | Al-ThayyiBoon – Kerala & Gulf Islamic Matrimony';
    return () => { document.title = prev; };
  }, [initialMode]);

  const handleSuccess = (authResult) => {
    if (authResult?.isNewRegistration) {
      navigate('/add');
    } else {
      navigate('/profiles');
    }
  };

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
          onSuccess={handleSuccess}
          onShowToast={onShowToast}
          profiles={rawProfiles}
          initialMode={initialMode}
          defaultRole={initialRole}
        />
      </main>

      <Footer onOpenAdminPortal={() => navigate('/admin')} />
    </div>
  );
}
