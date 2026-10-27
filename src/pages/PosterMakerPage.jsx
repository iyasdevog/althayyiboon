import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DemoNoticeBanner from '../components/DemoNoticeBanner';
import SharePosterModal from '../components/SharePosterModal';
import { useProfiles } from '../context/ProfilesContext';
import { Image as ImageIcon, ArrowLeft, Users, Sparkles } from 'lucide-react';

export default function PosterMakerPage({
  onOpenAddModal,
  onOpenSignIn,
  onOpenWalletModal,
  onOpenAdminPortal,
  onShowToast
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rawProfiles, profiles, bookmarks, totalCount, activeFilterCount } = useProfiles();

  // Selected candidate ID
  const [selectedId, setSelectedId] = useState(id || (profiles[0]?.id || rawProfiles[0]?.id || null));

  // Update selected if route param changes
  useEffect(() => {
    if (id) {
      setSelectedId(id);
    }
  }, [id]);

  // SEO: Update page title
  useEffect(() => {
    const prev = document.title;
    document.title = 'Matrimonial Poster Studio | Al-ThayyiBoon – WhatsApp & Instagram Cards';
    return () => { document.title = prev; };
  }, []);

  const activeCandidate = rawProfiles.find(p => String(p.id).toLowerCase() === String(selectedId).toLowerCase())
    || profiles.find(p => String(p.id).toLowerCase() === String(selectedId).toLowerCase())
    || profiles[0]
    || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      <DemoNoticeBanner onOpenSignIn={(role) => onOpenSignIn?.(role)} />

      <Navbar
        totalProfiles={totalCount}
        activeFilterCount={activeFilterCount}
        bookmarkCount={bookmarks.length}
        onOpenAddModal={onOpenAddModal ? onOpenAddModal : () => navigate('/add')}
        onOpenPosterGenerator={() => {}}
        onOpenWalletModal={onOpenWalletModal ? onOpenWalletModal : () => navigate('/wallet')}
        onOpenSignIn={onOpenSignIn ? onOpenSignIn : () => navigate('/login')}
        onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 w-full">
        
        {/* Top Header & Candidate Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
              <Link to="/profiles" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Directory</span>
              </Link>
              <span>/</span>
              <span className="text-slate-200 font-semibold">Social Poster Studio</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  Matrimonial Poster Studio
                </h1>
                <p className="text-xs text-slate-400">
                  Generate high-resolution social posters for WhatsApp status &amp; Instagram
                </p>
              </div>
            </div>
          </div>

          {/* Candidate Dropdown Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline">Select Proposal:</span>
            <select
              value={selectedId || ''}
              onChange={(e) => {
                const newId = e.target.value;
                setSelectedId(newId);
                navigate(`/poster/${newId}`);
              }}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer min-w-[200px]"
            >
              {rawProfiles.map(p => {
                const isBride = p.basicInfo?.gender === 'Bride' || p.gender === 'female';
                const name = p.basicInfo?.fullName || (isBride ? 'Bride' : 'Groom');
                const age = p.basicInfo?.age ? `${p.basicInfo.age}y` : '';
                const job = p.educationOccupation?.profession || '';
                return (
                  <option key={p.id} value={p.id}>
                    {p.id} - {isBride ? '👰 Bride' : '🤵 Groom'} ({age}) {job ? `• ${job}` : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Poster Modal Embedded in Page */}
        <SharePosterModal
          profile={activeCandidate}
          onClose={() => navigate('/profiles')}
          onShowToast={onShowToast}
        />

      </main>

      <Footer onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')} />
    </div>
  );
}
