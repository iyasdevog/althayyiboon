import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  BookOpen, 
  MapPin, 
  Globe, 
  GraduationCap, 
  User, 
  Heart,
  Shield,
  Briefcase,
  Plus,
  X,
  Clock
} from 'lucide-react';
import { 
  KERALA_DISTRICTS, 
  ISLAMIC_QUALIFICATIONS, 
  SECTS, 
  MARITAL_STATUSES, 
  WORK_LOCATIONS,
  COMMON_PROFESSIONS 
} from '../data/mockProfiles';

export default function FilterSidebar({ 
  filters, 
  setFilters, 
  onResetFilters, 
  isMobileOpen, 
  onCloseMobile,
  approvedCustomFilters = [],
  onRequestCustomFilter
}) {

  const handleGenderChange = (gender) => {
    setFilters(prev => ({ ...prev, gender }));
  };

  const handleQualificationToggle = (qual) => {
    setFilters(prev => {
      const current = prev.qualifications || [];
      const updated = current.includes(qual)
        ? current.filter(item => item !== qual)
        : [...current, qual];
      return { ...prev, qualifications: updated };
    });
  };

  const handleProfessionToggle = (prof) => {
    setFilters(prev => {
      const current = prev.professions || [];
      const updated = current.includes(prof)
        ? current.filter(item => item !== prof)
        : [...current, prof];
      return { ...prev, professions: updated };
    });
  };

  // Combine standard qualifications with approved custom qualifications
  const approvedQualFilters = approvedCustomFilters.filter(f => f.category === "Islamic Qualification").map(f => f.name);
  const allQualifications = Array.from(new Set([...ISLAMIC_QUALIFICATIONS, ...approvedQualFilters]));

  // Combine standard professions with approved custom professions
  const approvedProfFilters = approvedCustomFilters.filter(f => f.category === "General Education" || f.category === "Profession").map(f => f.name);
  const allProfessions = Array.from(new Set([...COMMON_PROFESSIONS, ...approvedProfFilters]));


  const filterContent = (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Filter Directory</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Gender Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-emerald-400" /> Looking For (Gender)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {["All", "Bride", "Groom"].map(g => (
            <button
              key={g}
              onClick={() => handleGenderChange(g)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                filters.gender === g
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Age Range */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-emerald-400" /> Age Range (Years)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="18"
            max="70"
            value={filters.minAge}
            onChange={(e) => setFilters(prev => ({ ...prev, minAge: Number(e.target.value) || 18 }))}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
            placeholder="Min Age"
          />
          <span className="text-slate-500 text-xs">to</span>
          <input
            type="number"
            min="18"
            max="70"
            value={filters.maxAge}
            onChange={(e) => setFilters(prev => ({ ...prev, maxAge: Number(e.target.value) || 70 }))}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
            placeholder="Max Age"
          />
        </div>
      </div>

      {/* 3. Islamic Qualifications (Multi-Select Checkboxes) + Dynamic Approved Filters */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 min-w-0">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Islamic Degree / Title</span>
          </label>
          
          {/* Plus Button to Request Custom Filter */}
          <button
            onClick={onRequestCustomFilter}
            className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 hover:border-emerald-400 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Request new filter option"
          >
            <Plus className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
            <span>Add Filter</span>
          </button>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar rounded-xl bg-slate-900/60 p-2.5 border border-slate-800/80">
          {allQualifications.map((qual) => {
            const isChecked = filters.qualifications?.includes(qual);
            const isCustom = approvedQualFilters.includes(qual);

            return (
              <label
                key={qual}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                  isChecked ? 'bg-emerald-500/15 text-emerald-300 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleQualificationToggle(qual)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900"
                  />
                  <span>{qual}</span>
                </div>
                {isCustom && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Custom
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Profession / Occupation */}
      <div className="space-y-2">

        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 min-w-0">
            <Briefcase className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Profession / Occupation</span>
          </label>
          
          <button
            onClick={onRequestCustomFilter}
            className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 hover:border-emerald-400 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Request new profession filter option"
          >
            <Plus className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
            <span>Add Filter</span>
          </button>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar rounded-xl bg-slate-900/60 p-2.5 border border-slate-800/80">
          {allProfessions.map((prof) => {
            const isChecked = filters.professions?.includes(prof) || filters.profession === prof;
            const isCustom = approvedProfFilters.includes(prof);

            return (
              <label
                key={prof}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                  isChecked ? 'bg-emerald-500/15 text-emerald-300 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleProfessionToggle(prof)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900"
                  />
                  <span>{prof}</span>
                </div>
                {isCustom && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Custom
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>


      {/* 5. Home District (Kerala) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Home District
        </label>
        <select
          value={filters.district}
          onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
        >
          <option value="">All Districts (Kerala)</option>
          {KERALA_DISTRICTS.map(dist => (
            <option key={dist} value={dist}>{dist}</option>
          ))}
        </select>
      </div>

      {/* 6. Work Location / Country */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-emerald-400" /> Work Country / Region
        </label>
        <select
          value={filters.workLocation}
          onChange={(e) => setFilters(prev => ({ ...prev, workLocation: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
        >
          <option value="">All Locations (India & Abroad)</option>
          {WORK_LOCATIONS.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* 7. Marital Status */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-emerald-400" /> Marital Status
        </label>
        <select
          value={filters.maritalStatus}
          onChange={(e) => setFilters(prev => ({ ...prev, maritalStatus: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
        >
          <option value="">All Statuses</option>
          {MARITAL_STATUSES.map(ms => (
            <option key={ms} value={ms}>{ms}</option>
          ))}
        </select>
      </div>

      {/* 8. Sect / Maslak */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" /> Sect / Maslak
        </label>
        <select
          value={filters.sect}
          onChange={(e) => setFilters(prev => ({ ...prev, sect: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
        >
          <option value="">All Sects</option>
          {SECTS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* 9. Posted Within */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-400" /> Posted Within
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: "All", value: "" },
            { label: "Today", value: "1" },
            { label: "7 Days", value: "7" },
            { label: "30 Days", value: "30" },
            { label: "3 Months", value: "90" },
            { label: "6 Months", value: "180" },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilters(prev => ({ ...prev, postedWithin: opt.value }))}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all border ${
                filters.postedWithin === opt.value
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="glass-card rounded-2xl p-5 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
          {filterContent}
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          ></div>

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs bg-slate-900 h-full p-6 overflow-y-auto shadow-2xl border-l border-slate-800 z-10">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <span className="font-bold text-white text-base">Filter Profiles</span>
              <button 
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}
