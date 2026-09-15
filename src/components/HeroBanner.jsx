import React from 'react';
import { Search, Sparkles, BookOpen, GraduationCap, MapPin, Briefcase, X } from 'lucide-react';

export default function HeroBanner({ searchQuery, setSearchQuery, selectedGender, setSelectedGender, activeQuickTag, setActiveQuickTag }) {
  const quickTags = [
    { label: "All Profiles", icon: Sparkles, gender: "All", tag: "" },
    { label: "Brides", icon: null, gender: "Bride", tag: "" },
    { label: "Grooms", icon: null, gender: "Groom", tag: "" },
    { label: "Islamic Grad", icon: BookOpen, gender: "All", tag: "wafi" },
    { label: "Sayyid / Thangal", icon: GraduationCap, gender: "All", tag: "sayyid" },
    { label: "Gulf Professionals", icon: Briefcase, gender: "All", tag: "uae" },
    { label: "Doctors & Engineers", icon: MapPin, gender: "All", tag: "b.tech" },
  ];

  return (
    <div className="relative overflow-hidden bg-slate-950/60 border-b border-slate-800/60 py-5 sm:py-10">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-amber-500/8 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Arabic Bismillah / Tagline Banner */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/60 text-[11px] sm:text-xs font-semibold text-emerald-300 mb-3 shadow-sm">
          <span className="font-serif text-amber-300 text-sm">بِسْمِ ٱللَّٰهِ</span>
          <span className="text-slate-500">•</span>
          <span>Community Matrimonial Directory</span>
        </div>

        <h2 className="text-xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2 sm:mb-3 max-w-3xl mx-auto leading-tight">
          Find Proposals in{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            Kerala &amp; Diaspora
          </span>
        </h2>
        
        {/* Subtitle: hidden on mobile to save vertical space */}
        <p className="hidden sm:block text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-6 leading-relaxed">
          Open &amp; transparent community directory. Filter by District, Islamic Graduation, Profession, Sect, and Work location with direct contact access.
        </p>
        <p className="sm:hidden text-xs text-slate-500 mb-4 leading-relaxed">
          Open community directory • Filter by District, Qualification &amp; Profession
        </p>

        {/* Search Bar Container */}
        <div className="max-w-2xl mx-auto mb-4 sm:mb-6">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, city, qualification..."
              className="w-full pl-10 sm:pl-12 pr-10 py-3 sm:py-4 rounded-2xl bg-slate-900/90 text-white placeholder-slate-500 border border-slate-700/80 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm shadow-xl transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filters — horizontal scroll on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:max-w-4xl sm:mx-auto no-scrollbar">
          {quickTags.map((item, idx) => {
            const IconComponent = item.icon;
            const isActive = selectedGender === item.gender && activeQuickTag === item.tag;

            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedGender(item.gender);
                  setActiveQuickTag(item.tag);
                  if (item.tag) {
                    setSearchQuery(item.tag);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {IconComponent && <IconComponent className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
