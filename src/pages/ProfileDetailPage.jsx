import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DemoNoticeBanner from '../components/DemoNoticeBanner';
import ProfileCard from '../components/ProfileCard';
import CandidateAccessGate from '../components/CandidateAccessGate';
import { useProfiles } from '../context/ProfilesContext';
import { useAuth } from '../context/AuthContext';
import { shareProfile } from '../utils/shareUtils';
import { 
  ArrowLeft, 
  ArrowRight, 
  Phone, 
  MessageSquare, 
  Share2, 
  Heart, 
  User, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  MapPin, 
  Home, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Coins, 
  Copy, 
  Check, 
  Image as ImageIcon,
  Sparkles,
  Users
} from 'lucide-react';

function maskPhoneNumber(phone) {
  if (!phone) return "+91 98******12";
  const clean = phone.trim();
  if (clean.length < 8) return "+91 98******12";
  const prefix = clean.slice(0, Math.min(6, clean.length - 4));
  const suffix = clean.slice(-2);
  return `${prefix}******${suffix}`;
}

export default function ProfileDetailPage({
  onOpenAddModal,
  onOpenSignIn,
  onOpenWalletModal,
  onOpenAdminPortal,
  onShowToast
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profiles, rawProfiles, bookmarks, toggleBookmark, totalCount, activeFilterCount } = useProfiles();
  const { 
    currentUser,
    isAdmin,
    switchUserPersona,
    linkExistingProfileToAccount,
    isContactUnlocked, 
    unlockContact, 
    isParent, 
    isDemo: authIsDemo
  } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  // Find candidate across both filtered and raw profiles
  const profile = rawProfiles.find(p => String(p.id).toLowerCase() === String(id).toLowerCase())
    || profiles.find(p => String(p.id).toLowerCase() === String(id).toLowerCase());

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // SEO: Update page title dynamically per profile
  useEffect(() => {
    const prev = document.title;
    if (profile) {
      const gender = profile.basicInfo?.gender || (profile.gender === 'female' ? 'Bride' : 'Groom');
      const district = profile.locationFamily?.homeDistrict || 'Kerala';
      const qual = Array.isArray(profile.islamicQualification) && profile.islamicQualification.length
        ? profile.islamicQualification[0]
        : (profile.islamicBackground?.qualification || '');
      const edu = profile.generalEducation?.degreeName || profile.educationOccupation?.education || '';
      const parts = [gender, qual, edu, district].filter(Boolean).join(' · ');
      document.title = `${parts} | Al-ThayyiBoon Matrimony`;
    } else {
      document.title = 'Proposal | Al-ThayyiBoon Matrimony';
    }
    return () => { document.title = prev; };
  }, [id, profile]);

  // Determine if current user has an active registered proposal
  const hasRegistered = Boolean(
    isAdmin || 
    authIsDemo || 
    currentUser?.hasRegisteredProfile || 
    currentUser?.isLegacyUser || 
    rawProfiles.some(p => 
      (p.creatorUid && p.creatorUid === currentUser?.uid) ||
      (currentUser?.email && (
        (p.creatorEmail && p.creatorEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
        (p.email && p.email.toLowerCase() === currentUser.email.toLowerCase()) ||
        (p.contactPreferences?.email && p.contactPreferences.email.toLowerCase() === currentUser.email.toLowerCase())
      ))
    )
  );

  // Gate 1: unauthenticated non-demo visitor
  if (!currentUser && !authIsDemo) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar
          totalProfiles={totalCount}
          activeFilterCount={activeFilterCount}
          bookmarkCount={bookmarks.length}
          onOpenAddModal={onOpenAddModal ? onOpenAddModal : () => navigate('/add')}
          onOpenPosterGenerator={() => navigate('/poster')}
          onOpenWalletModal={onOpenWalletModal ? onOpenWalletModal : () => navigate('/wallet')}
          onOpenSignIn={onOpenSignIn ? onOpenSignIn : () => navigate('/login')}
          onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')}
        />
        <main className="flex-1 flex items-center justify-center py-8">
          <CandidateAccessGate
            isLoggedIn={false}
            onOpenSignIn={(role, mode) => onOpenSignIn ? onOpenSignIn(role, mode) : navigate('/login')}
            onOpenAddModal={onOpenAddModal ? onOpenAddModal : () => navigate('/add')}
            onSwitchPersona={(role) => {
              switchUserPersona(role);
              onShowToast?.(`Switched to ${role} demo mode!`);
            }}
          />
        </main>
        <Footer onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')} />
      </div>
    );
  }

  // Gate 2: signed in user who has not registered their candidate details
  if (currentUser && !hasRegistered) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar
          totalProfiles={totalCount}
          activeFilterCount={activeFilterCount}
          bookmarkCount={bookmarks.length}
          onOpenAddModal={onOpenAddModal ? onOpenAddModal : () => navigate('/add')}
          onOpenPosterGenerator={() => navigate('/poster')}
          onOpenWalletModal={onOpenWalletModal ? onOpenWalletModal : () => navigate('/wallet')}
          onOpenSignIn={onOpenSignIn ? onOpenSignIn : () => navigate('/login')}
          onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')}
        />
        <main className="flex-1 flex items-center justify-center py-8">
          <CandidateAccessGate
            isLoggedIn={true}
            userName={currentUser.name || 'Member'}
            onOpenAddModal={onOpenAddModal ? onOpenAddModal : () => navigate('/add')}
            onLinkExistingProfile={async (identifier, pin) => {
              const res = linkExistingProfileToAccount(identifier, pin, rawProfiles);
              if (res.success) {
                onShowToast?.(`Proposal (${res.profile.id}) successfully linked!`);
                return { success: true };
              }
              return { success: false, error: res.error };
            }}
            onSwitchPersona={(role) => {
              switchUserPersona(role);
              onShowToast?.(`Switched to ${role} demo mode!`);
            }}
          />
        </main>
        <Footer onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar
          totalProfiles={totalCount}
          activeFilterCount={activeFilterCount}
          bookmarkCount={bookmarks.length}
          onOpenAddModal={onOpenAddModal ? onOpenAddModal : () => navigate('/add')}
          onOpenPosterGenerator={() => navigate('/poster')}
          onOpenWalletModal={onOpenWalletModal ? onOpenWalletModal : () => navigate('/wallet')}
          onOpenSignIn={onOpenSignIn ? onOpenSignIn : () => navigate('/login')}
          onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')}
        />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Proposal Not Found</h1>
          <p className="text-sm text-slate-400 mb-6 max-w-md">
            The proposal ID "{id}" could not be located or may have been removed or updated.
          </p>
          <div className="flex gap-3">
            <Link
              to="/profiles"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse All Proposals</span>
            </Link>
          </div>
        </main>
        <Footer onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')} />
      </div>
    );
  }

  const {
    basicInfo = {},
    islamicBackground = {},
    islamicQualification = [],
    generalEducation = {},
    educationOccupation = {},
    locationFamily = {},
    contactDetails = {},
    contactPreferences = {}
  } = profile;

  const isBride = basicInfo.gender === "Bride" || profile.gender === "female";
  const isDemo = Boolean(authIsDemo || profile.isFakeData || profile.id?.startsWith('DEMO-'));
  const isUnlocked = isContactUnlocked(profile.id);
  const isBookmarked = bookmarks.includes(profile.id);

  const candidateDisplayName = isDemo
    ? (isBride ? 'Bride' : 'Groom')
    : isParent 
      ? `Candidate ${isBride ? 'Bride' : 'Groom'} (${profile.id})` 
      : (basicInfo.fullName || (isBride ? 'Bride Proposal' : 'Groom Proposal'));

  const rawPhone = contactDetails.guardianPhone || contactPreferences.phone || "";
  const rawWhatsApp = contactDetails.whatsappNumber || contactPreferences.whatsapp || rawPhone;

  const islamicList = Array.isArray(islamicQualification) && islamicQualification.length > 0
    ? islamicQualification.filter(q => q && q !== 'None')
    : (islamicBackground.qualification && islamicBackground.qualification !== 'None' ? [islamicBackground.qualification] : []);

  const academicDegree = generalEducation.degreeName || educationOccupation.degree || educationOccupation.education || "";
  const academicLevel = generalEducation.level || educationOccupation.level || "";
  const specialization = generalEducation.specialization || "";

  // Navigation: Find Prev & Next index in list
  const currentIdx = profiles.findIndex(p => p.id === profile.id);
  const prevProfile = currentIdx > 0 ? profiles[currentIdx - 1] : null;
  const nextProfile = currentIdx >= 0 && currentIdx < profiles.length - 1 ? profiles[currentIdx + 1] : null;

  // Similar profiles (same gender, excluding current)
  const similarProfiles = profiles
    .filter(p => p.id !== profile.id && ((p.basicInfo?.gender === basicInfo.gender) || (p.gender === profile.gender)))
    .slice(0, 3);

  const handleUnlock = () => {
    if (isDemo) {
      onShowToast?.("Contact details are hidden in Demo View. Sign in to access real proposals.");
      return;
    }
    if (isParent) {
      onShowToast?.("Contact numbers are protected in Parent View.");
      return;
    }
    const res = unlockContact(profile);
    if (res.success && onShowToast) {
      onShowToast("Guardian contact unlocked successfully! (-1 Credit)");
    }
  };

  const getWhatsAppLink = () => {
    if (isDemo || isParent) return "#";
    const rawNumber = (rawWhatsApp || "").replace(/[^0-9]/g, "");
    const formattedNum = rawNumber.startsWith("91") || rawNumber.startsWith("966") || rawNumber.startsWith("971") || rawNumber.startsWith("974") 
      ? rawNumber 
      : "91" + rawNumber;

    const text = encodeURIComponent(
      `Assalamu Alaikum. I am contacting regarding proposal for ${isBride ? 'Bride' : 'Groom'} (${candidateDisplayName}, ID: ${profile.id}) found on Al-ThayyiBoon Matrimony.`
    );
    return `https://wa.me/${formattedNum}?text=${text}`;
  };

  const handleShare = () => {
    shareProfile(profile, (msg) => {
      setCopied(true);
      onShowToast?.(msg);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleCopyBioData = () => {
    const text = `*Al-ThayyiBoon Matrimonial Proposal*\n\n` +
      `👤 *Candidate:* ${candidateDisplayName} (ID: ${profile.id})\n` +
      `💍 *Gender & Age:* ${isBride ? 'Bride' : 'Groom'}, ${basicInfo.age} Yrs (${basicInfo.maritalStatus || 'Never Married'})\n` +
      `📏 *Height:* ${basicInfo.height || 'N/A'}\n` +
      `📖 *Islamic Degree:* ${islamicList.join(', ') || 'General'}\n` +
      `🎓 *Academic Education:* ${academicDegree} ${specialization ? `(${specialization})` : ''}\n` +
      `💼 *Profession:* ${educationOccupation.profession || 'Not specified'}\n` +
      `📍 *Location:* ${locationFamily.homeDistrict || 'Kerala'}, ${locationFamily.nativePlace || ''}\n` +
      `👨‍👩‍👧 *Family:* ${locationFamily.familyType || 'Nuclear'}\n` +
      `📞 *Guardian Contact:* ${isDemo ? 'Hidden in Demo View' : isUnlocked ? rawPhone : 'Protected on Al-ThayyiBoon'}\n\n` +
      `🔗 *View Online:* ${window.location.origin}/profile/${profile.id}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast?.("Bio-data formatted for WhatsApp copied!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      <DemoNoticeBanner onOpenSignIn={(role) => onOpenSignIn?.(role)} />

      <Navbar
        totalProfiles={totalCount}
        activeFilterCount={activeFilterCount}
        bookmarkCount={bookmarks.length}
        onOpenAddModal={onOpenAddModal ? onOpenAddModal : () => navigate('/add')}
        onOpenPosterGenerator={() => navigate(`/poster/${profile.id}`)}
        onOpenWalletModal={onOpenWalletModal ? onOpenWalletModal : () => navigate('/wallet')}
        onOpenSignIn={onOpenSignIn ? onOpenSignIn : () => navigate('/login')}
        onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')}
      />

      <main className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 w-full">
        
        {/* Navigation & Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Link to="/profiles" className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-medium">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Proposals</span>
            </Link>
            <span>/</span>
            <span className="text-slate-200 font-semibold truncate max-w-[150px] sm:max-w-none">
              {candidateDisplayName}
            </span>
          </div>

          {/* Prev / Next Profile Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {prevProfile && (
              <button
                onClick={() => navigate(`/profile/${prevProfile.id}`)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors cursor-pointer"
                title={`Previous: ${prevProfile.id}`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>
            )}
            {nextProfile && (
              <button
                onClick={() => navigate(`/profile/${nextProfile.id}`)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors cursor-pointer"
                title={`Next: ${nextProfile.id}`}
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
          
          {/* Header Banner */}
          <div className={`p-4 sm:p-8 border-b border-slate-800 ${
            isBride 
              ? 'bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900' 
              : 'bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Candidate Identity */}
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-bold text-xl sm:text-2xl shrink-0 shadow-lg border ${
                  isBride 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {isBride ? '👰' : '🤵'}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      isBride 
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' 
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {isBride ? 'Bride Proposal' : 'Groom Proposal'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono font-bold">
                      ID: {profile.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[11px] font-semibold flex items-center gap-1">
                      <Users className="w-3 h-3" /> By {profile.profileCreatedBy || profile.registeredBy || 'Parent'}
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                    {candidateDisplayName}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-emerald-400">{basicInfo.age || 24} Years</span>
                    <span>•</span>
                    <span>{basicInfo.maritalStatus || 'Never Married'}</span>
                    {basicInfo.height && (
                      <>
                        <span>•</span>
                        <span>{basicInfo.height}</span>
                      </>
                    )}
                    {locationFamily.homeDistrict && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          {locationFamily.homeDistrict}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                
                {/* Bookmark Toggle */}
                <button
                  onClick={() => toggleBookmark(profile.id)}
                  className={`p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isBookmarked
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                  }`}
                  title={isBookmarked ? "Remove Bookmark" : "Save Proposal"}
                >
                  <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-rose-400 text-rose-400' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>

                {/* Poster Generator Shortcut */}
                <button
                  onClick={() => navigate(`/poster/${profile.id}`)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Generate Social Poster for WhatsApp & Instagram"
                >
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Poster</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Share</span>
                </button>

                {/* Copy Biodata */}
                <button
                  onClick={handleCopyBioData}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy formatted bio-data to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Bio'}</span>
                </button>

              </div>

            </div>

            {/* Quick Tabs */}
            <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-4">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'islamic', label: 'Islamic Education', icon: BookOpen },
                { id: 'education', label: 'Academic & Career', icon: GraduationCap },
                { id: 'family', label: 'Family & Native', icon: Home },
                { id: 'contact', label: 'Guardian Contact', icon: Phone }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Tab Content Body */}
          <div className="p-4 sm:p-8">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  
                  {/* Islamic Qualification */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span>Islamic Qualification</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white">
                      {islamicList.length > 0 ? islamicList.join(', ') : (islamicBackground.qualification || 'None')}
                    </p>
                    {islamicBackground.institution && (
                      <p className="text-xs text-slate-400 mt-1">{islamicBackground.institution}</p>
                    )}
                  </div>

                  {/* Academic Degree */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-1.5">
                      <GraduationCap className="w-4 h-4" />
                      <span>Academic Degree</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white">
                      {academicDegree || academicLevel || 'Graduate'}
                    </p>
                    {specialization && (
                      <p className="text-xs text-slate-400 mt-1">{specialization}</p>
                    )}
                  </div>

                  {/* Profession & Career */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1.5">
                      <Briefcase className="w-4 h-4" />
                      <span>Profession</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white">
                      {educationOccupation.profession || 'Not Specified'}
                    </p>
                    {educationOccupation.workLocation && (
                      <p className="text-xs text-slate-400 mt-1">📍 {educationOccupation.workLocation}</p>
                    )}
                  </div>

                  {/* Native & District */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>District & Native</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white">
                      {locationFamily.homeDistrict || 'Kerala'}
                    </p>
                    {locationFamily.nativePlace && (
                      <p className="text-xs text-slate-400 mt-1">{locationFamily.nativePlace}</p>
                    )}
                  </div>

                  {/* Marital & Physical Attributes */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-1.5">
                      <User className="w-4 h-4" />
                      <span>Marital & Physical</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white">
                      {basicInfo.maritalStatus || 'Never Married'} • {basicInfo.height || 'N/A'}
                    </p>
                    {basicInfo.complexion && (
                      <p className="text-xs text-slate-400 mt-1">Complexion: {basicInfo.complexion}</p>
                    )}
                  </div>

                  {/* Family Type */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1.5">
                      <Home className="w-4 h-4" />
                      <span>Family Background</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white">
                      {locationFamily.familyType || 'Nuclear Family'}
                    </p>
                    {locationFamily.fatherProfession && (
                      <p className="text-xs text-slate-400 mt-1">Father: {locationFamily.fatherProfession}</p>
                    )}
                  </div>

                </div>

                {/* Expectations & Notes */}
                {(basicInfo.aboutCandidate || educationOccupation.expectations) && (
                  <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Candidate Profile & Partner Expectations</span>
                    </h3>
                    {basicInfo.aboutCandidate && (
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {basicInfo.aboutCandidate}
                      </p>
                    )}
                    {educationOccupation.expectations && (
                      <div className="pt-2 border-t border-slate-800/60">
                        <span className="text-xs font-semibold text-emerald-400">Expectations: </span>
                        <span className="text-sm text-slate-300">{educationOccupation.expectations}</span>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* ISLAMIC EDUCATION TAB */}
            {activeTab === 'islamic' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Religious Education & Background</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-400 block mb-1">Islamic Degrees / Qualifications:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {islamicList.length > 0 ? islamicList.map((q, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                            {q}
                          </span>
                        )) : (
                          <span className="text-slate-300">{islamicBackground.qualification || 'General Islamic Background'}</span>
                        )}
                      </div>
                    </div>

                    {islamicBackground.institution && (
                      <div>
                        <span className="text-slate-400 block mb-1">Studied Institution:</span>
                        <p className="font-semibold text-white">{islamicBackground.institution}</p>
                      </div>
                    )}

                    {islamicBackground.sect && (
                      <div>
                        <span className="text-slate-400 block mb-1">Religious Sect / Tradition:</span>
                        <p className="font-semibold text-white">{islamicBackground.sect}</p>
                      </div>
                    )}

                    {islamicBackground.religiousPractice && (
                      <div>
                        <span className="text-slate-400 block mb-1">Religious Practice / Lifestyle:</span>
                        <p className="font-semibold text-white">{islamicBackground.religiousPractice}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ACADEMIC & CAREER TAB */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-teal-400" />
                    <span>Academic & Occupational Details</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-400 block mb-1">Academic Education:</span>
                      <p className="font-bold text-white text-base">{academicDegree || 'Graduate'}</p>
                      {academicLevel && <p className="text-slate-400 text-xs mt-0.5">{academicLevel}</p>}
                    </div>

                    {specialization && (
                      <div>
                        <span className="text-slate-400 block mb-1">Specialization / Major:</span>
                        <p className="font-semibold text-white">{specialization}</p>
                      </div>
                    )}

                    <div>
                      <span className="text-slate-400 block mb-1">Current Profession:</span>
                      <p className="font-bold text-amber-300 text-base">{educationOccupation.profession || 'Not specified'}</p>
                    </div>

                    {educationOccupation.workLocation && (
                      <div>
                        <span className="text-slate-400 block mb-1">Work Location:</span>
                        <p className="font-semibold text-white">📍 {educationOccupation.workLocation}</p>
                      </div>
                    )}

                    {educationOccupation.annualIncome && (
                      <div>
                        <span className="text-slate-400 block mb-1">Annual Income:</span>
                        <p className="font-semibold text-white">{educationOccupation.annualIncome}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* FAMILY TAB */}
            {activeTab === 'family' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Home className="w-4 h-4 text-indigo-400" />
                    <span>Family & Native Background</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-400 block mb-1">Home District:</span>
                      <p className="font-semibold text-white">{locationFamily.homeDistrict || 'Kerala'}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Native Place / Locality:</span>
                      <p className="font-semibold text-white">{locationFamily.nativePlace || 'Not Specified'}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Father's Details:</span>
                      <p className="font-semibold text-white">
                        {isDemo ? 'Hidden in Demo View' : (locationFamily.fatherName || 'Father')}
                        {locationFamily.fatherProfession ? ` (${locationFamily.fatherProfession})` : ''}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Mother's Details:</span>
                      <p className="font-semibold text-white">
                        {isDemo ? 'Hidden in Demo View' : (locationFamily.motherName || 'Mother')}
                        {locationFamily.motherProfession ? ` (${locationFamily.motherProfession})` : ''}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Family Type:</span>
                      <p className="font-semibold text-white">{locationFamily.familyType || 'Nuclear'}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Siblings:</span>
                      <p className="font-semibold text-white">{locationFamily.siblings || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GUARDIAN CONTACT TAB */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                
                {/* Contact Unlock Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm sm:text-base">Guardian & Parent Contact</h3>
                        <p className="text-xs text-slate-400">Direct contact with authorized family guardian</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      isUnlocked 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {isUnlocked ? 'Unlocked' : 'Protected'}
                    </span>
                  </div>

                  {/* Status / Contact numbers */}
                  {isUnlocked && !isDemo && !isParent ? (
                    <div className="space-y-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-emerald-400 font-semibold block">Guardian Phone</span>
                          <span className="text-base sm:text-lg font-mono font-bold text-white">{rawPhone}</span>
                        </div>
                        <a
                          href={`tel:${rawPhone}`}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      </div>

                      {rawWhatsApp && (
                        <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-800/40 flex items-center justify-between">
                          <div>
                            <span className="text-[11px] text-teal-400 font-semibold block">WhatsApp Direct Contact</span>
                            <span className="text-base sm:text-lg font-mono font-bold text-white">{rawWhatsApp}</span>
                          </div>
                          <a
                            href={getWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-amber-400" />
                          <span className="text-sm font-mono text-slate-300">
                            {isDemo ? 'Hidden in Demo View' : maskPhoneNumber(rawPhone)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">Contact Protected</span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        To protect the modest privacy of Muslim candidates and prevent spam, guardian numbers are accessible through pay-per-view credits (1 Credit).
                      </p>

                      <div className="pt-2 flex flex-wrap gap-2">
                        <button
                          onClick={handleUnlock}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <Unlock className="w-4 h-4" />
                          <span>Unlock Guardian Contact (-1 Credit)</span>
                        </button>

                        <button
                          onClick={onOpenWalletModal ? onOpenWalletModal : () => navigate('/wallet')}
                          className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          <span>Get Credits</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Direct Guardian Contact • Zero Middlemen • Modest &amp; Verified</span>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Similar Proposals Section */}
        {similarProfiles.length > 0 && (
          <div className="mt-10 sm:mt-14 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Similar {isBride ? 'Bride' : 'Groom'} Proposals</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Explore more matching candidates</p>
              </div>

              <Link
                to="/profiles"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarProfiles.map(p => (
                <ProfileCard
                  key={p.id}
                  profile={p}
                  onSelectProfile={(item) => navigate(`/profile/${item.id}`)}
                  isBookmarked={bookmarks.includes(p.id)}
                  onToggleBookmark={toggleBookmark}
                  onShowToast={onShowToast}
                  onOpenPosterModal={(item) => navigate(`/poster/${item.id}`)}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')} />
    </div>
  );
}
