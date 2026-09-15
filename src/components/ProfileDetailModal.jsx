import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Share2, 
  Copy, 
  Check, 
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
  FileText
} from 'lucide-react';

export default function ProfileDetailModal({ profile, onClose, isBookmarked, onToggleBookmark }) {
  const [copied, setCopied] = useState(false);

  if (!profile) return null;

  const {
    id,
    basicInfo = {},
    islamicBackground = {},
    educationOccupation = {},
    locationFamily = {},
    contactPreferences = {}
  } = profile;

  const isBride = basicInfo.gender === "Bride";

  const getWhatsAppLink = () => {
    const rawNumber = (contactPreferences.whatsapp || contactPreferences.phone || "").replace(/[^0-9]/g, "");
    const formattedNum = rawNumber.startsWith("91") || rawNumber.startsWith("966") || rawNumber.startsWith("971") || rawNumber.startsWith("974") 
      ? rawNumber 
      : "91" + rawNumber;

    const text = encodeURIComponent(
      `Assalamu Alaikum. I am contacting regarding Profile #${id} (${basicInfo.fullName || 'Candidate'}) found on Al-ThayyiBoon Matrimony Directory.`
    );
    return `https://wa.me/${formattedNum}?text=${text}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `?profile=${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 animate-fade-in">
        
        {/* Modal Top Banner Header */}
        <div className={`p-6 border-b border-slate-800 ${
          isBride ? 'bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900' : 'bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900'
        }`}>
          <div className="flex items-start justify-between gap-4">
            
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  isBride 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  <User className="w-3 h-3" />
                  {basicInfo.gender} ({basicInfo.age} Yrs)
                </span>

                {islamicBackground.qualification && islamicBackground.qualification !== "None" && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <BookOpen className="w-3 h-3" />
                    {islamicBackground.qualification}
                  </span>
                )}

                <span className="text-xs text-slate-400 font-mono">ID: #{id}</span>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                {basicInfo.fullName || "Community Member"}
              </h2>

              <p className="text-xs text-slate-400 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{locationFamily.homeDistrict ? `${locationFamily.homeDistrict}, Kerala` : 'Kerala'}</span>
                <span>•</span>
                <span>{locationFamily.nativePlace || 'Native Place'}</span>
              </p>
            </div>

            {/* Action Icon Group */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleBookmark(id)}
                className={`p-2 rounded-xl border transition-colors ${
                  isBookmarked
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Save Profile"
              >
                <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-rose-400' : ''}`} />
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
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
                <span className="font-semibold text-white">{basicInfo.maritalStatus || 'Unmarried'}</span>
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
            </div>
          </div>

          {/* Section 2: Islamic / Community Background */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 pb-1 border-b border-slate-800">
              <BookOpen className="w-4 h-4" /> Islamic & Community Background
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Islamic Degree / Qualification</span>
                <span className="font-semibold text-amber-300">{islamicBackground.qualification || 'None'}</span>
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

          {/* Section 3: General Education & Profession */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 pb-1 border-b border-slate-800">
              <GraduationCap className="w-4 h-4" /> Education & Profession
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px] mb-1">Highest Qualification</span>
                <span className="font-bold text-white text-sm">{educationOccupation.education || 'Not specified'}</span>
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[11px] mb-1">Profession & Location</span>
                <span className="font-bold text-emerald-300 text-sm">{educationOccupation.profession || 'Not specified'}</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Location: {educationOccupation.workLocation || 'Kerala'} ({educationOccupation.workCountry || 'India'})
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Location & Family Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 pb-1 border-b border-slate-800">
              <Home className="w-4 h-4" /> Location & Family Details
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
                <span className="text-slate-400 block text-[11px]">Family Type & Status</span>
                <span className="font-semibold text-white">{locationFamily.familyType || 'Nuclear'} • {locationFamily.financialStatus || 'Middle Class'}</span>
              </div>
            </div>
            {locationFamily.familyDetails && (
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-xs">
                <span className="text-slate-400 block text-[11px] mb-1">Family Description & Siblings</span>
                <p className="text-slate-200 leading-relaxed">{locationFamily.familyDetails}</p>
              </div>
            )}
          </div>

          {/* Section 5: Contact & Partner Expectations */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 pb-1 border-b border-slate-800">
              <FileText className="w-4 h-4" /> Partner Preferences & Contact Person
            </h3>
            
            {contactPreferences.expectations && (
              <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/25 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Special Demands & Partner Expectations</span>
                </div>
                <p className="text-slate-200 italic leading-relaxed whitespace-pre-line">
                  "{contactPreferences.expectations}"
                </p>
              </div>
            )}

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/60">
                <div>
                  <span className="text-slate-400 block text-[11px]">Contact Guardian</span>
                  <span className="font-bold text-white text-sm">
                    {contactPreferences.contactPerson || 'Guardian'} ({contactPreferences.relationship || 'Guardian'})
                  </span>
                </div>
                <div className="sm:text-right">
                  <span className="text-slate-400 block text-[11px] mb-0.5">Contact Preference</span>
                  {contactPreferences.contactMethod === "whatsapp_only" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                      <MessageSquare className="w-3 h-3" /> WhatsApp Only (No Calls)
                    </span>
                  ) : contactPreferences.contactMethod === "call_only" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg">
                      <Phone className="w-3 h-3" /> Phone Calls Only
                    </span>
                  ) : contactPreferences.contactMethod === "any" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-lg">
                      Any Contact Method
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-lg">
                      Calls & WhatsApp Allowed
                    </span>
                  )}
                </div>
              </div>

              {/* Display phone, whatsapp and alternate numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {contactPreferences.whatsapp && (
                  <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp:
                    </span>
                    <span className="font-mono font-bold text-emerald-300 text-xs">
                      {contactPreferences.whatsapp}
                    </span>
                  </div>
                )}

                {contactPreferences.phone && (
                  <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-blue-400" /> Phone Call:
                    </span>
                    <span className="font-mono font-bold text-white text-xs">
                      {contactPreferences.phone}
                    </span>
                  </div>
                )}

                {contactPreferences.alternateContact && (
                  <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800 col-span-1 sm:col-span-2">
                    <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-purple-400" /> Alternate Contact / Email:
                    </span>
                    <span className="font-mono font-bold text-purple-300 text-xs">
                      {contactPreferences.alternateContact}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          
          {/* Direct WhatsApp Action Button */}
          {(contactPreferences.whatsapp || contactPreferences.phone) && (
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          )}

          {/* Direct Call Phone Action Button */}
          {(contactPreferences.phone || contactPreferences.whatsapp) && (
            <a
              href={`tel:${(contactPreferences.phone || contactPreferences.whatsapp || "").replace(/[^0-9+]/g, "")}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call Guardian</span>
            </a>
          )}

          {/* Alternate Contact Call/Email Button */}
          {contactPreferences.alternateContact && (
            <a
              href={contactPreferences.alternateContact.includes("@") 
                ? `mailto:${contactPreferences.alternateContact.trim()}`
                : `tel:${contactPreferences.alternateContact.replace(/[^0-9+]/g, "")}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 font-semibold text-xs sm:text-sm border border-purple-700/50 transition-colors"
            >
              <Phone className="w-4 h-4 text-purple-400" />
              <span>{contactPreferences.alternateContact.includes("@") ? "Email Contact" : "Call Alternate"}</span>
            </a>
          )}

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>

        </div>

      </div>
    </div>
  );
}
