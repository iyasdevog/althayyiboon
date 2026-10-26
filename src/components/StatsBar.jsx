import React from 'react';
import { Users, BookOpen, Globe, Heart, ShieldCheck, Award } from 'lucide-react';

export default function StatsBar({ profiles = [] }) {
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
    { icon: Globe, color: "sky", value: gulfJobs, label: "Gulf / Abroad", shortLabel: "Abroad" },
  ];

  const colorMap = {
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-500/25",
    rose: "bg-rose-500/15 text-rose-300 border-rose-500/30 group-hover:bg-rose-500/25",
    teal: "bg-teal-500/15 text-teal-300 border-teal-500/30 group-hover:bg-teal-500/25",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30 group-hover:bg-amber-500/25",
    sky: "bg-sky-500/15 text-sky-300 border-sky-500/30 group-hover:bg-sky-500/25",
  };

  return (
    <section aria-label="Key Community Statistics" className="bg-slate-950/90 border-b border-slate-800/80 py-3 sm:py-5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-4">
          {stats.map(({ icon: Icon, color, value, label, shortLabel }) => (
            <div
              key={label}
              className="group glass-card rounded-xl sm:rounded-2xl px-2 sm:px-4 py-2.5 sm:py-4 text-center border border-slate-800/90 flex flex-col items-center hover:border-slate-700 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${colorMap[color]} border mx-auto flex items-center justify-center mb-1.5 shadow-sm transition-colors`} aria-hidden="true">
                <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <div className="text-sm xs:text-base sm:text-2xl font-black text-white leading-none font-mono">
                {value}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1 truncate max-w-full">
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
