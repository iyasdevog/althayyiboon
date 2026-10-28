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
  ExternalLink,
  Languages
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CampaignPage({ 
  onOpenAddModal, 
  onOpenSignIn, 
  onSwitchPersona, 
  onOpenAdminPortal 
}) {
  const { pricing } = useAuth();
  const [lang, setLang] = useState('ml'); // 'ml' = Malayalam, 'en' = English

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

  // Inject Noto Sans Malayalam Google Font
  useEffect(() => {
    if (!document.getElementById('noto-sans-malayalam-font')) {
      const link = document.createElement('link');
      link.id = 'noto-sans-malayalam-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@400;500;600;700;800;900&display=swap';
      document.head.appendChild(link);
    }
  }, []);

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

  const formattedTargetDateMl = (() => {
    try {
      return new Date(targetDateStr).toLocaleDateString('ml-IN', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return formattedTargetDate;
    }
  })();

  const mlFont = { fontFamily: "'Noto Sans Malayalam', sans-serif" };

  // Bilingual content
  const i18n = {
    ml: {
      preLaunch: 'പ്രീ-ലോഞ്ച് രജിസ്ട്രേഷൻ ക്യാമ്പെയ്ൻ',
      heroTitle1: 'ഉദ്യോഗാർത്ഥി ഓൺബോർഡിംഗ് ഡ്രൈവ്',
      heroTitle2: 'സജീവമാണ്',
      subtitle: `ഉദ്യോഗാർത്ഥികളുടെ പവിത്രമായ അന്തസ്സും സ്വകാര്യതയും സംരക്ഷിക്കുന്നതിനായി, കേരളത്തിലും ഗൾഫ് രാജ്യങ്ങളിലും നിന്ന് സ്ഥിരീകരിച്ച ഉദ്യോഗാർത്ഥികളെ ശേഖരിക്കുന്ന സമയത്ത് വിവാഹാലോചനകൾ നിലവിൽ സുരക്ഷിതമായി സൂക്ഷിച്ചിരിക്കുകയാണ്.`,
      subtitleDate: `മുഴുവൻ ഡയറക്ടറിയും `,
      subtitleDateBold: formattedTargetDateMl,
      subtitleDateEnd: `-ന് ഔദ്യോഗികമായി തിരയലിനായി തുറക്കും.`,
      countdownLabel: 'ഡയറക്ടറി ലോഞ്ച് കൗണ്ട്ഡൗൺ',
      days: 'ദിവസം',
      hours: 'മണിക്കൂർ',
      mins: 'മിനിറ്റ്',
      secs: 'സെക്കൻഡ്',
      targetLabel: 'ലക്ഷ്യ തീയതി: ',
      benefitBadge: 'പ്രത്യേക ക്യാമ്പെയ്ൻ ആനുകൂല്യം',
      benefitTitle: `100% സൗജന്യ രജിസ്ട്രേഷൻ + ${rewardCredits} സൗജന്യ കോൺടാക്ട് വ്യൂകൾ`,
      benefitDesc: `ഈ സജീവ ക്യാമ്പെയ്ൻ ഡ്രൈവ് സമയത്ത്, പ്രൊഫൈൽ രജിസ്ട്രേഷൻ പൂർണ്ണമായും സൗജന്യമാണ് (₹0). നിങ്ങളോട് ഒരു പേയ്‌മെന്റും ആവശ്യപ്പെടുകയില്ല. ക്യാമ്പെയ്ൻ സമയത്ത് രജിസ്റ്റർ ചെയ്ത ഉദ്യോഗാർത്ഥികൾക്ക്, `,
      benefitDescBold: `${rewardCredits} സൗജന്യ കോൺടാക്ട് അൺലോക്കുകൾ`,
      benefitDescEnd: ` ${formattedTargetDateMl}-ന് ഡയറക്ടറി തുറക്കുമ്പോൾ സ്വയമേവ ലഭിക്കും!`,
      checkFree: 'രജിസ്ട്രേഷൻ ഫീസ് പൂജ്യം (₹0)',
      checkViews: `ലോഞ്ചിൽ ${rewardCredits} സൗജന്യ കോൺടാക്ട് വ്യൂകൾ`,
      checkWali: 'വലിയ്യ് & മഹ്‌റം സംരക്ഷിതം',
      ctaRegister: 'സൗജന്യ പ്രൊപോസൽ രജിസ്റ്റർ ചെയ്യുക (₹0)',
      ctaExplore: 'ഡെമോ ഡയറക്ടറി പര്യവേക്ഷണം',
      whatsappTitle: 'Al-ThayyiBoon WhatsApp ഗ്രൂപ്പിൽ ചേരുക',
      whatsappDesc: 'പുതിയ സ്ഥിരീകരിച്ച പ്രൊപോസലുകൾ WhatsApp-ൽ നേരിട്ട് സ്വീകരിക്കൂ.',
      joinGroup: 'ഗ്രൂപ്പിൽ ചേരുക',
      pillar1Title: 'പൊതു ചാരന്മാരില്ല',
      pillar1Desc: 'പ്രൊഫൈലുകൾ വെബ് ക്രോളറുകളിൽ നിന്ന് മറച്ചിരിക്കുന്നു. സ്ഥിരീകരിച്ച വരന്മാർക്ക് മാത്രമേ വധുക്കളെ കാണാൻ കഴിയൂ, സ്ഥിരീകരിച്ച വധുക്കൾക്ക് മാത്രമേ വരന്മാരെ കാണാൻ കഴിയൂ.',
      pillar2Title: 'ഇസ്‌ലാമിക & പ്രൊഫഷണൽ',
      pillar2Desc: 'വാഫി, വാഫിയ്യ, ഹുദവി പണ്ഡിതർക്കൊപ്പം ഡോക്ടർമാർ, എഞ്ചിനീയർമാർ, പോസ്റ്റ്-ഗ്രാജുവേറ്റുകൾ, അക്കാദമിക് വിദഗ്ധർ എന്നിവരിൽ വിശേഷജ്ഞത.',
      pillar3Title: 'പവിത്ര രക്ഷാകർതൃ സംരക്ഷണം',
      pillar3Desc: 'ഉദ്യോഗാർത്ഥിയുടെയും രക്ഷാകർത്താവിന്റെയും ഫോൺ നമ്പറുകൾ സ്പാമിൽ നിന്ന് സംരക്ഷിക്കപ്പെടുന്നു. രജിസ്റ്റർ ചെയ്ത വലിയ്യുമാർ വഴി മാത്രം നേരിട്ടുള്ള ആശയവിനിമയം.',
      adminLabel: 'പ്ലാറ്റ്‌ഫോം അഡ്മിനിസ്ട്രേറ്റർ?',
      adminLink: 'അഡ്മിൻ പോർട്ടൽ തുറക്കുക',
      toggleLabel: 'English',
      signIn: 'സൈൻ ഇൻ',
      freeReg: 'സൗജന്യ രജിസ്ട്രേഷൻ (₹0)',
    },
    en: {
      preLaunch: 'Pre-Launch Registration Campaign',
      heroTitle1: 'Candidate Onboarding Drive is',
      heroTitle2: 'Now Active',
      subtitle: `To preserve sacred dignity and candidate privacy, matrimonial proposals are currently safeguarded while we gather verified candidates across Kerala and the Gulf.`,
      subtitleDate: 'The complete directory will officially open for searching on ',
      subtitleDateBold: formattedTargetDate,
      subtitleDateEnd: '.',
      countdownLabel: 'Directory Launch Countdown',
      days: 'Days',
      hours: 'Hours',
      mins: 'Mins',
      secs: 'Secs',
      targetLabel: 'Target Launch Date: ',
      benefitBadge: 'Special Campaign Benefit',
      benefitTitle: `100% Free Registration + ${rewardCredits} Complimentary Contact Views`,
      benefitDesc: `During this active campaign drive, profile registration is completely FREE (₹0). You will not be prompted for any payment. Candidates registered during the campaign will automatically receive `,
      benefitDescBold: `${rewardCredits} complimentary contact unlocks`,
      benefitDescEnd: ` when the directory opens on ${formattedTargetDate}!`,
      checkFree: 'Zero Registration Fee (₹0)',
      checkViews: `${rewardCredits} Free Contact Views at Launch`,
      checkWali: 'Wali & Modesty Protected',
      ctaRegister: 'Register Free Proposal (₹0)',
      ctaExplore: 'Explore Demo Directory',
      whatsappTitle: 'Join Al-ThayyiBoon WhatsApp Group',
      whatsappDesc: 'Receive newly verified proposals directly on WhatsApp as they are added.',
      joinGroup: 'Join Group',
      pillar1Title: 'No Public Lurkers',
      pillar1Desc: 'Profiles are hidden from web crawlers. Only verified grooms can view brides, and verified brides can view grooms.',
      pillar2Title: 'Islamic & Professional',
      pillar2Desc: 'Specializing in Wafi, Wafiyya, and Hudawi scholars alongside Doctors, Engineers, Post-Graduates and Academics.',
      pillar3Title: 'Sacred Guardian Protection',
      pillar3Desc: 'Candidate and guardian phone numbers are protected from spam. Direct communication through registered Walis only.',
      adminLabel: 'Platform Administrator?',
      adminLink: 'Open Admin Portal',
      toggleLabel: 'മലയാളം',
      signIn: 'Sign In',
      freeReg: 'Free Registration (₹0)',
    }
  };

  const t = i18n[lang];
  const isMl = lang === 'ml';
  const textStyle = isMl ? mlFont : {};

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
            {/* Language Toggle Button */}
            <button
              onClick={() => setLang(prev => prev === 'ml' ? 'en' : 'ml')}
              className="px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all cursor-pointer flex items-center gap-1.5 group"
              title={isMl ? 'Switch to English' : 'മലയാളത്തിലേക്ക് മാറുക'}
            >
              <Languages className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span style={isMl ? {} : mlFont}>{t.toggleLabel}</span>
            </button>
            <button
              onClick={() => onOpenSignIn && onOpenSignIn('groom')}
              className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors cursor-pointer"
            >
              <span style={textStyle}>{t.signIn}</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/30 transition-transform active:scale-95 cursor-pointer"
            >
              <span style={textStyle}>{t.freeReg}</span>
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
          <span style={textStyle}>{t.preLaunch}</span>
        </div>

        {/* Campaign Announcement Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight sm:leading-tight mb-4" style={textStyle}>
          {t.heroTitle1}{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            {t.heroTitle2}
          </span>
        </h1>

        {/* Subtitle Explaining Hidden Profiles */}
        <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed" style={textStyle}>
          {t.subtitle}{' '}
          {t.subtitleDate}<strong className="text-emerald-300 font-bold">{t.subtitleDateBold}</strong>{t.subtitleDateEnd}
        </p>

        {/* Live Countdown Timer Cards */}
        <div className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
            <Clock className="w-4 h-4 animate-spin-slow" />
            <span style={textStyle}>{t.countdownLabel}</span>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-2xl sm:text-4xl font-black text-white font-mono block">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider" style={textStyle}>
                {t.days}
              </span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-2xl sm:text-4xl font-black text-white font-mono block">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider" style={textStyle}>
                {t.hours}
              </span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-2xl sm:text-4xl font-black text-white font-mono block">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider" style={textStyle}>
                {t.mins}
              </span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-center">
              <span className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono block">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider" style={textStyle}>
                {t.secs}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-1.5" style={textStyle}>
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.targetLabel}<strong className="text-slate-200">{isMl ? formattedTargetDateMl : formattedTargetDate}</strong></span>
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
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30" style={textStyle}>
                {t.benefitBadge}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2 mb-2" style={textStyle}>
                {t.benefitTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4" style={textStyle}>
                {t.benefitDesc}
                <strong className="text-amber-300">{t.benefitDescBold}</strong>
                {t.benefitDescEnd}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span style={textStyle}>{t.checkFree}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span style={textStyle}>{t.checkViews}</span>
                </div>
                <div className="flex items-center gap-1.5 text-teal-300">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span style={textStyle}>{t.checkWali}</span>
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
            <span style={textStyle}>{t.ctaRegister}</span>
          </button>
          
          {onSwitchPersona && (
            <button
              onClick={() => onSwitchPersona('groom')}
              className="w-full sm:w-auto py-4 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs sm:text-sm border border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span style={textStyle}>{t.ctaExplore}</span>
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
                <h4 className="text-sm font-bold text-white" style={textStyle}>{t.whatsappTitle}</h4>
                <p className="text-xs text-slate-400" style={textStyle}>{t.whatsappDesc}</p>
              </div>
            </div>
            <a
              href={whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors"
            >
              <span style={textStyle}>{t.joinGroup}</span>
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
            <h4 className="text-base font-bold text-white mb-1.5" style={textStyle}>{t.pillar1Title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed" style={textStyle}>
              {t.pillar1Desc}
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-1.5" style={textStyle}>{t.pillar2Title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed" style={textStyle}>
              {t.pillar2Desc}
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-1.5" style={textStyle}>{t.pillar3Title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed" style={textStyle}>
              {t.pillar3Desc}
            </p>
          </div>
        </div>

        {/* Admin Link at Bottom */}
        <div className="pt-6 border-t border-slate-800/80 w-full flex items-center justify-center gap-4 text-xs text-slate-500">
          <span style={textStyle}>{t.adminLabel}</span>
          <button
            onClick={onOpenAdminPortal}
            className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span style={textStyle}>{t.adminLink}</span>
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
