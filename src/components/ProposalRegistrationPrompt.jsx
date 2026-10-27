import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Gift, 
  CreditCard,
  UserCheck,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfiles } from '../context/ProfilesContext';

export default function ProposalRegistrationPrompt({ onOpenAddModal }) {
  const { currentUser, isDemo, isAdmin, pricing } = useAuth();
  const { rawProfiles } = useProfiles();
  const [dismissed, setDismissed] = useState(false);

  // Only show for real logged-in users who do not have an active proposal submitted yet
  if (!currentUser || isDemo || isAdmin || dismissed) {
    return null;
  }

  const hasRegisteredProposal = rawProfiles.some(
    p => (p.creatorUid && p.creatorUid === currentUser.uid) ||
         (p.creatorEmail && p.creatorEmail === currentUser.email)
  ) || currentUser.isLegacyUser;

  if (hasRegisteredProposal) {
    return null;
  }

  const isCampaign = Boolean(pricing?.campaignMode);
  const fee = pricing?.profileSubmissionFee || 499;
  const roleName = currentUser.gender === 'female' ? 'Bride (Sister)' : 'Groom (Brother)';

  return (
    <div className="w-full bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-y border-emerald-500/40 shadow-lg px-4 sm:px-6 py-3.5 sm:py-4 transition-all animate-fade-in relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3.5 sm:gap-4">
        
        {/* Left Side: Icon + Message */}
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            {isCampaign ? (
              <Gift className="w-5 h-5 text-emerald-400" />
            ) : (
              <UserCheck className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-white">
                Complete Your Proposal Registration
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Mode: {roleName}
              </span>
              {isCampaign ? (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Free ₹0 Campaign
                </span>
              ) : (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  Listing Fee: ₹{fee}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {isCampaign ? (
                <>You are signed in via Google as <strong>{currentUser.name}</strong>, but your proposal is not yet listed. Complete registration now to get <strong>100% Free Listing (₹0)</strong> + 3 free contact unlocks!</>
              ) : (
                <>You are signed in via Google as <strong>{currentUser.name}</strong>, but your proposal is not yet listed in the directory. Complete the registration form and payment to be verified and published.</>
              )}
            </p>
          </div>
        </div>

        {/* Right Side: CTA Button */}
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/40 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <span>{isCampaign ? 'Complete Free Registration (₹0)' : `Complete Registration & Listing (₹${fee})`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
