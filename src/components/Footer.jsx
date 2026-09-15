import React from 'react';
import { Heart, Database, ShieldCheck, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-950 border-t border-slate-800/80 pt-10 pb-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800/60">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-emerald-400/30" />
              </div>
              <span className="text-base font-bold text-white">Al-ThayyiBoon Matrimony</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Open-source, community-focused matrimony directory platform inspired by NikahInKerala. Dedicated to transparent, media-free proposal listings.
            </p>
          </div>

          {/* Database Architecture Feature */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Zero Storage Cost Architecture</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Powered by Firebase Firestore NoSQL text-only collection structure. Eliminates media storage expense while guaranteeing ultra-fast search speed.
            </p>
          </div>

          {/* Open Source Notice */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Privacy & Ethics</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Contact numbers are stored for direct family-to-family communication. No commercial matchmaking fees or hidden subscriptions.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Code className="w-4 h-4 text-emerald-400" />
            <span>Built with React, Tailwind CSS & Firebase • Open Source</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-emerald-400 font-semibold font-serif">الطيبون للطيبات</span>
            <span>•</span>
            <span>© {new Date().getFullYear()} Al-ThayyiBoon</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
