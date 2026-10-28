import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  LogIn, 
  Sparkles, 
  Gift, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Key, 
  AlertCircle,
  Users,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CandidateAccessGate({
  isLoggedIn = false,
  userName = 'Member',
  onOpenSignIn,
  onOpenAddModal,
  onSwitchPersona,
  onLinkExistingProfile
}) {
  const { pricing } = useAuth();
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkId, setLinkId] = useState('');
  const [linkPin, setLinkPin] = useState('');
  const [linkError, setLinkError] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);

  const isCampaign = Boolean(pricing?.campaignMode);
  const fee = pricing?.profileSubmissionFee || 499;

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    if (!linkId.trim() || !linkPin.trim()) {
      setLinkError('Please enter Profile ID / Phone and PIN.');
      return;
    }
    setLinkLoading(true);
    setLinkError('');
    if (onLinkExistingProfile) {
      const res = await onLinkExistingProfile(linkId, linkPin);
      setLinkLoading(false);
      if (!res.success) {
        setLinkError(res.error || 'Failed to link profile. Please check credentials.');
      }
    } else {
      setLinkLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden text-center">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* ========================================================================= */}
        {/* CASE 1: VISITOR NOT SIGNED IN */}
        {/* ========================================================================= */}
        {!isLoggedIn ? (
          <div>
            {/* Islamic Sunnah Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-300 mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Shariah-Aligned Matrimonial Protection</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
              Sign In &amp; Register to View Candidate Proposals
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              To uphold Islamic modesty and protect candidate privacy, all matrimonial proposals and guardian contact details are reserved strictly for registered candidates and verified guardians.
            </p>

            {/* Campaign Offer Highlight */}
            {isCampaign && (
              <div className="max-w-xl mx-auto mb-8 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-amber-950/70 border border-emerald-500/30 text-xs text-slate-200 flex items-center justify-center gap-3">
                <Gift className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-left">
                  <strong className="text-emerald-300">Free Registration Campaign Active:</strong> 100% Free Listing (₹0 fee) + 3 complimentary direct contact unlocks upon registration.
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-lg mx-auto mb-10">
              <button
                type="button"
                onClick={() => onOpenSignIn && onOpenSignIn('groom', 'register')}
                className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>New Candidate Registration (Free ₹0)</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenSignIn && onOpenSignIn('groom', 'signin')}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Candidate Sign In</span>
              </button>
            </div>

            {/* Three Pillar Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-6 border-t border-slate-800/80">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold mb-2.5">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white mb-1">Gender View Lock</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Brothers only view verified Brides, and Sisters only view verified Grooms. Unauthenticated public cannot crawl profiles.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center font-bold mb-2.5">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white mb-1">Direct Guardian Access</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Connect directly with parents or Walis via verified WhatsApp &amp; phone contacts with zero broker commissions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold mb-2.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white mb-1">Islamic &amp; Academic</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Specialized for Wafi, Wafiyya, Hudawi scholars, Doctors, Engineers, and post-graduate professionals in Kerala &amp; Gulf.
                </p>
              </div>
            </div>

            {/* Demo Option */}
            {onSwitchPersona && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => onSwitchPersona('groom')}
                  className="text-xs text-slate-400 hover:text-emerald-400 underline font-medium cursor-pointer"
                >
                  ⚡ Want to test first? Explore directory using sample demo data
                </button>
              </div>
            )}

          </div>
        ) : (
          /* ========================================================================= */
          /* CASE 2: USER IS SIGNED IN BUT HAS NOT REGISTERED THEIR CANDIDATE DETAILS */
          /* ========================================================================= */
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-300 mb-4">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>One Quick Step Remaining</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
              Register Your Proposal to View Other Candidates
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mb-6 leading-relaxed">
              Welcome, <strong className="text-white">{userName}</strong>! In accordance with Al-ThayyiBoon's reciprocity and modesty policy, every member must submit their own proposal details before browsing the directory.
            </p>

            {/* Campaign Banner Card */}
            <div className="max-w-xl mx-auto mb-8 p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-left">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>What You Get Upon Completing Registration:</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pl-6 list-disc">
                <li>Instant unrestricted access to view all matching proposals in Kerala &amp; Gulf</li>
                <li><strong>100% Free Listing (₹0 fee)</strong> during the current promotion</li>
                <li><strong>3 Complimentary Contact Unlocks</strong> to connect with Walis immediately</li>
                <li>Protected privacy with masked contacts and guardian verification</li>
              </ul>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-8">
              <button
                type="button"
                onClick={onOpenAddModal}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
              >
                <span>Complete Candidate Details (Free ₹0)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Link Existing Profile Section */}
            <div className="pt-6 border-t border-slate-800 max-w-lg mx-auto">
              {!showLinkInput ? (
                <button
                  type="button"
                  onClick={() => setShowLinkInput(true)}
                  className="text-xs text-slate-400 hover:text-emerald-300 underline font-medium cursor-pointer"
                >
                  Already have a profile ID created previously or by admin? Link it here
                </button>
              ) : (
                <form onSubmit={handleLinkSubmit} className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Link Pre-Registered Proposal</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowLinkInput(false)}
                      className="text-[11px] text-slate-500 hover:text-slate-300"
                    >
                      Cancel
                    </button>
                  </div>

                  {linkError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                      {linkError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={linkId}
                      onChange={(e) => setLinkId(e.target.value)}
                      placeholder="Profile ID or Phone (e.g. ALTB-101)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500"
                      required
                    />
                    <input
                      type="password"
                      value={linkPin}
                      onChange={(e) => setLinkPin(e.target.value)}
                      placeholder="4-digit PIN / Password"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={linkLoading}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {linkLoading ? 'Verifying & Linking...' : 'Link My Existing Proposal'}
                  </button>
                </form>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
