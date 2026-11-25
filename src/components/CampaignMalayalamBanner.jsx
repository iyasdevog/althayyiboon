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
  const { pricing, currentUser, ownRegisteredProfile } = useAuth();

  // If campaign mode is turned off, do not display
  if (!pricing?.campaignMode) return null;

  const isAlreadyRegistered = Boolean(ownRegisteredProfile || currentUser?.hasRegisteredProfile);

  const whatsappGroupLink = pricing?.whatsappGroupLink || 'https://chat.whatsapp.com/sample-althayyiboon-group';
  const isManualMode = pricing?.manualPaymentMode !== false;
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
    <div className="w-full bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border-b border-emerald-500/30 px-3 py-2.5 sm:px-6 sm:py-4 shadow-lg relative overflow-hidden animate-fade-in">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-4">
        {/* Left Side: Compact Malayalam Announcement */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 text-left flex-1 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          </div>

          <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-[11px] font-bold font-malayalam">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>ഡാറ്റാ ശേഖരണം പുരോഗമിക്കുന്നു</span>
              </span>

              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-semibold font-malayalam">
                <Gift className="w-3 h-3 text-amber-400" />
                <span>
                  {isManualMode
                    ? 'സൗജന്യ രജിസ്ട്രേഷൻ • അഡ്മിൻ വേരിഫിക്കേഷൻ'
                    : `${rewardCredits} സൗജന്യ കോൺടാക്റ്റ് അൺലോക്കുകൾ`}
                </span>
              </span>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700 text-[10px] font-malayalam">
                <Calendar className="w-2.5 h-2.5 text-slate-400" />
                <span>{formattedTargetDate}</span>
              </span>
            </div>

            <h2 className="text-xs sm:text-base font-bold text-white font-malayalam leading-snug">
              പ്രൊപ്പോസൽ ഡാറ്റാ ശേഖരണം നടക്കുന്നു — പ്രൊഫൈലുകൾ നിലവിൽ രഹസ്യമാണ്
            </h2>
          </div>
        </div>

        {/* Right Side: Compact Action Buttons */}
        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 justify-end">
          <a
            href={whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] sm:text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-white shrink-0" />
            <span>വാട്സാപ്പ് ഗ്രൂപ്പ്</span>
            <ExternalLink className="w-3 h-3 opacity-80 shrink-0" />
          </a>

          {!isAlreadyRegistered && (
            <button
              onClick={handleRegisterClick}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 font-bold text-[11px] sm:text-xs border border-emerald-500/40 transition-all cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>സൗജന്യ രജിസ്ട്രേഷൻ</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
