import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DemoNoticeBanner from '../components/DemoNoticeBanner';
import WalletRechargeModal from '../components/WalletRechargeModal';
import { useProfiles } from '../context/ProfilesContext';
import { useAuth } from '../context/AuthContext';
import { useSeo } from '../utils/useSeo';
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

  useSeo({
    title: 'Wallet & Contact Credits | Al-ThayyiBoon Matrimony',
    description: 'Manage credits and verified candidate contact access on Al-ThayyiBoon.',
    canonicalUrl: 'https://althayyiboon.com/wallet'
  });

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
        {/* PAYMENT & WALLET RECHARGE HELD */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              Credit System On Hold
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Credit System Temporarily On Hold
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              All registrations and connection requests are currently handled manually by Admin. To connect with any proposal, open the profile and click <strong>Request Contact</strong> — Admin will shortly contact you after verifying the proposal validity of the requested client.
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => navigate('/profiles')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse Verified Proposals</span>
            </button>
          </div>
        </div>
      </main>

      <Footer onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')} />
    </div>
  );
}
