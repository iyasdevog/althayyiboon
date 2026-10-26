import React from 'react';
import { AlertTriangle, LogIn, ArrowRight, XCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DemoNoticeBanner({ onOpenSignIn }) {
  const { currentUser, switchUserPersona } = useAuth();

  if (!currentUser?.isDemo) return null;

  return (
    <aside 
      aria-label="Demo mode warning"
      className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-amber-200 border-b border-amber-500/40 px-3 sm:px-6 py-2.5 shadow-xl relative z-50 text-xs sm:text-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Indicator & Warning Notice */}
        <div className="flex items-center gap-2.5 text-center md:text-left">
          <span className="p-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 animate-pulse">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <p className="leading-snug">
            <span className="font-extrabold text-amber-300 uppercase tracking-wider text-[11px] bg-amber-500/20 px-2 py-0.5 rounded-full mr-1.5 border border-amber-500/30">
              Demo Mode Active
            </span>
            <span className="text-slate-200 font-medium">
              You are viewing <strong className="text-amber-300 underline decoration-amber-500/50">Fake / Sample Data</strong>. To browse real verified matrimonial proposals, sign in as Groom or Bride.
            </span>
          </p>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenSignIn ? onOpenSignIn('groom') : null}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In for Real Data</span>
          </button>
          
          <button
            onClick={() => switchUserPersona(null)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
            title="Exit Demo Mode"
          >
            <XCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Exit Demo</span>
          </button>
        </div>

      </div>
    </aside>
  );
}
