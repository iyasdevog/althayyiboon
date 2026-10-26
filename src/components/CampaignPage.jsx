import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Gift, 
  CheckCircle2, 
  UserPlus, 
  Lock, 
  Users, 
  Eye, 
  MessageSquare,
  Shield,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CampaignPage({ 
  onOpenAddModal, 
  onOpenSignIn, 
  onSwitchPersona, 
  onOpenAdminPortal 
}) {
  const { pricing } = useAuth();

  // Parse countdown target date
  const targetDateStr = pricing.campaignEndDate || '2026-11-20T23:59:00';
  const rewardCredits = pricing.campaignRewardCredits || 3;
  const whatsappGroupLink = pricing.whatsappGroupLink;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    function calculateCountdown() {
      const difference = new Date(targetDateStr).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    }

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  const formattedTargetDate = (() => {
    try {
      return new Date(targetDateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return targetDateStr;
    }
  })();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-600/15 via-teal-500/10 to-amber-500/10 blur-[140px] rounded-full pointer-events-none"></div>

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img 
              src="/favicon.svg" 
              alt="Al-ThayyiBoon Matrimony" 
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl shadow-lg shadow-emerald-950/40"
            />
            <div>
              <span className="text-base sm:text-2xl font-black bg-gradient-to-r from-emerald-400 via-emerald-200 to-amber-300 bg-clip-text text-transparent tracking-tight">
                Al-ThayyiBoon
              </span>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium hidden xs:block">
                Islamic &amp; Academic Matrimonial Network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onOpenSignIn && onOpenSignIn('groom')}
              className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/30 transition-transform active:scale-95 cursor-pointer"
            >
              Free Registration (₹0)
            </button>
          </div>
        </div>
      </header>

      {/* Main Campaign Hero Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full flex flex-col items-center text-center">
        
        {/* Sacred Bismillah Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-emerald-300 mb-6 shadow-inner">
          <span className="font-serif text-amber-300 text-sm">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
          <span className="text-slate-600">•</span>
          <span>Pre-Launch Registration Campaign</span>
        </div>

        {/* Campaign Announcement Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight sm:leading-tight mb-4">
          Candidate Onboarding Drive is{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            Now Active
          </span>
        </h1>

        {/* Subtitle Explaining Hidden Profiles */}
        <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          To preserve sacred dignity and candidate privacy, matrimonial proposals are currently safeguarded while we gather verified candidates across Kerala and the Gulf.
          The complete directory will officially open for searching on <strong className="text-emerald-300 font-bold">{formattedTargetDate}</strong>.
        </p>

        {/* Live Countdown Timer Cards */}
        <div className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
            <Clock className="w-4 h-4 animate-spin-slow" />
            <span>Directory Launch Countdown</span>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-2xl sm:text-4xl font-black text-white font-mono block">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Days
              </span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-2xl sm:text-4xl font-black text-white font-mono block">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Hours
              </span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-2xl sm:text-4xl font-black text-white font-mono block">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Mins
              </span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono block">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Secs
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Target Launch Date: <strong className="text-slate-200">{formattedTargetDate}</strong></span>
          </p>
        </div>

        {/* Free Registration & Bonus Incentive Card */}
        <div className="w-full max-w-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-amber-950/30 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 mb-10 shadow-xl text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0">
              <Gift className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Special Campaign Benefit
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2 mb-2">
                100% Free Registration + {rewardCredits} Complimentary Contact Views
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                During this active campaign drive, profile registration is completely <strong>FREE (₹0)</strong>. You will not be prompted for any payment. 
                Candidates registered during the campaign will automatically receive <strong className="text-amber-300">{rewardCredits} complimentary contact unlocks</strong> when the directory opens on {formattedTargetDate}!
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero Registration Fee (₹0)</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{rewardCredits} Free Contact Views at Launch</span>
                </div>
                <div className="flex items-center gap-1.5 text-teal-300">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Wali &amp; Modesty Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mb-12">
          <button
            onClick={onOpenAddModal}
            className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Free Proposal (₹0)</span>
          </button>
          
          {onSwitchPersona && (
            <button
              onClick={() => onSwitchPersona('groom')}
              className="w-full sm:w-auto py-4 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs sm:text-sm border border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Explore Demo Directory</span>
            </button>
          )}
        </div>

        {/* WhatsApp Group Community Feature */}
        {whatsappGroupLink && (
          <div className="w-full max-w-2xl bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-14 flex items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Join Al-ThayyiBoon WhatsApp Group</h4>
                <p className="text-xs text-slate-400">Receive newly verified proposals directly on WhatsApp as they are added.</p>
              </div>
            </div>
            <a
              href={whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors"
            >
              <span>Join Group</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* 3 Pillar Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left mb-12">
          <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">No Public Lurkers</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Profiles are hidden from web crawlers. Only verified grooms can view brides, and verified brides can view grooms.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">Islamic &amp; Professional</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Specializing in Wafi, Wafiyya, and Hudawi scholars alongside Doctors, Engineers, Post-Graduates and Academics.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">Sacred Guardian Protection</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Candidate and guardian phone numbers are protected from spam. Direct communication through registered Walis only.
            </p>
          </div>
        </div>

        {/* Admin Link at Bottom */}
        <div className="pt-6 border-t border-slate-800/80 w-full flex items-center justify-center gap-4 text-xs text-slate-500">
          <span>Platform Administrator?</span>
          <button
            onClick={onOpenAdminPortal}
            className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Open Admin Portal</span>
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Al-ThayyiBoon Matrimonial Network. Sunnah-Aligned &amp; Dignified Matrimony.</p>
      </footer>

    </div>
  );
}
