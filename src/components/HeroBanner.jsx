import React, { useRef, useEffect } from 'react';
import { Search, Sparkles, BookOpen, GraduationCap, MapPin, Briefcase, X, User, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HeroBanner({ 
  searchQuery, 
  setSearchQuery, 
  selectedGender, 
  setSelectedGender, 
  activeQuickTag, 
  setActiveQuickTag 
}) {
  const { userGender, isAdmin } = useAuth();
  const searchInputRef = useRef(null);

  // Quick keyboard shortcut "/" to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const quickTags = [
    { label: "All Proposals", icon: Sparkles, gender: "All", tag: "" },
    { label: "Brides", icon: Heart, gender: "Bride", tag: "" },
    { label: "Grooms", icon: User, gender: "Groom", tag: "" },
    { label: "Islamic Scholars", icon: BookOpen, gender: "All", tag: "wafi" },
    { label: "Doctors & Healthcare", icon: Briefcase, gender: "All", tag: "doctor" },
    { label: "Engineers & IT", icon: GraduationCap, gender: "All", tag: "b.tech" },
    { label: "Ph.D. & PG Scholars", icon: GraduationCap, gender: "All", tag: "ph.d" },
    { label: "Gulf & Abroad", icon: MapPin, gender: "All", tag: "uae" },
    { label: "Sayyid / Thangal", icon: Sparkles, gender: "All", tag: "sayyid" }
  ];

  return (
    <header className="relative overflow-hidden bg-slate-950/70 border-b border-slate-800/80 py-6 sm:py-12">
      {/* Ambient Gradient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Arabic Bismillah / Tagline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/70 text-xs font-semibold text-emerald-300 mb-3.5 shadow-sm">
          <span className="font-serif text-amber-300 text-sm">بِسْمِ ٱللَّٰهِ</span>
          <span className="text-slate-600">•</span>
          <span>Kerala &amp; Gulf Islamic Matrimony Directory</span>
        </div>

        {/* Semantic H1 for SEO */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2.5 sm:mb-3.5 max-w-4xl mx-auto leading-tight">
          Islamic &amp; Academic Matrimony in{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            Kerala &amp; Diaspora
          </span>
        </h1>
        
        {/* Subtitle with semantic keywords */}
        <p className="text-xs sm:text-base text-slate-400 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
          Explore proposals for Wafi, Wafiyya, Hudawi scholars, Doctors, Engineers, and Post-Graduates. Filter by specialized subject, district, and work location with protected direct contact access.
        </p>

        {/* Enhanced Search Input */}
        <div className="max-w-2xl mx-auto mb-4 sm:mb-6">
          <div className="relative flex items-center group">
            <Search className="absolute left-4 w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 pointer-events-none group-focus-within:text-emerald-300 transition-colors" />
            <input
              ref={searchInputRef}
              type="text"
              id="directory-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, district, Islamic degree, or academic qualification... (Press '/' to focus)"
              className="w-full pl-11 sm:pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl bg-slate-900/95 text-white placeholder-slate-500 border border-slate-700/80 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm shadow-xl transition-all"
              aria-label="Search matrimony directory"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Clear search text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Pill Buttons */}
        <nav aria-label="Quick filters" className="flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:max-w-4xl sm:mx-auto no-scrollbar">
          {quickTags.map((item, idx) => {
            const IconComponent = item.icon;
            
            // Check if persona locks out this gender
            const isLocked = !isAdmin && userGender && (
              (userGender === 'male' && item.gender === 'Groom') ||
              (userGender === 'female' && item.gender === 'Bride')
            );

            const isActive = selectedGender === item.gender && activeQuickTag === item.tag;

            if (isLocked) return null;

            return (
              <button
                key={idx}
                onClick={() => {
                  if (item.gender !== "All") setSelectedGender(item.gender);
                  setActiveQuickTag(item.tag);
                  if (item.tag) {
                    setSearchQuery(item.tag);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 border ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 font-bold scale-105'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                {IconComponent && <IconComponent className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
