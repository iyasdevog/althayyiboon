import React from 'react';
import { Search, Sparkles, BookOpen, GraduationCap, MapPin, Briefcase, X } from 'lucide-react';

export default function HeroBanner({ searchQuery, setSearchQuery, selectedGender, setSelectedGender, activeQuickTag, setActiveQuickTag }) {
  const quickTags = [
    { label: "All Profiles", icon: Sparkles, gender: "All", tag: "" },
    { label: "Brides", icon: null, gender: "Bride", tag: "" },
    { label: "Grooms", icon: null, gender: "Groom", tag: "" },
    { label: "Islamic Graduation", icon: BookOpen, gender: "All", tag: "wafi" },
    { label: "Sayyid / Thangal", icon: GraduationCap, gender: "All", tag: "sayyid" },
    { label: "Gulf Professionals", icon: Briefcase, gender: "All", tag: "uae" },
    { label: "Doctors & Engineers", icon: MapPin, gender: "All", tag: "b.tech" },
  ];

  return (
    <div className="relative overflow-hidden bg-slate-950/60 border-b border-slate-800/60 py-8 sm:py-12">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Arabic Bismillah / Tagline Banner */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs font-semibold text-emerald-300 mb-4 shadow-sm">
          <span className="font-serif text-amber-300 text-sm">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
          <span className="text-slate-500">•</span>
          <span>Community Matrimonial Directory</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 max-w-3xl mx-auto leading-tight">
          Find Suitable Proposals in <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">Kerala & Diaspora</span>
        </h2>
        
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Open & transparent community directory. Filter by District, Islamic Graduation, Profession, Sect, and Work location with direct contact access.
        </p>

        {/* Search Bar Container */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-emerald-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, City, Qualification (Wafi, Hudawi, etc.), Profession..."
              className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-2xl bg-slate-900/90 text-white placeholder-slate-500 border border-slate-700/80 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm sm:text-base shadow-xl transition-all"
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

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
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
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
