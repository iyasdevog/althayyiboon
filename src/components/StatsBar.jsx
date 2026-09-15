import React from 'react';
import { Users, BookOpen, Globe, Heart, ShieldCheck } from 'lucide-react';

export default function StatsBar({ profiles }) {
  const total = profiles.length;
  const brides = profiles.filter(p => p.basicInfo?.gender === "Bride").length;
  const grooms = profiles.filter(p => p.basicInfo?.gender === "Groom").length;
  const islamicGrads = profiles.filter(p => p.islamicBackground?.qualification && p.islamicBackground?.qualification !== "None").length;
  const gulfJobs = profiles.filter(p => p.educationOccupation?.workCountry && p.educationOccupation?.workCountry !== "India").length;

  const stats = [
    { icon: Users, color: "emerald", value: total, label: "Total" },
    { icon: Heart, color: "rose", value: brides, label: "Brides" },
    { icon: ShieldCheck, color: "teal", value: grooms, label: "Grooms" },
    { icon: BookOpen, color: "amber", value: islamicGrads, label: "Scholars" },
    { icon: Globe, color: "indigo", value: gulfJobs, label: "Gulf/Abroad" },
  ];

  const colorMap = {
    emerald: "bg-emerald-500/10 text-emerald-400",
    rose: "bg-rose-500/10 text-rose-300",
    teal: "bg-teal-500/10 text-teal-300",
    amber: "bg-amber-500/10 text-amber-300",
    indigo: "bg-indigo-500/10 text-indigo-300",
  };

  return (
    <div className="bg-slate-950/80 border-b border-slate-800/60 py-3 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: horizontal scroll strip */}
        <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar sm:grid sm:grid-cols-5 sm:gap-4">
          {stats.map(({ icon: Icon, color, value, label }) => (
            <div
              key={label}
              className="glass-card rounded-xl px-4 py-2.5 sm:py-4 text-center border border-slate-800 flex-shrink-0 sm:flex-shrink min-w-[72px] sm:min-w-0 flex flex-col items-center"
            >
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl ${colorMap[color]} mx-auto flex items-center justify-center mb-1.5`}>
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <div className="text-base sm:text-2xl font-extrabold text-white leading-none">{value}</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 whitespace-nowrap">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
