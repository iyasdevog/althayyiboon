import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  CreditCard, 
  Gift, 
  CheckCircle2, 
  Calendar, 
  X, 
  AlertCircle,
  HelpCircle,
  Users
} from 'lucide-react';
import { LISTING_DURATION_MONTHS, MONTHLY_CAMPAIGN_PERKS } from '../utils/profileValidity';
import { useAuth } from '../context/AuthContext';

export default function ValidityPolicyModal({ isOpen, onClose, onOpenAddModal }) {
  const { pricing } = useAuth();

  if (!isOpen) return null;

  const renewalFee = pricing?.renewalFee || 199;
  const standardFee = pricing?.profileSubmissionFee || 499;
  const isCampaign = Boolean(pricing?.campaignMode);
  const rewardCredits = pricing?.campaignRewardCredits || 3;
  const campaignSchedule = pricing?.monthlyCampaignSchedule || '1st & 2nd of Every Month';

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="validity-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
    >
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity" 
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/60 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 id="validity-modal-title" className="text-sm sm:text-base font-extrabold text-white">
                3-Month Validity &amp; Monthly Free Campaign
              </h2>
              <p className="text-[11px] text-slate-400">
                100% Active Profiles Policy • Al-ThayyiBoon Matrimony
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close validity policy dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-5 text-xs text-slate-300">
          
          {/* Pillar 1: 3-Month Freshness Policy */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>3-Month Active Listing Guarantee</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              Unlike generic matrimonial platforms cluttered with outdated or married candidates from years ago, 
              <strong> every registration on Al-ThayyiBoon is valid for exactly 3 months (90 days)</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>No Stale Profiles:</strong> Only actively seeking candidates stay in the directory.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Respect for Families:</strong> Reduces awkward calls to candidates who have already wed.</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: WhatsApp Renewal Notification */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/30 via-slate-950 to-emerald-950/30 border border-teal-500/30 space-y-2.5">
            <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
              <MessageSquare className="w-4 h-4 text-teal-400" />
              <span>Automated WhatsApp Renewal Notification</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              As your 3-month listing period approaches its due date, you will receive a direct WhatsApp notification asking if your search is still ongoing:
            </p>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <p className="text-emerald-400 font-bold">📲 WhatsApp Notification at 3 Months:</p>
              <p className="text-slate-400 italic">
                "Assalamu Alaikum {`{Guardian}`}, Your proposal [ID: {`{ID}`}] has completed its 3-month cycle. If still searching, reply to renew your listing for another 3 months (Renewal: ₹{renewalFee}). If alliance is fixed, let us know so we can archive your profile. Jazakallahu Khair."
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-400">Regular Listing: ₹{standardFee}</span>
              <span className="text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Discounted Renewal Fee: ₹{renewalFee} (Save 60%)
              </span>
            </div>
          </div>

          {/* Pillar 3: Monthly 1-2 Day Data Collection Campaign */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-950 to-amber-950/20 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Monthly 1-2 Day Free Data Collection Drive</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {isCampaign ? 'Active Now' : campaignSchedule}
              </span>
            </div>
            <p className="leading-relaxed text-slate-300">
              Every month, Al-ThayyiBoon runs a dedicated <strong>1 to 2 day data collection campaign</strong> to onboard fresh, verified Islamic scholars and academic candidates across Kerala and the Gulf with zero barrier to entry:
            </p>
            <div className="space-y-2">
              {MONTHLY_CAMPAIGN_PERKS.map((perk, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-[11px]">{perk.title}</p>
                    <p className="text-[10px] text-slate-400">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
          
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenAddModal) onOpenAddModal();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 flex items-center gap-2 cursor-pointer"
          >
            <span>{isCampaign ? 'Register Proposal (Free ₹0)' : 'Register Proposal'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
