import React from 'react';
import { ShieldCheck, BookOpen, Heart, Lock } from 'lucide-react';

export default function Footer({ onOpenAdminPortal }) {
  return (
    <footer className="mt-auto bg-slate-950 border-t border-slate-800/80 pt-10 sm:pt-14 pb-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/60">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-3.5 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img 
                src="/favicon.svg" 
                alt="Al-ThayyiBoon Logo" 
                className="w-9 h-9 rounded-xl shrink-0 shadow-lg shadow-emerald-950/50"
              />
              <div>
                <span className="text-base sm:text-lg font-bold text-white tracking-tight">Al-ThayyiBoon Matrimony</span>
                <p className="text-[10px] text-emerald-400 font-medium">Kerala &amp; Gulf Islamic Matrimonial Network</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A dedicated matrimonial directory for the Kerala Muslim community and Gulf diaspora, facilitating righteous alliances between Islamic scholars (Wafi, Wafiyya, Hudawi) and Academic graduates (Ph.D., Master's, Doctors, Engineers).
            </p>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 max-w-md">
              <p className="text-emerald-400 font-serif text-xs leading-relaxed text-right" dir="rtl">
                الْخَبِيثَاتُ لِلْخَبِيثِينَ وَالْخَبِيثُونَ لِلْخَبِيثَاتِ ۖ وَالطَّيِّبَاتُ لِلطَّيِّبِينَ وَالطَّيِّبُونَ لِلطَّيِّبَاتِ
              </p>
              <p className="text-[10px] text-slate-400 mt-1 italic">
                "Women of purity are for men of purity, and men of purity are for women of purity." (Surah An-Nur 24:26)
              </p>
            </div>
          </div>

          {/* Column 2: Directory Sectors */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Directory Sectors
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Wafi &amp; Wafiyya Scholars</span>
              </li>
              <li className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                <span>Doctors &amp; Healthcare</span>
              </li>
              <li className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                <span>B.Tech &amp; IT Professionals</span>
              </li>
              <li className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Post-Graduates &amp; Ph.D.</span>
              </li>
              <li className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>Gulf Diaspora (UAE, Saudi, Qatar)</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Modesty & Privacy Safeguards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Privacy &amp; Trust
            </h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              Direct communication is channeled strictly through registered Walis and parents. No public photo indexing, zero web scrapers, and pay-per-view contact protection.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-teal-300 font-semibold pt-1">
              <Lock className="w-3 h-3 text-teal-400" />
              <span>100% Shariah &amp; Gender Segregated Views</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
            <span>Dedicated to righteous Muslim marriages across Kerala &amp; Global Diaspora</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-slate-400 flex-wrap justify-center">
            <span>Community Matrimony</span>
            <span>•</span>
            {onOpenAdminPortal && (
              <>
                <button
                  onClick={onOpenAdminPortal}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors font-medium cursor-pointer"
                  aria-label="Open Admin Portal"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Portal</span>
                </button>
                <span>•</span>
              </>
            )}
            <span>© {new Date().getFullYear()} Al-ThayyiBoon. All rights reserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
