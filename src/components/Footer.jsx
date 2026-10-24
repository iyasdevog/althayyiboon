import React from 'react';
import { ShieldCheck, Code, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-950 border-t border-slate-800/80 pt-10 sm:pt-12 pb-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/60">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img 
                src="/favicon.svg" 
                alt="Al-ThayyiBoon Logo" 
                className="w-8 h-8 rounded-xl shrink-0 shadow-md shadow-emerald-950/50"
              />
              <span className="text-base font-bold text-white tracking-tight">Al-ThayyiBoon Matrimony</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A dedicated matrimonial directory for the Kerala Muslim community and Gulf diaspora, facilitating righteous alliances between Islamic scholars (Wafi, Wafiyya, Hudawi) and Academic graduates (Ph.D., Master's, Doctors, Engineers).
            </p>
            <div className="flex items-center gap-2 pt-1 text-emerald-400 font-semibold font-serif text-sm">
              <span>الْخَبِيثَاتُ لِلْخَبِيثِينَ وَالْخَبِيثُونَ لِلْخَبِيثَاتِ ۖ وَالطَّيِّبَاتُ لِلطَّيِّبِينَ وَالطَّيِّبُونَ لِلطَّيِّبَاتِ</span>
            </div>
          </div>

          {/* Column 2: Quick Directory Sections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Directory Sectors
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li className="hover:text-emerald-300 transition-colors">
                <span>Islamic Scholars (Wafi &amp; Hudawi)</span>
              </li>
              <li className="hover:text-emerald-300 transition-colors">
                <span>Doctors &amp; Healthcare Professionals</span>
              </li>
              <li className="hover:text-emerald-300 transition-colors">
                <span>Engineering &amp; Technology</span>
              </li>
              <li className="hover:text-emerald-300 transition-colors">
                <span>Post-Graduates &amp; Ph.D. Researchers</span>
              </li>
              <li className="hover:text-emerald-300 transition-colors">
                <span>Gulf Diaspora (UAE, Saudi, Qatar)</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Privacy & Ethics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Privacy &amp; Trust
            </h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              Guardian contact numbers are protected with pay-per-view access to prevent spam, unverified forwarding, and privacy violations.
            </p>
            <p className="text-slate-500 text-[11px]">
              Direct family-to-family communication without brokers or commercial commission.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Code className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Built with React, Tailwind CSS, Vite &amp; Firebase</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Community Directory</span>
            <span>•</span>
            <span>© {new Date().getFullYear()} Al-ThayyiBoon. All rights reserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
