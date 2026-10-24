import React, { useState, useEffect } from 'react';
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
  Clock,
  ChevronDown,
  ChevronUp,
  Lock
} from 'lucide-react';
import { 
  KERALA_DISTRICTS, 
  SUBJECT_CATEGORIES,
  SECTS, 
  MARITAL_STATUSES, 
  WORK_LOCATIONS,
  COMMON_PROFESSIONS 
} from '../data/mockProfiles';
import { useAuth } from '../context/AuthContext';

export default function FilterSidebar({ 
  filters, 
  setFilters, 
  onResetFilters, 
  isMobileOpen, 
  onCloseMobile,
  approvedCustomFilters = [],
  onRequestCustomFilter
}) {
  const { userGender, isAdmin } = useAuth();

  // Accordion open states
  const [openIslamicAccordion, setOpenIslamicAccordion] = useState(true);
  const [openAcademicAccordion, setOpenAcademicAccordion] = useState(true);

  // Close mobile filter drawer on Escape
  useEffect(() => {
    if (!isMobileOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  const handleGenderChange = (gender) => {
    // If not admin, gender view lock is enforced
    if (!isAdmin && userGender) return;
    setFilters(prev => ({ ...prev, gender }));
  };

  // Toggle Islamic Qualification multi-select
  const handleIslamicQualToggle = (qual) => {
    setFilters(prev => {
      const current = prev.islamicQualifications || [];
      const updated = current.includes(qual)
        ? current.filter(item => item !== qual)
        : [...current, qual];
      return { ...prev, islamicQualifications: updated };
    });
  };

  // Toggle Education Level multi-select
  const handleEducationLevelToggle = (level) => {
    setFilters(prev => {
      const current = prev.educationLevels || [];
      const updated = current.includes(level)
        ? current.filter(item => item !== level)
        : [...current, level];
      return { ...prev, educationLevels: updated };
    });
  };

  // Toggle Specialized Subject Category multi-select
  const handleSubjectCategoryToggle = (category) => {
    setFilters(prev => {
      const current = prev.subjectCategories || [];
      const updated = current.includes(category)
        ? current.filter(item => item !== category)
        : [...current, category];
      return { ...prev, subjectCategories: updated };
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

  // Target Islamic Qualifications specified in instructions
  const primaryIslamicQualifications = [
    "Wafi",
    "Wafiyya",
    "Hudawi",
    "Zahravi",
    "Baqavi",
    "Faizy",
    "Saqafi",
    "Custom / Other"
  ];

  // Subject Category descriptions for tooltips/helpers
  const subjectCategoryDescriptions = {
    "Arts & Humanities": "Economics, Sociology, History, Literature, etc.",
    "Science & Research": "Physics, Chemistry, Biotechnology, Math",
    "Commerce & Business": "Accounting, Finance, BBA, MBA",
    "Engineering & Tech": "Computer Science, Mechanical, Civil, IT",
    "Medical & Health": "MBBS, BDS, Nursing, Pharmacy, Allied Health",
    "Islamic Studies & Education": "Usul al-Din, Sharia, Islamic History",
    "Law & Legal": "LLB, LLM"
  };

  const filterContent = (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Filter Proposals</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Gender Selection (Respects Gender-Based View Lock) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-400" /> Looking For (Gender)
          </label>
          {!isAdmin && userGender && (
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-amber-500/20">
              <Lock className="w-2.5 h-2.5" /> Locked
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {["All", "Bride", "Groom"].map(g => {
            const isLockedOut = !isAdmin && userGender && (
              (userGender === 'male' && g !== 'Bride') ||
              (userGender === 'female' && g !== 'Groom')
            );

            return (
              <button
                key={g}
                disabled={isLockedOut}
                onClick={() => handleGenderChange(g)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  filters.gender === g
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                    : isLockedOut
                    ? 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed opacity-40'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
        {!isAdmin && userGender && (
          <p className="text-[10px] text-slate-500 italic">
            Gender lock active for {userGender === 'male' ? 'Groom' : 'Bride'} profile.
          </p>
        )}
      </div>

      {/* 2. Age Range */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Age Range</span>
          <span className="text-emerald-400 font-mono font-bold text-xs">
            {filters.minAge} - {filters.maxAge} Yrs
          </span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Min Age</label>
            <input
              type="number"
              min="18"
              max={filters.maxAge}
              value={filters.minAge}
              onChange={(e) => setFilters(prev => ({ ...prev, minAge: Number(e.target.value) || 18 }))}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 text-white border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs text-center"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">Max Age</label>
            <input
              type="number"
              min={filters.minAge}
              max="70"
              value={filters.maxAge}
              onChange={(e) => setFilters(prev => ({ ...prev, maxAge: Number(e.target.value) || 70 }))}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 text-white border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs text-center"
            />
          </div>
        </div>
      </div>

      {/* =============================================================== */}
      {/* 3. ACCORDION GROUP A: ISLAMIC QUALIFICATIONS (MULTI-SELECT)     */}
      {/* =============================================================== */}
      <div className="rounded-2xl border border-emerald-950/80 bg-slate-900/60 overflow-hidden shadow-sm">
        <button
          onClick={() => setOpenIslamicAccordion(prev => !prev)}
          className="w-full p-3.5 flex items-center justify-between bg-emerald-950/20 hover:bg-emerald-950/30 border-b border-emerald-900/30 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-xs font-bold text-white block">Islamic Qualifications</span>
              <span className="text-[10px] text-emerald-400/80">Wafi, Wafiyya, Hudawi, etc.</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {filters.islamicQualifications?.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {filters.islamicQualifications.length}
              </span>
            )}
            {openIslamicAccordion ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {openIslamicAccordion && (
          <div className="p-3.5 space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
            {primaryIslamicQualifications.map(qual => {
              const isChecked = filters.islamicQualifications?.includes(qual);
              return (
                <label 
                  key={qual}
                  className={`flex items-center gap-2.5 p-2 rounded-xl text-xs cursor-pointer transition-all border ${
                    isChecked
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold shadow-sm'
                      : 'hover:bg-slate-800/60 text-slate-300 border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleIslamicQualToggle(qual)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 focus:ring-1"
                  />
                  <span>{qual}</span>
                </label>
              );
            })}

            {/* Custom/Community approved filters */}
            {approvedCustomFilters
              .filter(f => f.category === "Islamic Qualification")
              .map(f => {
                const isChecked = filters.islamicQualifications?.includes(f.name);
                return (
                  <label 
                    key={f.name}
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-xs cursor-pointer transition-all border ${
                      isChecked
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold'
                        : 'hover:bg-slate-800/60 text-slate-300 border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleIslamicQualToggle(f.name)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500"
                    />
                    <span>{f.name} (Custom)</span>
                  </label>
                );
              })}

            <button
              onClick={onRequestCustomFilter}
              className="w-full mt-2 py-2 px-3 rounded-xl border border-dashed border-emerald-600/40 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Suggest Islamic Degree</span>
            </button>
          </div>
        )}
      </div>

      {/* =============================================================== */}
      {/* 4. ACCORDION GROUP B: GENERAL ACADEMIC & SUBJECT CATEGORIES     */}
      {/* =============================================================== */}
      <div className="rounded-2xl border border-sky-950/80 bg-slate-900/60 overflow-hidden shadow-sm">
        <button
          onClick={() => setOpenAcademicAccordion(prev => !prev)}
          className="w-full p-3.5 flex items-center justify-between bg-sky-950/20 hover:bg-sky-950/30 border-b border-sky-900/30 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-sky-400" />
            <div>
              <span className="text-xs font-bold text-white block">General Academic &amp; Subjects</span>
              <span className="text-[10px] text-sky-400/80">UG, PG, PhD &amp; Specialized Fields</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {((filters.educationLevels?.length || 0) + (filters.subjectCategories?.length || 0)) > 0 && (
              <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {(filters.educationLevels?.length || 0) + (filters.subjectCategories?.length || 0)}
              </span>
            )}
            {openAcademicAccordion ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {openAcademicAccordion && (
          <div className="p-3.5 space-y-4">
            
            {/* Sub-group 1: Education Level Dropdown / Checklist */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <span>Education Level</span>
                {filters.educationLevels?.length > 0 && (
                  <span className="text-sky-400 font-normal">({filters.educationLevels.length})</span>
                )}
              </label>
              
              <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                {[
                  "Doctorate (PhD)",
                  "Master's Degree (MA, MSc, MCom, MTech)",
                  "Bachelor's Degree (BA, BSc, BCom, BTech, MBBS, etc.)",
                  "Diploma / Vocational",
                  "High School / Higher Secondary"
                ].map(level => {
                  const isChecked = filters.educationLevels?.includes(level);
                  return (
                    <label
                      key={level}
                      className={`flex items-start gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-all border ${
                        isChecked
                          ? 'bg-sky-500/15 border-sky-500/40 text-sky-200 font-semibold'
                          : 'hover:bg-slate-800/60 text-slate-300 border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleEducationLevelToggle(level)}
                        className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-950 text-sky-500"
                      />
                      <span className="leading-tight">{level}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Sub-group 2: Subject Category Multi-Select */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <span>Subject Category</span>
                {filters.subjectCategories?.length > 0 && (
                  <span className="text-sky-400 font-normal">({filters.subjectCategories.length})</span>
                )}
              </label>

              <div className="space-y-1.5 max-h-52 overflow-y-auto custom-scrollbar pr-1">
                {SUBJECT_CATEGORIES.map(category => {
                  const isChecked = filters.subjectCategories?.includes(category);
                  const exampleDesc = subjectCategoryDescriptions[category];

                  return (
                    <label
                      key={category}
                      className={`flex flex-col p-2 rounded-xl text-xs cursor-pointer transition-all border ${
                        isChecked
                          ? 'bg-sky-500/15 border-sky-500/40 text-sky-200 font-semibold'
                          : 'hover:bg-slate-800/60 text-slate-300 border-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSubjectCategoryToggle(category)}
                          className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-sky-500 shrink-0"
                        />
                        <span className="font-semibold text-white">{category}</span>
                      </div>
                      {exampleDesc && (
                        <span className="text-[10px] text-slate-400 pl-6 pt-0.5 leading-tight">
                          {exampleDesc}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 5. Professions Checkboxes */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-amber-400" /> Profession Category
        </label>
        <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
          {COMMON_PROFESSIONS.map(prof => {
            const isChecked = filters.professions?.includes(prof);
            return (
              <label 
                key={prof} 
                className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                  isChecked ? 'bg-amber-500/15 text-amber-200 font-semibold' : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleProfessionToggle(prof)}
                  className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-amber-500"
                />
                <span className="truncate">{prof}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 6. District Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-rose-400" /> Home District (Kerala)
        </label>
        <select
          value={filters.district}
          onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs"
        >
          <option value="">All Districts</option>
          {KERALA_DISTRICTS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* 7. Work Country / Location */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-teal-400" /> Work Location
        </label>
        <select
          value={filters.workLocation}
          onChange={(e) => setFilters(prev => ({ ...prev, workLocation: e.target.value }))}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs"
        >
          <option value="">Any Work Location</option>
          {WORK_LOCATIONS.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* 8. Marital Status */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-400" /> Marital Status
        </label>
        <select
          value={filters.maritalStatus}
          onChange={(e) => setFilters(prev => ({ ...prev, maritalStatus: e.target.value }))}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs"
        >
          <option value="">Any Status</option>
          {MARITAL_STATUSES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* 9. Sect / Maslak */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-purple-400" /> Sect / Maslak
        </label>
        <select
          value={filters.sect}
          onChange={(e) => setFilters(prev => ({ ...prev, sect: e.target.value }))}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs"
        >
          <option value="">All Sects</option>
          {SECTS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* 10. Posted Within */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" /> Posted Within
        </label>
        <select
          value={filters.postedWithin}
          onChange={(e) => setFilters(prev => ({ ...prev, postedWithin: e.target.value }))}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs"
        >
          <option value="">Any Time</option>
          <option value="1">Today only</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Filter Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 glass-panel rounded-2xl p-5 border border-slate-800/80 sticky top-28 self-start">
        {filterContent}
      </aside>

      {/* Mobile Filter Drawer */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-filter-heading"
        >
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            aria-hidden="true"
          ></div>
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-slate-950 border-l border-slate-800 p-6 overflow-y-auto shadow-2xl animate-slide-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 id="mobile-filter-heading" className="text-lg font-bold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-400" /> Filters
              </h3>
              <button 
                onClick={onCloseMobile}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 touch-target"
                aria-label="Close filter drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
            <div className="mt-8 pt-4 border-t border-slate-800 sticky bottom-0 bg-slate-950">
              <button
                onClick={onCloseMobile}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 touch-target"
                aria-label="Apply chosen filters"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
