import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Heart, 
  ShieldCheck, 
  Lock, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight,
  Users,
  EyeOff,
  PhoneCall,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

export default function LandingPage({ onSignIn, onSwitchPersona, onOpenAdminPortal }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const [previewSearch, setPreviewSearch] = useState('');

  const previewTags = [
    { label: 'Wafiyya Scholars', category: 'Islamic Education' },
    { label: 'Doctors & MBBS', category: 'Medical' },
    { label: 'Software Engineers', category: 'Technology' },
    { label: 'Wafi Scholars', category: 'Islamic Education' },
    { label: 'Gulf NRI Professionals', category: 'Location' },
    { label: 'Post-Graduates / M.Sc', category: 'Academics' }
  ];

  const faqs = [
    {
      q: "How does Al-ThayyiBoon protect candidate privacy and modesty?",
      a: "Candidate contact numbers and personal identifers are strictly guarded. Unauthenticated web crawlers and public lurkers cannot view profiles. Grooms can only view Brides, and Brides can only view Grooms. Direct contact occurs exclusively through registered parents or walis."
    },
    {
      q: "What is the contact unlock policy and why is there a nominal fee?",
      a: "Contact numbers are unlocked via nominal pay-per-view credits (₹15 / 1 credit). This nominal safeguard eliminates time-wasters, spammers, and non-serious inquiries, ensuring that only genuine families reach out."
    },
    {
      q: "Can candidates with combined Islamic (Wafi/Wafiyya) and University degrees register?",
      a: "Yes! Al-ThayyiBoon specializes in dual-curriculum candidates (e.g. Wafi + Degree, Wafiyya + PG, Hudawi + PhD, or conventional Doctors and Engineers with strong Islamic values)."
    },
    {
      q: "How can parents or guardians manage proposals on behalf of their children?",
      a: "Parents can sign in directly using 'Parent Mode' where candidate details are organized with maximum modesty and guardian coordination tools."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-600/15 via-teal-500/10 to-amber-500/10 blur-[140px] rounded-full pointer-events-none"></div>

      {/* Top Banner Navigation */}
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
            <Link
              to="/profiles"
              className="hidden sm:inline-flex px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 transition-colors"
            >
              Browse Proposals
            </Link>
            <button
              onClick={() => onSignIn && onSignIn('groom')}
              className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/30 transition-transform active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 w-full flex flex-col items-center text-center">
        
        {/* Bismillah Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-emerald-300 mb-5 shadow-inner">
          <span className="font-serif text-amber-300 text-sm">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
          <span className="text-slate-600">•</span>
          <span className="hidden sm:inline">Sunnah-Aligned &amp; Gender-Protected Matrimony</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight sm:leading-tight mb-4">
          Pure, Dignified &amp; Shariah-Aligned Matrimony for{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            Kerala &amp; the Gulf
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          Connecting Islamic Scholars (Wafi, Wafiyya, Hudawi) and Academic Professionals (Doctors, Engineers, Post-Graduates) with protected guardian contacts.
        </p>

        {/* Interactive Directory Preview Search Teaser */}
        <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 mb-12 shadow-2xl text-left">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Directory Preview</span>
          </div>
          <div className="relative flex items-center mb-3">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={previewSearch}
              onChange={(e) => setPreviewSearch(e.target.value)}
              placeholder="Try searching 'Wafiyya', 'Doctor', 'B.Tech', 'Malappuram'..."
              className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
            />
            <button
              onClick={() => onSwitchPersona && onSwitchPersona('groom')}
              className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Explore
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400">Popular filters:</span>
            {previewTags.map((tag, i) => (
              <button
                key={i}
                onClick={() => {
                  setPreviewSearch(tag.label);
                  if (onSwitchPersona) {
                    onSwitchPersona('groom');
                  }
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2 Role Sign-In Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-14 text-left">
          
          {/* Card 1: Groom */}
          <div className="relative group bg-slate-900/90 hover:bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-xl shadow-emerald-950/20 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mb-4">
                <User className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">For Brothers / Grooms</span>
              <h2 className="text-xl font-bold text-white mt-1 mb-2">I am a Groom</h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-5 leading-relaxed">
                Discover verified Bride proposals with full Islamic backgrounds (Wafiyya, etc.), academic degrees, and direct guardian contacts. Direct registration for Parents or Candidates.
              </p>
              <div className="space-y-2 text-xs text-slate-300 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>View locked to verified Brides only</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Direct WhatsApp contact with Wali / Guardian</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Register proposal as Parent, Guardian or Self</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => onSignIn('groom')}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
              >
                <span>Sign In as Groom (Google)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {onSwitchPersona && (
                <button
                  onClick={() => onSwitchPersona('groom')}
                  className="w-full py-2 px-3 text-center text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
                >
                  ⚡ Instant Demo: Groom Mode
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Bride */}
          <div className="relative group bg-slate-900/90 hover:bg-slate-900 border border-rose-500/30 hover:border-rose-500/60 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-xl shadow-rose-950/20 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300 mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">For Sisters / Brides</span>
              <h2 className="text-xl font-bold text-white mt-1 mb-2">I am a Bride</h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-5 leading-relaxed">
                Explore verified Groom proposals with complete career, profession, Islamic scholarship, and family details. Direct registration for Parents or Candidates.
              </p>
              <div className="space-y-2 text-xs text-slate-300 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>View locked to verified Grooms only</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Direct family and guardian coordination</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Register proposal as Parent, Guardian or Self</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => onSignIn('bride')}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
              >
                <span>Sign In as Bride (Google)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {onSwitchPersona && (
                <button
                  onClick={() => onSwitchPersona('bride')}
                  className="w-full py-2 px-3 text-center text-[11px] text-rose-400 hover:text-rose-300 font-semibold transition-colors cursor-pointer"
                >
                  ⚡ Instant Demo: Bride Mode
                </button>
              )}
            </div>
          </div>

        </div>

        {/* How It Works 3-Step Section */}
        <div className="w-full max-w-5xl mb-16 text-left">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Simple &amp; Sacred Journey</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">How Al-ThayyiBoon Works</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center justify-center mb-4">
                01
              </div>
              <h4 className="font-bold text-white text-base mb-2">Sign In with Modesty Lock</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Select your role (Groom, Bride, or Parent). The system automatically protects views so sisters view brothers and brothers view sisters.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 font-mono font-bold flex items-center justify-center mb-4">
                02
              </div>
              <h4 className="font-bold text-white text-base mb-2">Filter by Scholarship &amp; Degree</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Filter candidates by Islamic degree (Wafi, Wafiyya, Hudawi), university qualifications (B.Tech, MBBS, PhD), district, and Gulf residency.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center mb-4">
                03
              </div>
              <h4 className="font-bold text-white text-base mb-2">Connect Directly with Guardian</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Unlock verified parent phone number and start a direct, respectful WhatsApp consultation with the candidate's Wali.
              </p>
            </div>
          </div>
        </div>

        {/* Shariah & Privacy Safeguards Section */}
        <div className="w-full max-w-5xl rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-10 text-left mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Our Sacred Commitment</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Why Al-ThayyiBoon is Different</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs sm:text-sm">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base">Zero Public Exposure</h4>
              <p className="text-slate-400 leading-relaxed text-xs">
                No unauthenticated guest can browse proposals. Your personal data is never visible to web scrapers or anonymous lurkers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base">Gender View Segregation</h4>
              <p className="text-slate-400 leading-relaxed text-xs">
                Grooms are locked to viewing Brides only; Brides are locked to viewing Grooms. In strict compliance with Sunnah modesty.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <PhoneCall className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base">Direct Guardian Contact</h4>
              <p className="text-slate-400 leading-relaxed text-xs">
                No informal dating chat. Communication is channeled strictly through registered parent and guardian contacts.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base">Islamic &amp; Academic Focus</h4>
              <p className="text-slate-400 leading-relaxed text-xs">
                Specialized categorization for Wafi, Wafiyya, Hudawi, Doctors, Engineers, Post-Graduates, and Gulf diaspora candidates.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="w-full max-w-4xl text-left mb-12">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Frequently Asked Questions</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Got Questions? We Have Answers</h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="font-semibold text-sm sm:text-base text-white pr-4">{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Al-ThayyiBoon Matrimony. Built for the Muslim Community of Kerala &amp; Diaspora.</p>
          {onOpenAdminPortal && (
            <button
              onClick={onOpenAdminPortal}
              className="text-slate-600 hover:text-amber-400 transition-colors text-[11px] cursor-pointer"
            >
              Admin Portal
            </button>
          )}
        </div>
      </footer>

    </div>
  );
}
