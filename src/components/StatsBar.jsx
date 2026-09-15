import React from 'react';
import { Users, BookOpen, Globe, Heart, ShieldCheck } from 'lucide-react';

export default function StatsBar({ profiles }) {
  const total = profiles.length;
  const brides = profiles.filter(p => p.basicInfo?.gender === "Bride").length;
  const grooms = profiles.filter(p => p.basicInfo?.gender === "Groom").length;
  const islamicGrads = profiles.filter(p => p.islamicBackground?.qualification && p.islamicBackground?.qualification !== "None").length;
  const gulfJobs = profiles.filter(p => p.educationOccupation?.workCountry && p.educationOccupation?.workCountry !== "India").length;

  return (
    <div className="bg-slate-950/80 border-y border-slate-800/80 py-6 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          <div className="glass-card rounded-2xl p-4 text-center border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center mb-2">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">{total}</div>
            <div className="text-xs text-slate-400 font-medium">Total Listings</div>
          </div>

          <div className="glass-card rounded-2xl p-4 text-center border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-300 mx-auto flex items-center justify-center mb-2">
              <Heart className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">{brides}</div>
            <div className="text-xs text-slate-400 font-medium">Bride Proposals</div>
          </div>

          <div className="glass-card rounded-2xl p-4 text-center border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-300 mx-auto flex items-center justify-center mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">{grooms}</div>
            <div className="text-xs text-slate-400 font-medium">Groom Proposals</div>
          </div>

          <div className="glass-card rounded-2xl p-4 text-center border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-300 mx-auto flex items-center justify-center mb-2">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">{islamicGrads}</div>
            <div className="text-xs text-slate-400 font-medium">Islamic Scholars</div>
          </div>

          <div className="glass-card rounded-2xl p-4 text-center col-span-2 md:col-span-1 border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-300 mx-auto flex items-center justify-center mb-2">
              <Globe className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">{gulfJobs}</div>
            <div className="text-xs text-slate-400 font-medium">Gulf & Abroad</div>
          </div>

        </div>
      </div>
    </div>
  );
}
