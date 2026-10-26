import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DemoNoticeBanner from '../components/DemoNoticeBanner';
import WalletRechargeModal from '../components/WalletRechargeModal';
import { useProfiles } from '../context/ProfilesContext';
import { useAuth } from '../context/AuthContext';
import { Coins, ArrowLeft, ShieldCheck, Zap, Lock, CheckCircle2 } from 'lucide-react';

export default function WalletPage({
  onOpenAddModal,
  onOpenSignIn,
  onOpenAdminPortal,
  onShowToast
}) {
  const navigate = useNavigate();
  const { totalCount, activeFilterCount, bookmarks } = useProfiles();
  const { credits, pricing } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      <DemoNoticeBanner onOpenSignIn={(role) => onOpenSignIn?.(role)} />

      <Navbar
        totalProfiles={totalCount}
        activeFilterCount={activeFilterCount}
        bookmarkCount={bookmarks.length}
        onOpenAddModal={onOpenAddModal ? onOpenAddModal : () => navigate('/add')}
        onOpenPosterGenerator={() => navigate('/poster')}
        onOpenWalletModal={() => {}}
        onOpenSignIn={onOpenSignIn ? onOpenSignIn : () => navigate('/login')}
        onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')}
      />

      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Wallet Modal embedded directly */}
        <WalletRechargeModal
          isOpen={true}
          onClose={() => navigate('/profiles')}
          onShowToast={onShowToast}
          onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')}
        />
      </main>

      <Footer onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')} />
    </div>
  );
}
