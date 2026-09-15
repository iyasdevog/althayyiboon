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
  Share2
} from 'lucide-react';
import { shareProfile } from '../utils/shareUtils';

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


export default function ProfileCard({ 
  profile, 
  onSelectProfile, 
  isBookmarked, 
  onToggleBookmark,
  onOpenEditModal,
  onShowToast
}) {
  const {
    id,
    basicInfo = {},
    islamicBackground = {},
    educationOccupation = {},
    locationFamily = {},
    contactPreferences = {}
  } = profile;

  const isBride = basicInfo.gender === "Bride";
  const isWafiOrSpecial = ["Wafi", "Wafiyya", "Hudawi", "Zahravi", "Baqavi", "Faizy", "Saqafi", "Sa-adi", "Hasani", "Adani", "Bathooliyya", "Falil", "Falila", "Sidheequi", "Anwari", "Latheefi", "Marjani", "Sayyid / Thangal Family"].some(
    tag => (islamicBackground.qualification || "").includes(tag) || (islamicBackground.subGroup || "").includes(tag)
  );

  const getWhatsAppLink = () => {
    const rawNumber = (contactPreferences.whatsapp || contactPreferences.phone || "").replace(/[^0-9]/g, "");
    const formattedNum = rawNumber.startsWith("91") || rawNumber.startsWith("966") || rawNumber.startsWith("971") || rawNumber.startsWith("974") 
      ? rawNumber 
      : "91" + rawNumber;

    const text = encodeURIComponent(
      `Assalamu Alaikum. I am interested in proposal for ${basicInfo.fullName || 'Candidate'} (${basicInfo.gender || 'Candidate'}, ${basicInfo.age || ''} Yrs) listed on Al-ThayyiBoon Matrimony Directory. Please share further details.`
    );
    return `https://wa.me/${formattedNum}?text=${text}`;
  };

  return (
    <div className="group relative glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 active:scale-[0.98] sm:hover:-translate-y-1 sm:hover:shadow-xl sm:hover:shadow-emerald-950/40 card-pressable">
      
      {/* Top Row: Badges + Actions */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          {/* Left: Gender badge + qual badge */}
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg border ${
              isBride
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
            }`}>
              <User className="w-3 h-3" />
              <span>{basicInfo.gender}</span>
              <span className="opacity-40">•</span>
              <span>{basicInfo.age} Yrs</span>
            </span>

            {islamicBackground.qualification && islamicBackground.qualification !== "None" && (
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg border ${
                isWafiOrSpecial
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 font-bold'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                <BookOpen className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate max-w-[100px]">{islamicBackground.qualification}</span>
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
              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-300 hover:bg-slate-800 transition-colors"
              title="Edit / Remove Proposal"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(id);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/80'
              }`}
              title={isBookmarked ? "Remove from Favorites" : "Save to Favorites"}
            >
              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-rose-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Name & meta */}
        <div className="mb-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
              {basicInfo.fullName || "Community Member"}
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 flex flex-wrap items-center gap-1 mt-0.5">
            <span>{basicInfo.maritalStatus || 'Unmarried'}</span>
            <span>•</span>
            <span>{basicInfo.height || 'Height N/A'}</span>
            {basicInfo.color && basicInfo.color !== "Not Specified" && (
              <>
                <span>•</span>
                <span className="text-amber-300/90">{basicInfo.color}</span>
              </>
            )}
          </p>
        </div>

        {/* Key Detail List */}
        <div className="space-y-1.5 text-xs text-slate-300 mb-3.5 border-t border-b border-slate-800/80 py-2.5">
          
          <div className="flex items-start gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1 font-medium text-slate-200">
              {educationOccupation.education || 'Education not specified'}
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
          className="flex-1 inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 active:bg-slate-600/90 text-white font-semibold text-xs border border-slate-700/70 transition-colors"
        >
          <span>View Profile</span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            shareProfile(profile, onShowToast);
          }}
          className="inline-flex items-center justify-center p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          title="Share Proposal Link"
        >
          <Share2 className="w-4 h-4 text-emerald-400" />
        </button>

        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 active:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 transition-colors"
          title="Direct WhatsApp Contact"
        >
          <MessageSquare className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}
