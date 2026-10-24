import React from 'react';
import { 
  User, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  BookOpen, 
  MessageSquare,
  Sparkles,
  Heart,
  ChevronRight,
  Edit,
  Clock,
  Share2,
  Image as ImageIcon,
  Lock,
  Unlock,
  Coins,
  Phone
} from 'lucide-react';
import { shareProfile } from '../utils/shareUtils';
import { useAuth } from '../context/AuthContext';

// Format createdAt ISO string into a friendly relative label
function formatPostedDate(dateStr) {
  if (!dateStr) return null;
  try {
    const posted = new Date(dateStr);
    const now = new Date();
    const diffMs = now - posted;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Posted today';
    if (diffDays === 1) return 'Posted yesterday';
    if (diffDays < 30) return `Posted ${diffDays}d ago`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `Posted ${months}mo ago`;
    }
    return posted.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return null;
  }
}

// Phone number masking utility: e.g. +91 98******12
function maskPhoneNumber(phone) {
  if (!phone) return "+91 98******12";
  const clean = phone.trim();
  if (clean.length < 8) return "+91 98******12";
  // keep first 6 chars, mask middle, keep last 2
  const prefix = clean.slice(0, Math.min(6, clean.length - 4));
  const suffix = clean.slice(-2);
  return `${prefix}******${suffix}`;
}

export default function ProfileCard({ 
  profile, 
  onSelectProfile, 
  isBookmarked, 
  onToggleBookmark,
  onOpenEditModal,
  onShowToast,
  onOpenPosterModal
}) {
  const { isContactUnlocked, unlockContact, pricing } = useAuth();

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

  // Raw phone & whatsapp
  const rawPhone = contactDetails.guardianPhone || contactPreferences.phone || "";
  const rawWhatsApp = contactDetails.whatsappNumber || contactPreferences.whatsapp || rawPhone;

  // Islamic qualifications array
  const islamicList = Array.isArray(islamicQualification) && islamicQualification.length > 0
    ? islamicQualification.filter(q => q && q !== 'None')
    : (islamicBackground.qualification && islamicBackground.qualification !== 'None' ? [islamicBackground.qualification] : []);

  // General academic degree display
  const academicDegree = generalEducation.degreeName || educationOccupation.degree || educationOccupation.education || "";
  const subjectCategory = generalEducation.subjectCategory || "";
  const specialization = generalEducation.specialization || "";

  const fee = pricing.contactUnlockFee || 15;

  const handleUnlockClick = (e) => {
    e.stopPropagation();
    const result = unlockContact(profile);
    if (result.success) {
      if (onShowToast) {
        onShowToast(`Guardian contact unlocked successfully! (-1 Credit)`);
      }
    }
  };

  const getWhatsAppLink = () => {
    const rawNumber = (rawWhatsApp || "").replace(/[^0-9]/g, "");
    const formattedNum = rawNumber.startsWith("91") || rawNumber.startsWith("966") || rawNumber.startsWith("971") || rawNumber.startsWith("974") 
      ? rawNumber 
      : "91" + rawNumber;

    const text = encodeURIComponent(
      `Assalamu Alaikum. I am contacting regarding proposal for ${isBride ? 'Bride' : 'Groom'} (${basicInfo.gender || 'Candidate'}, ${basicInfo.age || ''} Yrs, ID: ${id}) listed on Al-ThayyiBoon Matrimony.`
    );
    return `https://wa.me/${formattedNum}?text=${text}`;
  };

  return (
    <article 
      id={`profile-card-${id}`}
      aria-labelledby={`profile-heading-${id}`}
      className="group relative glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 active:scale-[0.98] sm:hover:-translate-y-1 sm:hover:shadow-xl sm:hover:shadow-emerald-950/40 card-pressable border border-slate-800"
    >
      
      {/* Top Row: Gender Badge + Badges + Actions */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          
          {/* Left: Gender + Badges */}
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
              isBride
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
            }`}>
              <User className="w-3 h-3" />
              <span>{isBride ? 'Bride' : 'Groom'}</span>
              <span className="opacity-40">•</span>
              <span>{basicInfo.age} Yrs</span>
            </span>

            {/* ISLAMIC QUALIFICATION BADGE (Emerald/Green) */}
            {islamicList.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm">
                <BookOpen className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[120px]">{islamicList.join(', ')}</span>
              </span>
            )}

            {/* GENERAL ACADEMIC BADGE (Sky / Blue / Slate) */}
            {academicDegree && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm">
                <GraduationCap className="w-3 h-3 text-sky-400 shrink-0" />
                <span className="truncate max-w-[140px]">
                  {academicDegree}
                  {specialization && !academicDegree.includes(specialization) ? ` (${specialization})` : ''}
                </span>
              </span>
            )}

            {islamicBackground.subGroup && islamicBackground.subGroup.includes("Sayyid") && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-2.5 h-2.5" /> Sayyid
              </span>
            )}

          </div>

          {/* Right: Edit + Bookmark */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenEditModal(profile);
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-300 hover:bg-slate-800 transition-colors touch-target"
              title="Edit / Remove Proposal"
              aria-label={`Edit or remove proposal ${id}`}
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(id);
              }}
              className={`p-1.5 rounded-lg transition-colors touch-target ${
                isBookmarked
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/80'
              }`}
              title={isBookmarked ? "Remove from Favorites" : "Save to Favorites"}
              aria-label={isBookmarked ? `Remove proposal ${id} from favorites` : `Save proposal ${id} to favorites`}
            >
              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-rose-400' : ''}`} />
            </button>
          </div>

        </div>

        {/* Name, ID & Basic Details */}
        <div className="mb-2.5">
          <div className="flex items-center justify-between gap-2">
            <h3 
              id={`profile-heading-${id}`}
              className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors truncate"
            >
              {basicInfo.fullName || (isBride ? 'Bride Proposal' : 'Groom Proposal')}
            </h3>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
              {id}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 flex flex-wrap items-center gap-1 mt-0.5">
            <span>{basicInfo.maritalStatus || 'Never Married'}</span>
            <span>•</span>
            <span>{basicInfo.height || 'Height N/A'}</span>
            {basicInfo.color && basicInfo.color !== "Not Specified" && (
              <>
                <span>•</span>
                <span className="text-amber-300/90">{basicInfo.color}</span>
              </>
            )}
            {subjectCategory && (
              <>
                <span>•</span>
                <span className="text-sky-300/80">{subjectCategory}</span>
              </>
            )}
          </p>
        </div>

        {/* Key Detail List */}
        <div className="space-y-1.5 text-xs text-slate-300 mb-3 border-t border-b border-slate-800/80 py-2.5">
          
          <div className="flex items-start gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1 font-medium text-slate-200">
              {academicDegree ? academicDegree : (educationOccupation.education || 'Education not specified')}
              {generalEducation.level ? ` • ${generalEducation.level}` : ''}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1 text-slate-300">
              {educationOccupation.profession || 'Not specified'} 
              {educationOccupation.workCountry && educationOccupation.workCountry !== 'India' && (
                <span className="text-amber-300 font-medium"> ({educationOccupation.workCountry})</span>
              )}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1 text-slate-300">
              {locationFamily.homeDistrict ? `${locationFamily.homeDistrict}` : 'Kerala'}, {locationFamily.nativePlace || 'Native place'}
            </span>
          </div>

        </div>

        {/* Guardian Contact Info / Masked State */}
        <div className="mb-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>Guardian Phone</span>
              {isUnlocked ? (
                <span className="text-[9px] text-emerald-400 font-extrabold uppercase bg-emerald-500/10 px-1 rounded">Unlocked</span>
              ) : (
                <span className="text-[9px] text-amber-400 font-extrabold uppercase bg-amber-500/10 px-1 rounded">Protected</span>
              )}
            </div>
            <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">
              {isUnlocked ? rawPhone || "Contact provided" : maskPhoneNumber(rawPhone)}
            </div>
          </div>

          {/* Pay-Per-View Unlock CTA Button if not unlocked */}
          {!isUnlocked ? (
            <button
              onClick={handleUnlockClick}
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-[11px] shadow-sm flex items-center gap-1 transition-all active:scale-95 shrink-0"
              title="Unlock Guardian Phone and WhatsApp"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Unlock (₹{fee} / 1 Credit)</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <Unlock className="w-3.5 h-3.5" />
              <span>Verified</span>
            </span>
          )}
        </div>

      </div>

      {/* Posted Date */}
      {(() => {
        const label = formatPostedDate(profile.createdAt);
        return label ? (
          <div className="flex items-center gap-1 mb-2.5 mt-[-4px]">
            <Clock className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="text-[10px] text-slate-500 font-medium">{label}</span>
          </div>
        ) : null;
      })()}

      {/* Action Footer */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => onSelectProfile(profile)}
          className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 active:bg-slate-600/90 text-white font-semibold text-xs border border-slate-700/70 transition-colors touch-target"
          aria-label={`View full details of proposal ${id}`}
        >
          <span>View Profile</span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenPosterModal) onOpenPosterModal(profile);
          }}
          className="inline-flex items-center justify-center p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors touch-target"
          title="Generate Social Poster Photo"
          aria-label={`Generate social poster card for proposal ${id}`}
        >
          <ImageIcon className="w-4 h-4 text-amber-400" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            shareProfile(profile, onShowToast);
          }}
          className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors touch-target"
          title="Share Proposal Link"
          aria-label={`Share link for proposal ${id}`}
        >
          <Share2 className="w-4 h-4 text-emerald-400" />
        </button>

        {/* WhatsApp Button: Direct if unlocked, or prompt unlock */}
        {isUnlocked ? (
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 active:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 transition-colors touch-target"
            title="Direct WhatsApp Chat"
            aria-label={`Chat directly on WhatsApp with guardian of proposal ${id}`}
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        ) : (
          <button
            onClick={handleUnlockClick}
            className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition-colors touch-target"
            title="Unlock Contact to Chat on WhatsApp"
            aria-label={`Unlock contact to chat on WhatsApp with guardian of proposal ${id}`}
          >
            <Lock className="w-4 h-4 text-amber-400" />
          </button>
        )}
      </div>

    </article>
  );
}
