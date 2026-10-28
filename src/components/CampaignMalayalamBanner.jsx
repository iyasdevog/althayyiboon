import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  UserPlus, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  Gift,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CampaignMalayalamBanner({ onOpenAddModal }) {
  const navigate = useNavigate();
  const { pricing } = useAuth();

  // If campaign mode is turned off, do not display
  if (!pricing?.campaignMode) return null;

  const whatsappGroupLink = pricing?.whatsappGroupLink || 'https://chat.whatsapp.com/sample-althayyiboon-group';
  const rewardCredits = pricing?.campaignRewardCredits || 3;
  const targetDateStr = pricing?.campaignEndDate || '2026-11-20T23:59:00';

  const formattedTargetDate = (() => {
    try {
      return new Date(targetDateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return targetDateStr;
    }
  })();

  const handleRegisterClick = () => {
    if (onOpenAddModal) {
      onOpenAddModal();
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border-b border-emerald-500/30 px-3 py-4 sm:px-6 sm:py-5 shadow-2xl relative overflow-hidden animate-fade-in">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left Side: Malayalam Announcement */}
        <div className="flex items-start gap-3.5 text-left flex-1 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/40 mt-1">
            <Lock className="w-6 h-6 text-emerald-400" />
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Announcement Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>ഡാറ്റാ ശേഖരണം പുരോഗമിക്കുന്നു</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
                <Gift className="w-3 h-3 text-amber-400" />
                <span>{rewardCredits} സൗജന്യ കോൺടാക്റ്റ് അൺലോക്കുകൾ</span>
              </span>

              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>ഓപ്പണിംഗ്: {formattedTargetDate}</span>
              </span>
            </div>

            {/* Malayalam Main Heading */}
            <h2 className="text-base sm:text-lg font-black text-white leading-snug tracking-tight">
              പ്രൊപ്പോസൽ ഡാറ്റാ ശേഖരണം നടക്കുന്നു — നിലവിൽ എല്ലാ പ്രൊഫൈലുകളും രഹസ്യമായി സൂക്ഷിച്ചിരിക്കുന്നു
            </h2>

            {/* Malayalam Explanation */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl font-normal">
              അൽ-ത്വയ്യിബൂൻ പ്ലാറ്റ്‌ഫോം പൊതുജനങ്ങൾക്കായി ഔദ്യോഗികമായി തുറക്കുമ്പോൾ ഉടൻ അറിയാനും, <strong className="text-amber-300 font-semibold">{rewardCredits} സൗജന്യ കോൺടാക്റ്റ് അൺലോക്ക് ക്രെഡിറ്റുകൾ</strong> ആസ്വദിക്കാനും ഞങ്ങളുടെ ഔദ്യോഗിക വാട്സാപ്പ് ഗ്രൂപ്പിൽ ഇപ്പോൾ തന്നെ ചേരുക! ലോഞ്ച് തിയതി വരെ വധൂവരന്മാരുടെ സ്വകാര്യത ഉറപ്പാക്കാൻ എല്ലാ പ്രൊഫൈലുകളും താല്ക്കാലികമായി സുരക്ഷിതമാക്കി വെച്ചിരിക്കുകയാണ്.
            </p>
          </div>
        </div>

        {/* Right Side: CTA Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end pt-1 lg:pt-0">
          {/* Join WhatsApp Group Button */}
          <a
            href={whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>വാട്സാപ്പ് ഗ്രൂപ്പിൽ ചേരുക</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          {/* Register Free Proposal Button */}
          <button
            onClick={handleRegisterClick}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 font-bold text-xs sm:text-sm border border-emerald-500/40 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>സൗജന്യ രജിസ്ട്രേഷൻ (₹0)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
