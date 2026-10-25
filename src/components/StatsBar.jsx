import React from 'react';
import { Users, BookOpen, Globe, Heart, ShieldCheck } from 'lucide-react';

export default function StatsBar({ profiles }) {
  const total = profiles.length;
  const brides = profiles.filter(p => p.basicInfo?.gender === "Bride" || p.gender === "female").length;
  const grooms = profiles.filter(p => p.basicInfo?.gender === "Groom" || p.gender === "male").length;
  const islamicGrads = profiles.filter(p => 
    (Array.isArray(p.islamicQualification) && p.islamicQualification.some(q => q && q !== 'None')) ||
    (p.islamicBackground?.qualification && p.islamicBackground?.qualification !== "None")
  ).length;
  const gulfJobs = profiles.filter(p => p.educationOccupation?.workCountry && p.educationOccupation?.workCountry !== "India").length;

  const stats = [
    { icon: Users, color: "emerald", value: total, label: "Total Proposals", shortLabel: "Total" },
    { icon: Heart, color: "rose", value: brides, label: "Brides", shortLabel: "Brides" },
    { icon: ShieldCheck, color: "teal", value: grooms, label: "Grooms", shortLabel: "Grooms" },
    { icon: BookOpen, color: "amber", value: islamicGrads, label: "Islamic Scholars", shortLabel: "Scholars" },
    { icon: Globe, color: "indigo", value: gulfJobs, label: "Gulf / Abroad", shortLabel: "Abroad" },
  ];

  const colorMap = {
    emerald: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    rose: "bg-rose-500/10 text-rose-300 border border-rose-500/20",
    teal: "bg-teal-500/10 text-teal-300 border border-teal-500/20",
    amber: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
    indigo: "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20",
  };

  return (
    <section aria-label="Key Community Statistics" className="bg-slate-950/80 border-b border-slate-800/60 py-2.5 sm:py-6">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Responsive 5-column grid: Compact on mobile, spacious on tablet/desktop */}
        <div className="grid grid-cols-5 gap-1 sm:gap-4">
          {stats.map(({ icon: Icon, color, value, label, shortLabel }) => (
            <div
              key={label}
              className="glass-card rounded-lg sm:rounded-xl px-1 sm:px-4 py-2 sm:py-4 text-center border border-slate-800 flex flex-col items-center hover:border-slate-700 transition-colors"
            >
              <div className={`w-6 h-6 sm:w-9 sm:h-9 rounded-md sm:rounded-xl ${colorMap[color]} mx-auto flex items-center justify-center mb-1 shadow-sm`} aria-hidden="true">
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <div className="text-xs xs:text-sm sm:text-2xl font-black text-white leading-none font-mono">{value}</div>
              <div className="text-[9px] xs:text-[10px] sm:text-xs text-slate-400 font-medium mt-1 truncate max-w-full">
                <span className="sm:hidden">{shortLabel || label}</span>
                <span className="hidden sm:inline">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
