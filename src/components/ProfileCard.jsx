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
  Phone,
  Scale
} from 'lucide-react';
import { shareProfile } from '../utils/shareUtils';
import { useAuth } from '../context/AuthContext';

function formatPostedDate(dateStr) {
  if (!dateStr) return null;
  try {
    const posted = new Date(dateStr);
    const now = new Date();
    const diffMs = now - posted;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 24) return { text: 'Posted today', isNew: true };
    if (diffDays === 1) return { text: 'Posted yesterday', isNew: true };
    if (diffDays < 7) return { text: `Posted ${diffDays}d ago`, isNew: diffDays <= 2 };
    if (diffDays < 30) return { text: `Posted ${diffDays}d ago`, isNew: false };
    return { text: posted.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), isNew: false };
  } catch {
    return null;
  }
}

function maskPhoneNumber(phone) {
  if (!phone) return "+91 98******12";
  const clean = phone.trim();
  if (clean.length < 8) return "+91 98******12";
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
  onOpenPosterModal,
  isCompared = false,
  onToggleCompare,
  viewMode = 'grid'
}) {
  const { isContactUnlocked, unlockContact, pricing, isParent, isDemo: authIsDemo } = useAuth();
  const isDemo = Boolean(authIsDemo || profile.isFakeData || profile.id?.startsWith('DEMO-'));

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

  const rawPhone = contactDetails.guardianPhone || contactPreferences.phone || "";
  const rawWhatsApp = contactDetails.whatsappNumber || contactPreferences.whatsapp || rawPhone;

  const candidateDisplayName = isDemo
    ? (isBride ? 'Bride' : 'Groom')
    : isParent 
      ? `Candidate ${isBride ? 'Bride' : 'Groom'} (${id})` 
      : (basicInfo.fullName || (isBride ? 'Bride Proposal' : 'Groom Proposal'));

  const islamicList = Array.isArray(islamicQualification) && islamicQualification.length > 0
    ? islamicQualification.filter(q => q && q !== 'None')
    : (islamicBackground.qualification && islamicBackground.qualification !== 'None' ? [islamicBackground.qualification] : []);

  const academicDegree = generalEducation.degreeName || educationOccupation.degree || educationOccupation.education || "";
  const subjectCategory = generalEducation.subjectCategory || "";
  const specialization = generalEducation.specialization || "";

  const fee = pricing.contactUnlockFee || 15;
  const postedInfo = formatPostedDate(profile.createdAt);

  const handleUnlockClick = (e) => {
    e.stopPropagation();
    if (isDemo) {
      if (onShowToast) {
        onShowToast("Contact details are hidden in Demo View. Sign in for real verified proposals.");
      }
      return;
    }
    if (isParent) {
      if (onShowToast) {
        onShowToast("Names & direct phone numbers are protected in Parent View.");
      }
      return;
    }
    const result = unlockContact(profile);
    if (result.success && onShowToast) {
      onShowToast(`Guardian contact unlocked successfully! (-1 Credit)`);
    }
  };

  const getWhatsAppLink = () => {
    if (isDemo || isParent) return "#";
    const rawNumber = (rawWhatsApp || "").replace(/[^0-9]/g, "");
    const formattedNum = rawNumber.startsWith("91") || rawNumber.startsWith("966") || rawNumber.startsWith("971") || rawNumber.startsWith("974") 
      ? rawNumber 
      : "91" + rawNumber;

    const text = encodeURIComponent(
      `Assalamu Alaikum. I am contacting regarding proposal for ${isBride ? 'Bride' : 'Groom'} (${candidateDisplayName}, ${basicInfo.age || ''} Yrs, ID: ${id}) listed on Al-ThayyiBoon Matrimony.`
    );
    return `https://wa.me/${formattedNum}?text=${text}`;
  };

  // ===================== LIST VIEW =====================
  if (viewMode === 'list') {
    return (
      <article 
        id={`profile-card-${id}`}
        aria-labelledby={`profile-heading-${id}`}
        onClick={() => onSelectProfile(profile)}
        className="group relative glass-card rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all duration-200 border border-slate-800 hover:border-slate-700 hover:shadow-lg cursor-pointer"
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Gender Indicator Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            isBride ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
          }`}>
            <User className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                isBride ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
              }`}>
                {isBride ? 'Bride' : 'Groom'} • {basicInfo.age} Yrs
              </span>

              {islamicList.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {islamicList.join(', ')}
                </span>
              )}

              {academicDegree && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30 truncate max-w-[150px]">
                  {academicDegree}
                </span>
              )}

              {postedInfo?.isNew && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                  NEW
                </span>
              )}
            </div>

            <h3 id={`profile-heading-${id}`} className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
              {candidateDisplayName}
            </h3>

            <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
              <span>{educationOccupation.profession || 'Profession N/A'}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-rose-400" /> {locationFamily.homeDistrict || 'Kerala'}</span>
            </p>
          </div>
        </div>

        {/* Right side actions in list view */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
          {onToggleCompare && (
            <button
              onClick={onToggleCompare}
              className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                isCompared ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={isCompared ? "Remove from comparison" : "Add to comparison"}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => onToggleBookmark(id)}
            className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
              isBookmarked ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Save to favorites"
          >
            <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-rose-400' : ''}`} />
          </button>

          <button
            onClick={() => onSelectProfile(profile)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 cursor-pointer"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </article>
    );
  }

  // ===================== GRID VIEW (DEFAULT) =====================
  return (
    <article 
      id={`profile-card-${id}`}
      aria-labelledby={`profile-heading-${id}`}
      className={`group relative glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 card-pressable border ${
        isBride ? 'hover:border-rose-500/40' : 'hover:border-emerald-500/40'
      } border-slate-800`}
    >
      
      {/* Top Row: Gender Badge + Qualifications + Actions */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          
          {/* Left Badges */}
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

            {postedInfo?.isNew && (
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm animate-pulse">
                NEW
              </span>
            )}

            {/* Islamic Qualification Badge */}
            {islamicList.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm">
                <BookOpen className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[120px]">{islamicList.join(', ')}</span>
              </span>
            )}

            {/* Academic Badge */}
            {academicDegree && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm">
                <GraduationCap className="w-3 h-3 text-sky-400 shrink-0" />
                <span className="truncate max-w-[130px]">
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

          {/* Right Action Icons */}
          <div className="flex items-center gap-0.5 shrink-0">
            {onToggleCompare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare();
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isCompared ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-500 hover:text-white hover:bg-slate-800'
                }`}
                title={isCompared ? "Remove from comparison" : "Add to comparison"}
                aria-label="Toggle comparison"
              >
                <Scale className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenEditModal(profile);
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-300 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Edit / Remove Proposal"
              aria-label={`Edit proposal ${id}`}
            >
              <Edit className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(id);
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/80'
              }`}
              title={isBookmarked ? "Remove from Favorites" : "Save to Favorites"}
              aria-label={`Favorite proposal ${id}`}
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
              {candidateDisplayName}
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
            {isParent && (
              <>
                <span>•</span>
                <span className="text-teal-400 font-medium">Protected View</span>
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
              {isDemo ? (
                <span className="text-[9px] text-amber-400 font-extrabold uppercase bg-amber-500/10 px-1 rounded">Demo View</span>
              ) : isParent ? (
                <span className="text-[9px] text-teal-400 font-extrabold uppercase bg-teal-500/10 px-1 rounded">Parent View</span>
              ) : isUnlocked ? (
                <span className="text-[9px] text-emerald-400 font-extrabold uppercase bg-emerald-500/10 px-1 rounded">Unlocked</span>
              ) : (
                <span className="text-[9px] text-amber-400 font-extrabold uppercase bg-amber-500/10 px-1 rounded">Protected</span>
              )}
            </div>
            <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">
              {isDemo
                ? "Hidden in Demo Mode"
                : isParent 
                  ? "Protected for Parent View"
                  : (isUnlocked ? rawPhone || "Contact provided" : maskPhoneNumber(rawPhone))}
            </div>
          </div>

          {/* Pay-Per-View Unlock CTA Button */}
          {isDemo ? (
            <span className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-semibold flex items-center gap-1 shrink-0">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Hidden</span>
            </span>
          ) : isParent ? (
            <span className="px-2.5 py-1.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[11px] font-semibold flex items-center gap-1 shrink-0">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span>Hidden</span>
            </span>
          ) : !isUnlocked ? (
            <button
              onClick={handleUnlockClick}
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-[11px] shadow-sm flex items-center gap-1 transition-all active:scale-95 shrink-0 cursor-pointer"
              title="Unlock Guardian Phone and WhatsApp"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Unlock (₹{fee})</span>
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
      {postedInfo?.text && (
        <div className="flex items-center gap-1 mb-2.5 mt-[-4px]">
          <Clock className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="text-[10px] text-slate-500 font-medium">{postedInfo.text}</span>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => onSelectProfile(profile)}
          className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 active:bg-slate-600/90 text-white font-semibold text-xs border border-slate-700/70 transition-colors touch-target cursor-pointer"
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
          className="inline-flex items-center justify-center p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors touch-target cursor-pointer"
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
          className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors touch-target cursor-pointer"
          title="Share Proposal Link"
          aria-label={`Share link for proposal ${id}`}
        >
          <Share2 className="w-4 h-4 text-emerald-400" />
        </button>

        {/* WhatsApp Direct / Unlock Chat */}
        {isDemo ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onShowToast) onShowToast("Contact details are hidden in Demo View. Sign in for real verified proposals.");
            }}
            className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-800 text-slate-500 border border-slate-700/60 transition-colors touch-target opacity-70 cursor-pointer"
            title="Contact details hidden in Demo Mode"
            aria-label="Contact details hidden in Demo Mode"
          >
            <Lock className="w-4 h-4 text-slate-400" />
          </button>
        ) : isParent ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onShowToast) onShowToast("Direct WhatsApp contact numbers are protected in Parent View.");
            }}
            className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-800 text-slate-500 border border-slate-700/60 transition-colors touch-target opacity-70 cursor-pointer"
            title="Contact numbers protected in Parent View"
            aria-label="Contact numbers protected in Parent View"
          >
            <Lock className="w-4 h-4 text-slate-400" />
          </button>
        ) : isUnlocked ? (
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors touch-target"
            title="Direct WhatsApp Chat"
            aria-label={`Chat directly on WhatsApp with guardian of proposal ${id}`}
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        ) : (
          <button
            onClick={handleUnlockClick}
            className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition-colors touch-target cursor-pointer"
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
