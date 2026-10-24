import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft,
  Phone, 
  MessageSquare, 
  Share2, 
  Printer, 
  User, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  MapPin, 
  Home, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  FileText,
  Image as ImageIcon,
  Lock,
  Unlock,
  Coins,
  Check
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

export default function ProfileDetailModal({ profile, onClose, isBookmarked, onToggleBookmark, onShowToast, onOpenPosterModal }) {
  const [copied, setCopied] = useState(false);
  const { isContactUnlocked, unlockContact, pricing } = useAuth();

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

  const rawPhone = contactDetails.guardianPhone || contactPreferences.phone || "";
  const rawWhatsApp = contactDetails.whatsappNumber || contactPreferences.whatsapp || rawPhone;

  const islamicList = Array.isArray(islamicQualification) && islamicQualification.length > 0
    ? islamicQualification.filter(q => q && q !== 'None')
    : (islamicBackground.qualification && islamicBackground.qualification !== 'None' ? [islamicBackground.qualification] : []);

  const academicDegree = generalEducation.degreeName || educationOccupation.degree || educationOccupation.education || "";
  const academicLevel = generalEducation.level || educationOccupation.level || "";
  const subjectCategory = generalEducation.subjectCategory || "";
  const specialization = generalEducation.specialization || "";

  const handleUnlock = () => {
    const res = unlockContact(profile);
    if (res.success && onShowToast) {
      onShowToast("Guardian contact unlocked successfully! (-1 Credit)");
    }
  };

  const getWhatsAppLink = () => {
    const rawNumber = (rawWhatsApp || "").replace(/[^0-9]/g, "");
    const formattedNum = rawNumber.startsWith("91") || rawNumber.startsWith("966") || rawNumber.startsWith("971") || rawNumber.startsWith("974") 
      ? rawNumber 
      : "91" + rawNumber;

    const text = encodeURIComponent(
      `Assalamu Alaikum. I am contacting regarding proposal for ${isBride ? 'Bride' : 'Groom'} (${basicInfo.fullName || 'Candidate'}, ID: ${id}) found on Al-ThayyiBoon Matrimony.`
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 animate-fade-in">
        
        {/* Modal Top Banner Header */}
        <div className={`p-5 sm:p-6 border-b border-slate-800 ${
          isBride ? 'bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900' : 'bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900'
        }`}>
          {/* Top Bar: Back Button & Actions */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold transition-all group touch-target shadow-sm"
              aria-label="Back to profiles"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Directory</span>
            </button>

            {/* Action Icon Group */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onToggleBookmark(id)}
                className={`p-2 rounded-xl border transition-colors ${
                  isBookmarked
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title={isBookmarked ? "Remove from Favorites" : "Save Profile"}
              >
                <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-rose-400' : ''}`} />
              </button>

              <button
                onClick={() => {
                  if (onOpenPosterModal) onOpenPosterModal(profile);
                }}
                className="p-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                title="Generate Social Media Poster"
              >
                <ImageIcon className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 hover:text-emerald-300 hover:bg-slate-700 transition-colors"
                title="Share Proposal"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrint}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 hover:text-white transition-colors"
                title="Print Proposal Details"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-700 transition-colors"
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

            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              {basicInfo.fullName || (isBride ? 'Bride Proposal' : 'Groom Proposal')}
            </h2>

            <p className="text-xs text-slate-400 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{locationFamily.homeDistrict ? `${locationFamily.homeDistrict}, Kerala` : 'Kerala'}</span>
              <span>•</span>
              <span>{locationFamily.nativePlace || 'Native Place'}</span>
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 max-h-[calc(85vh-12rem)] overflow-y-auto custom-scrollbar">
          
          {/* Section 1: Basic Information */}
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
                  <span className="text-slate-400 block text-[11px]">Color / Complexion</span>
                  <span className="font-semibold text-amber-300">{basicInfo.color}</span>
                </div>
              )}
              {basicInfo.motherTongue && (
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Mother Tongue</span>
                  <span className="font-semibold text-white">{basicInfo.motherTongue}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Islamic Education & Background */}
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

          {/* Section 3: General Academic Education & Subject Specialization */}
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

          {/* Section 4: Location & Family Details */}
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
                <span className="text-slate-400 block text-[11px]">Native City</span>
                <span className="font-semibold text-white">{locationFamily.nativePlace || 'N/A'}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Family Type</span>
                <span className="font-semibold text-white">{locationFamily.familyType || 'Nuclear'}</span>
              </div>
            </div>
            {locationFamily.fatherName && (
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1">
                <p className="text-slate-300"><span className="text-slate-400">Father:</span> {locationFamily.fatherName}</p>
                {locationFamily.motherName && <p className="text-slate-300"><span className="text-slate-400">Mother:</span> {locationFamily.motherName}</p>}
                {locationFamily.siblings && <p className="text-slate-300"><span className="text-slate-400">Siblings:</span> {locationFamily.siblings}</p>}
              </div>
            )}
          </div>

          {/* Section 5: Partner Preferences & Guardian Contact (Pay-Per-View Guarded) */}
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

            {/* Guardian Contact Details Box with Unlock Gate */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Guardian Name</span>
                  <span className="font-bold text-white text-sm">
                    {contactPreferences.guardianName || contactPreferences.contactPerson || 'Parent / Guardian'}
                  </span>
                </div>
                <div>
                  {isUnlocked ? (
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

              {/* Numbers Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="flex items-center justify-between bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-sky-400" /> Phone:
                  </span>
                  <span className="font-mono font-bold text-white text-xs">
                    {isUnlocked ? rawPhone || 'Available' : maskPhoneNumber(rawPhone)}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp:
                  </span>
                  <span className="font-mono font-bold text-emerald-300 text-xs">
                    {isUnlocked ? rawWhatsApp || 'Available' : maskPhoneNumber(rawWhatsApp)}
                  </span>
                </div>
              </div>

              {/* Pay-Per-View Banner if NOT Unlocked */}
              {!isUnlocked && (
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
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-900/40 flex items-center justify-center gap-1.5 active:scale-95 transition-all shrink-0"
                  >
                    <Coins className="w-4 h-4" />
                    <span>Unlock (₹{fee} / 1 Credit)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2.5">
          
          <button
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Back</span>
          </button>

          {/* If unlocked: Direct WhatsApp & Call buttons */}
          {isUnlocked ? (
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
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-900/30 transition-all"
            >
              <Coins className="w-4 h-4" />
              <span>Unlock Guardian Contact (₹{fee} / 1 Credit)</span>
            </button>
          )}

          <button
            onClick={() => {
              if (onOpenPosterModal) onOpenPosterModal(profile);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs sm:text-sm border border-slate-700 transition-all"
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>Poster</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-emerald-400" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>

        </div>

      </div>
    </div>
  );
}
