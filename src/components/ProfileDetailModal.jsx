import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeft,
  ArrowRight,
  Phone, 
  MessageSquare, 
  Share2, 
  User, 
  BookOpen, 
  GraduationCap, 
  MapPin, 
  Home, 
  Heart, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  Lock, 
  Unlock, 
  Coins, 
  Check, 
  Copy,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { shareProfile } from '../utils/shareUtils';
import { useAuth } from '../context/AuthContext';

function maskPhoneNumber(phone) {
  if (!phone) return "+91 98******12";
  const clean = phone.trim();
  if (clean.length < 8) return "+91 98******12";
  const prefix = clean.slice(0, Math.min(6, clean.length - 4));
  const suffix = clean.slice(-2);
  return `${prefix}******${suffix}`;
}

export default function ProfileDetailModal({ 
  profile, 
  onClose, 
  isBookmarked, 
  onToggleBookmark, 
  onShowToast, 
  onOpenPosterModal,
  allProfiles = [],
  onSelectProfile
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'islamic' | 'family' | 'contact'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { isContactUnlocked, unlockContact, pricing, isParent, isDemo: authIsDemo } = useAuth();
  const isDemo = Boolean(authIsDemo || profile?.isFakeData || profile?.id?.startsWith('DEMO-'));

  // Keyboard navigation: Escape closes, Left/Right arrow moves prev/next
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!profile) return;
      if (e.key === 'Escape') onClose();
      if (allProfiles.length > 1 && onSelectProfile) {
        const curIdx = allProfiles.findIndex(p => p.id === profile.id);
        if (e.key === 'ArrowLeft' && curIdx > 0) {
          onSelectProfile(allProfiles[curIdx - 1]);
        } else if (e.key === 'ArrowRight' && curIdx < allProfiles.length - 1) {
          onSelectProfile(allProfiles[curIdx + 1]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, profile, allProfiles, onSelectProfile]);

  if (!profile) return null;

  const {
    id,
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
  const isUnlocked = isContactUnlocked(id);
  const fee = pricing.contactUnlockFee || 15;

  const candidateDisplayName = isDemo
    ? (isBride ? 'Bride' : 'Groom')
    : isParent 
      ? `Candidate ${isBride ? 'Bride' : 'Groom'} (${id})` 
      : (basicInfo.fullName || (isBride ? 'Bride Proposal' : 'Groom Proposal'));

  const rawPhone = contactDetails.guardianPhone || contactPreferences.phone || "";
  const rawWhatsApp = contactDetails.whatsappNumber || contactPreferences.whatsapp || rawPhone;

  const islamicList = Array.isArray(islamicQualification) && islamicQualification.length > 0
    ? islamicQualification.filter(q => q && q !== 'None')
    : (islamicBackground.qualification && islamicBackground.qualification !== 'None' ? [islamicBackground.qualification] : []);

  const academicDegree = generalEducation.degreeName || educationOccupation.degree || educationOccupation.education || "";
  const academicLevel = generalEducation.level || educationOccupation.level || "";
  const subjectCategory = generalEducation.subjectCategory || "";
  const specialization = generalEducation.specialization || "";

  // Navigation indices
  const currentIndex = allProfiles.findIndex(p => p.id === id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < allProfiles.length - 1;

  const handleUnlock = () => {
    if (isDemo) {
      if (onShowToast) onShowToast("Contact details are hidden in Demo View. Sign in to access real proposals.");
      return;
    }
    if (isParent) {
      if (onShowToast) onShowToast("Contact numbers are protected in Parent View.");
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
      `Assalamu Alaikum. I am contacting regarding proposal for ${isBride ? 'Bride' : 'Groom'} (${candidateDisplayName}, ID: ${id}) found on Al-ThayyiBoon Matrimony.`
    );
    return `https://wa.me/${formattedNum}?text=${text}`;
  };

  const handleShare = () => {
    shareProfile(profile, (msg) => {
      setCopied(true);
      if (onShowToast) onShowToast(msg);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleCopyBioData = () => {
    const text = `*Al-ThayyiBoon Matrimonial Proposal*\n\n` +
      `👤 *Candidate:* ${candidateDisplayName} (ID: ${id})\n` +
      `💍 *Gender & Age:* ${isBride ? 'Bride' : 'Groom'}, ${basicInfo.age} Yrs (${basicInfo.maritalStatus || 'Never Married'})\n` +
      `📏 *Height:* ${basicInfo.height || 'N/A'}\n` +
      `📖 *Islamic Degree:* ${islamicList.join(', ') || 'General'}\n` +
      `🎓 *Academic Education:* ${academicDegree} ${specialization ? `(${specialization})` : ''}\n` +
      `💼 *Profession:* ${educationOccupation.profession || 'Not specified'}\n` +
      `📍 *Location:* ${locationFamily.homeDistrict || 'Kerala'}, ${locationFamily.nativePlace || ''}\n` +
      `👨‍👩‍👧 *Family:* ${locationFamily.familyType || 'Nuclear'}\n` +
      `📞 *Guardian Contact:* ${isDemo ? 'Hidden in Demo View' : isUnlocked ? rawPhone : 'Protected on Al-ThayyiBoon'}\n\n` +
      `🔗 *View Online:* ${window.location.origin}/profile/${id}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onShowToast) onShowToast("Bio-data formatted for WhatsApp copied!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="profile-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
      ></div>

      {/* Modal Card */}
      <div className={`relative w-full ${
        isFullscreen ? 'max-w-6xl min-h-[92vh]' : 'max-w-2xl'
      } bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-6 animate-fade-in transition-all duration-300`}>
        
        {/* Top Header Banner */}
        <div className={`p-4 sm:p-6 border-b border-slate-800 ${
          isBride ? 'bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900' : 'bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900'
        }`}>
          {/* Top Bar: Back Button, Prev/Next & Quick Actions */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold transition-all group cursor-pointer shadow-sm"
                aria-label="Back to profiles"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back</span>
              </button>

              {/* Prev / Next Profile Navigation */}
              {allProfiles.length > 1 && onSelectProfile && (
                <div className="flex items-center gap-1 pl-1">
                  <button
                    disabled={!hasPrev}
                    onClick={() => onSelectProfile(allProfiles[currentIndex - 1])}
                    className="p-1.5 rounded-lg bg-slate-800/90 text-slate-300 hover:text-white disabled:opacity-40 border border-slate-700 cursor-pointer"
                    title="Previous proposal (Left arrow)"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-400 px-1 hidden sm:inline">
                    {currentIndex + 1} / {allProfiles.length}
                  </span>
                  <button
                    disabled={!hasNext}
                    onClick={() => onSelectProfile(allProfiles[currentIndex + 1])}
                    className="p-1.5 rounded-lg bg-slate-800/90 text-slate-300 hover:text-white disabled:opacity-40 border border-slate-700 cursor-pointer"
                    title="Next proposal (Right arrow)"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Action Icon Group */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={() => onToggleBookmark(id)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title={isBookmarked ? "Remove from Favorites" : "Save Profile"}
              >
                <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-rose-400' : ''}`} />
              </button>

              <button
                onClick={handleCopyBioData}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 hover:text-emerald-300 hover:bg-slate-700 transition-colors cursor-pointer hidden xs:inline-flex"
                title="Copy Full Bio-data Text for WhatsApp"
              >
                <Copy className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenPosterModal && onOpenPosterModal(profile)}
                className="p-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors cursor-pointer"
                title="Generate Social Media Poster"
              >
                <ImageIcon className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 hover:text-emerald-300 hover:bg-slate-700 transition-colors cursor-pointer"
                title="Share Proposal"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsFullscreen(prev => !prev)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 hover:text-white hidden md:inline-flex cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Profile Name & Badges */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                isBride 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                <User className="w-3 h-3" />
                {isBride ? 'Bride' : 'Groom'} ({basicInfo.age} Yrs)
              </span>

              {islamicList.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <BookOpen className="w-3 h-3" />
                  {islamicList.join(', ')}
                </span>
              )}

              {academicDegree && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  <GraduationCap className="w-3 h-3" />
                  {academicDegree}
                </span>
              )}

              <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-800">
                {id}
              </span>
            </div>

            <h2 id="profile-detail-title" className="text-2xl font-bold text-white tracking-tight mt-1">
              {candidateDisplayName}
            </h2>

            <p className="text-xs text-slate-400 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{locationFamily.homeDistrict ? `${locationFamily.homeDistrict}, Kerala` : 'Kerala'}</span>
              <span>•</span>
              <span>{locationFamily.nativePlace || 'Native Place'}</span>
              {isParent && (
                <>
                  <span>•</span>
                  <span className="text-teal-400 font-medium">Protected Parent View</span>
                </>
              )}
            </p>
          </div>

          {/* Section Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Overview & Personal' },
              { id: 'islamic', label: 'Islamic & Academics' },
              { id: 'family', label: 'Family & Native' },
              { id: 'contact', label: 'Expectations & Contact' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-sm'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[calc(85vh-15rem)] overflow-y-auto custom-scrollbar">
          
          {/* TAB 1: OVERVIEW & PERSONAL */}
          {(activeTab === 'overview' || isFullscreen) && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 pb-1 border-b border-slate-800">
                <User className="w-4 h-4" /> Basic Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Age / DOB</span>
                  <span className="font-semibold text-white">{basicInfo.age} Yrs {basicInfo.dob ? `(${basicInfo.dob})` : ''}</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Marital Status</span>
                  <span className="font-semibold text-white">{basicInfo.maritalStatus || 'Never Married'}</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Height</span>
                  <span className="font-semibold text-white">{basicInfo.height || 'N/A'}</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Physical Status</span>
                  <span className="font-semibold text-white">{basicInfo.physicalStatus || 'Normal'}</span>
                </div>
                {basicInfo.color && basicInfo.color !== "Not Specified" && (
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">Complexion</span>
                    <span className="font-semibold text-amber-300">{basicInfo.color}</span>
                  </div>
                )}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Mother Tongue</span>
                  <span className="font-semibold text-white">{basicInfo.motherTongue || 'Malayalam'}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ISLAMIC & ACADEMIC EDUCATION */}
          {(activeTab === 'islamic' || isFullscreen) && (
            <>
              {/* Islamic Background */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 pb-1 border-b border-slate-800">
                  <BookOpen className="w-4 h-4" /> Islamic Education &amp; Background
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">Islamic Degree</span>
                    <span className="font-bold text-emerald-300 text-sm">
                      {islamicList.length > 0 ? islamicList.join(', ') : 'None'}
                    </span>
                    {islamicBackground.institution && (
                      <p className="text-[10px] text-slate-400 mt-1">{islamicBackground.institution}</p>
                    )}
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">Sect / Maslak</span>
                    <span className="font-semibold text-white">{islamicBackground.sect || 'Sunni'}</span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">Community / Lineage</span>
                    <span className="font-semibold text-white">{islamicBackground.subGroup || 'General'}</span>
                  </div>
                </div>
              </div>

              {/* General Academic Education */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5 pb-1 border-b border-slate-800">
                  <GraduationCap className="w-4 h-4" /> General Academic Education &amp; Profession
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-slate-400 block text-[11px]">Degree &amp; Qualification</span>
                    <span className="font-bold text-white text-sm block">
                      {academicDegree || educationOccupation.education || 'Not specified'}
                    </span>
                    {academicLevel && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-900 text-sky-300 text-[10px] font-semibold border border-slate-800">
                        {academicLevel}
                      </span>
                    )}
                    {subjectCategory && (
                      <div className="text-[11px] text-slate-300 pt-1">
                        <span className="text-slate-400">Subject Category:</span> <span className="text-sky-300 font-semibold">{subjectCategory}</span>
                      </div>
                    )}
                    {specialization && (
                      <div className="text-[11px] text-slate-300">
                        <span className="text-slate-400">Specialization:</span> <span className="text-white font-medium">{specialization}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-slate-400 block text-[11px]">Profession &amp; Employment</span>
                    <span className="font-bold text-amber-300 text-sm block">
                      {educationOccupation.jobTitle || educationOccupation.profession || 'Not specified'}
                    </span>
                    {educationOccupation.employerName && (
                      <p className="text-slate-300 text-xs">{educationOccupation.employerName}</p>
                    )}
                    <p className="text-[11px] text-slate-400 pt-1">
                      Location: {educationOccupation.workLocation || 'Kerala'} ({educationOccupation.workCountry || 'India'})
                    </p>
                    {educationOccupation.annualIncome && (
                      <p className="text-[11px] text-emerald-400 font-medium">Income: {educationOccupation.annualIncome}</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 3: LOCATION & FAMILY */}
          {(activeTab === 'family' || isFullscreen) && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 pb-1 border-b border-slate-800">
                <Home className="w-4 h-4" /> Location &amp; Family Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-2">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Home District</span>
                  <span className="font-semibold text-white">{locationFamily.homeDistrict || 'Kerala'}</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Native Place</span>
                  <span className="font-semibold text-white">{locationFamily.nativePlace || 'N/A'}</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Family Type</span>
                  <span className="font-semibold text-white">{locationFamily.familyType || 'Nuclear'}</span>
                </div>
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
                <p className="text-slate-300">
                  <span className="text-slate-400 font-medium">Father:</span> {isDemo ? 'Hidden in Demo View' : isParent ? 'Protected for Parent View' : (locationFamily.fatherName || 'Father details provided to Wali')}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400 font-medium">Mother:</span> {isDemo ? 'Hidden in Demo View' : isParent ? 'Protected for Parent View' : (locationFamily.motherName || 'Mother details provided to Wali')}
                </p>
                {locationFamily.siblings && (
                  <p className="text-slate-300">
                    <span className="text-slate-400 font-medium">Siblings:</span> {locationFamily.siblings}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: EXPECTATIONS & GUARDIAN CONTACT */}
          {(activeTab === 'contact' || isFullscreen) && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 pb-1 border-b border-slate-800">
                <FileText className="w-4 h-4" /> Partner Preferences &amp; Guardian Contact
              </h3>
              
              {contactPreferences.expectations && (
                <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/25 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Expectations &amp; Preferences</span>
                  </div>
                  <p className="text-slate-200 italic leading-relaxed whitespace-pre-line">
                    "{contactPreferences.expectations}"
                  </p>
                </div>
              )}

              {/* Guardian Contact Details Box with Pay-Per-View Unlock Gate */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Guardian Name</span>
                    <span className="font-bold text-white text-sm">
                      {isDemo
                        ? 'Hidden in Demo View'
                        : isParent 
                          ? 'Protected Guardian Name' 
                          : (contactPreferences.guardianName || contactPreferences.contactPerson || 'Parent / Guardian')}
                    </span>
                  </div>
                  <div>
                    {isDemo ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Demo Mode</span>
                      </span>
                    ) : isParent ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-bold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Parent Privacy Mode</span>
                      </span>
                    ) : isUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-bold">
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Contact Unlocked</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Contact Protected</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Phone & WhatsApp Numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="flex items-center justify-between bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-sky-400" /> Phone:
                    </span>
                    <span className="font-mono font-bold text-white text-xs">
                      {isDemo
                        ? 'Hidden in Demo View'
                        : isParent 
                          ? 'Protected for Parent View' 
                          : (isUnlocked ? rawPhone || 'Available' : maskPhoneNumber(rawPhone))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp:
                    </span>
                    <span className="font-mono font-bold text-emerald-300 text-xs">
                      {isDemo
                        ? 'Hidden in Demo View'
                        : isParent 
                          ? 'Protected for Parent View' 
                          : (isUnlocked ? rawWhatsApp || 'Available' : maskPhoneNumber(rawWhatsApp))}
                    </span>
                  </div>
                </div>

                {/* Notice Banner or Unlock Button */}
                {isDemo ? (
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center gap-3 mt-2">
                    <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                    <p className="text-[11px] text-amber-200/90 leading-relaxed">
                      <span className="font-bold text-amber-300">Demo View Active:</span> Candidate personal names and contact details are hidden in demo mode. To initiate contact with verified candidates and walis, please sign in.
                    </p>
                  </div>
                ) : isParent ? (
                  <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/30 flex items-center gap-3 mt-2">
                    <Lock className="w-4 h-4 text-teal-400 shrink-0" />
                    <p className="text-[11px] text-teal-200/90 leading-relaxed">
                      <span className="font-bold text-teal-300">Shariah Modesty Notice:</span> In Parent View, candidate and guardian phone numbers remain guarded. To initiate direct matrimonial contact, sign in as a Groom or Bride.
                    </p>
                  </div>
                ) : !isUnlocked ? (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
                    <div className="text-xs text-slate-300 text-center sm:text-left">
                      <p className="font-bold text-white flex items-center justify-center sm:justify-start gap-1">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Unlock Verified Guardian Contact</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Get instant access to phone number &amp; direct WhatsApp messaging
                      </p>
                    </div>
                    <button
                      onClick={handleUnlock}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-900/40 flex items-center justify-center gap-1.5 active:scale-95 transition-all shrink-0 cursor-pointer"
                    >
                      <Coins className="w-4 h-4" />
                      <span>Unlock (₹{fee} / 1 Credit)</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Back</span>
          </button>

          {isDemo ? (
            <div className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-300 font-semibold text-xs text-center flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Contact Details Hidden in Demo View</span>
            </div>
          ) : isParent ? (
            <div className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-900 border border-teal-500/30 text-teal-300 font-semibold text-xs text-center flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-teal-400" />
              <span>Contact Protected in Parent View</span>
            </div>
          ) : isUnlocked ? (
            <>
              {rawWhatsApp && (
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              )}

              {rawPhone && (
                <a
                  href={`tel:${rawPhone.replace(/[^0-9+]/g, "")}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call Guardian</span>
                </a>
              )}
            </>
          ) : (
            <button
              onClick={handleUnlock}
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>Unlock Guardian Contact (₹{fee})</span>
            </button>
          )}

          <button
            onClick={() => onOpenPosterModal && onOpenPosterModal(profile)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>Poster</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm border border-slate-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-emerald-400" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
