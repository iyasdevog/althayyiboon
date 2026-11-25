import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  ShieldCheck,
  CheckCircle2,
  Phone,
  User,
  MessageSquare,
  Lock,
  Loader2,
  Hash
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { submitConnectionRequest } from '../firebase/profileService';

export default function ConnectionRequestModal({
  isOpen,
  onClose,
  profile,
  onShowToast
}) {
  const { currentUser } = useAuth();
  const [requesterName, setRequesterName] = useState('');
  const [requesterContact, setRequesterContact] = useState('');
  const [requesterProfileId, setRequesterProfileId] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRequesterName(currentUser?.name || '');
      setRequesterProfileId(currentUser?.profileId || '');
      setRequesterContact('');
      setMessage('');
      setSubmitted(false);
      setErrorMsg('');
    }
  }, [isOpen, currentUser?.name, currentUser?.profileId]);

  if (!isOpen || !profile) return null;

  const isBride = profile.basicInfo?.gender === 'Bride' || profile.gender === 'female';
  const targetLabel = `${isBride ? 'Bride' : 'Groom'} • ${profile.basicInfo?.age || ''} Yrs • ${profile.locationFamily?.homeDistrict || 'Kerala'}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = requesterName.trim();
    const cleanPhone = requesterContact.trim();
    if (!cleanName) {
      setErrorMsg('Please enter your name or guardian name.');
      return;
    }
    if (cleanPhone.replace(/[^0-9]/g, '').length < 8) {
      setErrorMsg('Please enter a valid WhatsApp / phone number so Admin can contact you.');
      return;
    }

    setSubmitting(true);
    try {
      await submitConnectionRequest({
        targetProfileId: profile.id,
        targetCandidateName: profile.basicInfo?.fullName || `${isBride ? 'Bride' : 'Groom'} Proposal`,
        targetGender: isBride ? 'Bride' : 'Groom',
        targetDistrict: profile.locationFamily?.homeDistrict || '',
        requesterUid: currentUser?.uid || null,
        requesterProfileId: requesterProfileId.trim() || null,
        requesterName: cleanName,
        requesterContact: cleanPhone,
        requesterEmail: currentUser?.email || null,
        requesterRole: currentUser?.role || 'member',
        message: message.trim()
      });

      setSubmitted(true);
      onShowToast?.('Connection request sent to Admin!');
    } catch (err) {
      setErrorMsg(err.message || 'Could not send request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="connection-request-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 animate-fade-in">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="connection-request-title" className="text-base font-bold text-white">
                Request Connection via Admin
              </h2>
              <p className="text-[11px] text-slate-400">
                Proposal ID: <span className="font-mono text-emerald-400 font-semibold">{profile.id}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {submitted ? (
            <div className="text-center space-y-4 py-3 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-white">
                  Connection Request Sent
                </h3>
                <p className="text-xs sm:text-sm text-emerald-300 font-semibold leading-relaxed bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5">
                  Admin will shortly contact you after verifying the proposal validity of the requested client.
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  For privacy and Shariah-aligned modesty, direct contact numbers are kept confidential and coordinated manually by our Admin team.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                Done &amp; Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Target Summary & Privacy Notice */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Contact Details Protected</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                    Admin Verified
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{targetLabel}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Submit your details below. Admin will verify the proposal validity of the requested client and contact you shortly.
                </p>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Your Name / Guardian Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder="e.g. Abdul Kareem (Father) or Candidate Name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Your WhatsApp / Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  <input
                    type="tel"
                    required
                    value={requesterContact}
                    onChange={(e) => setRequesterContact(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Your Proposal ID (Optional)
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={requesterProfileId}
                    onChange={(e) => setRequesterProfileId(e.target.value)}
                    placeholder="If registered, enter your Profile ID"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Message / Note for Admin (Optional)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any preferred time to call or brief family note..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Connection Request to Admin</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

