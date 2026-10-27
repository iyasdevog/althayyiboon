import React from 'react';
import { User, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function GenderVerificationModal({ isOpen, onClose, onVerified }) {
  const { currentUser, setUserGender, isGenderVerified } = useAuth();

  if (!isOpen || isGenderVerified || !currentUser || currentUser.isDemo || currentUser.role === 'admin') {
    return null;
  }

  const handleSelect = (gender, role) => {
    setUserGender(gender, role);
    if (onVerified) onVerified(gender, role);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Islamic Modesty Verification</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Confirm Your Matrimonial Identity
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Welcome, <strong className="text-white">{currentUser.name || 'Member'}</strong>! To uphold Shariah modesty and ensure candidate viewing locks are applied (Brothers view Brides; Sisters view Grooms), please confirm your candidate profile:
          </p>
        </div>

        {/* Two Options: Brother / Sister */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          <button
            type="button"
            onClick={() => handleSelect('male', 'groom')}
            className="p-4 rounded-2xl bg-slate-950 hover:bg-emerald-950/30 border border-emerald-500/30 hover:border-emerald-500 flex flex-col items-center text-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
              <User className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-sm font-bold text-white group-hover:text-emerald-300">
                Brother (Groom)
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Registering for a Brother / Seeking a Bride
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelect('female', 'bride')}
            className="p-4 rounded-2xl bg-slate-950 hover:bg-rose-950/30 border border-rose-500/30 hover:border-rose-500 flex flex-col items-center text-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-slate-950 transition-colors">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-sm font-bold text-white group-hover:text-rose-300">
                Sister (Bride)
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Registering for a Sister / Seeking a Groom
              </span>
            </div>
          </button>
        </div>

        {/* Protection Note */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Parents and guardians can register proposals on behalf of either a Groom or Bride.</span>
        </div>

      </div>
    </div>
  );
}
