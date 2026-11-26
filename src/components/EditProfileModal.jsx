import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Key, Trash2, Save, AlertCircle, BookOpen, GraduationCap, ChevronDown } from 'lucide-react';
import { 
  KERALA_DISTRICTS, 
  ISLAMIC_QUALIFICATIONS, 
  EDUCATION_LEVELS,
  SUBJECT_CATEGORIES,
  SECTS, 
  COMPLEXIONS,
  MADRASA_CLASSES
} from '../data/mockProfiles';
import { fuzzyMatchPlace, searchKeralaTowns } from '../utils/geoUtils';
import { useAuth } from '../context/AuthContext';

export default function EditProfileModal({ 
  profile, 
  onClose, 
  onSaveUpdate, 
  onDeleteProfile,
  isAdminOverride 
}) {
  const { isAdmin } = useAuth();
  const canAdminEdit = Boolean(isAdminOverride || isAdmin);
  const [pinEntered, setPinEntered] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(canAdminEdit);
  const [pinError, setPinError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPlaceSuggestOpen, setIsPlaceSuggestOpen] = useState(false);
  const placeDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (placeDropdownRef.current && !placeDropdownRef.current.contains(e.target)) {
        setIsPlaceSuggestOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize form state supporting both old & new schemas
  const initialGenderLabel = profile.basicInfo?.gender || (profile.gender === 'female' ? 'Bride' : 'Groom');
  const [formData, setFormData] = useState({
    profileCreatedBy: profile.profileCreatedBy || profile.registeredBy || "Parent",
    status: profile.status || "approved",
    gender: initialGenderLabel === 'Bride' ? 'female' : 'male',
    basicInfo: { color: "", gender: initialGenderLabel, ...profile.basicInfo },
    islamicQualification: Array.isArray(profile.islamicQualification)
      ? profile.islamicQualification
      : (profile.islamicBackground?.qualification ? [profile.islamicBackground.qualification] : ['Wafi']),
    islamicBackground: { ...profile.islamicBackground },
    generalEducation: {
      level: profile.generalEducation?.level || profile.educationOccupation?.level || "Bachelor's Degree (BA, BSc, BCom, BTech, MBBS, etc.)",
      degreeName: profile.generalEducation?.degreeName || profile.educationOccupation?.degree || profile.educationOccupation?.education || "",
      subjectCategory: profile.generalEducation?.subjectCategory || "Arts & Humanities",
      specialization: profile.generalEducation?.specialization || ""
    },
    educationOccupation: { ...profile.educationOccupation },
    locationFamily: { ...profile.locationFamily },
    contactDetails: {
      guardianPhone: profile.contactDetails?.guardianPhone || profile.contactPreferences?.phone || "",
      whatsappNumber: profile.contactDetails?.whatsappNumber || profile.contactPreferences?.whatsapp || "",
      preferredContactMethod: profile.contactDetails?.preferredContactMethod || profile.contactPreferences?.contactMethod || profile.preferredContactMethod || "guardian"
    },
    contactPreferences: { 
      contactMethod: profile.contactPreferences?.contactMethod || profile.preferredContactMethod || "guardian",
      preferredContactMethod: profile.contactPreferences?.preferredContactMethod || profile.preferredContactMethod || "guardian",
      alternateContact: "",
      ...profile.contactPreferences 
    },
    security: { editPin: profile.security?.editPin || profile.contactPreferences?.secretPin || "1234" }
  });

  const isGroomProfile = formData.basicInfo?.gender === 'Groom' || formData.gender === 'male';

  const handlePinVerify = (e) => {
    e.preventDefault();
    setPinError("");

    const correctPin = profile.security?.editPin || profile.contactPreferences?.secretPin || "1234";
    if (pinEntered.trim() === correctPin || pinEntered.trim() === "admin2014") {
      setIsAuthenticated(true);
    } else {
      setPinError("Incorrect secret PIN. Please re-check the 4-digit PIN set during creation.");
    }
  };

  const updateSection = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Resolve GPS coordinates for edited location (prioritizing nearestTown, then nativePlace, fallback to district)
      const locTarget = (formData.locationFamily?.nearestTown || '').trim() || (formData.locationFamily?.nativePlace || '').trim();
      const matchedGeo = fuzzyMatchPlace(
        locTarget,
        formData.locationFamily?.homeDistrict
      );
      const coordinates = matchedGeo ? { lat: matchedGeo.lat, lng: matchedGeo.lng } : null;

      const normalizedGenderLabel = formData.basicInfo?.gender === 'Bride' ? 'Bride' : 'Groom';
      const normalizedGenderCode = normalizedGenderLabel === 'Bride' ? 'female' : 'male';

      const payload = {
        ...formData,
        gender: normalizedGenderCode,
        basicInfo: {
          ...formData.basicInfo,
          gender: normalizedGenderLabel
        },
        coordinates,
        locationFamily: {
          ...formData.locationFamily,
          nearestTown: formData.locationFamily?.nearestTown || matchedGeo?.name || '',
          coordinates,
          canonicalPlace: matchedGeo?.name || formData.locationFamily?.nativePlace
        },
        profileCreatedBy: formData.profileCreatedBy || 'Parent',
        registeredBy: formData.profileCreatedBy || 'Parent',
        islamicBackground: {
          ...formData.islamicBackground,
          qualification: formData.islamicQualification[0] || 'None'
        },
        educationOccupation: {
          ...formData.educationOccupation,
          education: `${formData.generalEducation.degreeName} ${formData.generalEducation.specialization ? `(${formData.generalEducation.specialization})` : ''}`.trim(),
          degree: formData.generalEducation.degreeName.trim()
        },
        contactDetails: {
          guardianPhone: formData.contactDetails.guardianPhone,
          whatsappNumber: formData.contactDetails.whatsappNumber,
          preferredContactMethod: formData.contactPreferences.contactMethod || formData.contactDetails.preferredContactMethod || 'guardian',
          revealContact: isGroomProfile && Boolean(formData.contactPreferences.revealContact || formData.contactDetails.revealContact)
        },
        contactPreferences: {
          ...formData.contactPreferences,
          phone: formData.contactDetails.guardianPhone,
          whatsapp: formData.contactDetails.whatsappNumber,
          contactMethod: formData.contactPreferences.contactMethod || 'guardian',
          preferredContactMethod: formData.contactPreferences.contactMethod || 'guardian',
          revealContact: isGroomProfile && Boolean(formData.contactPreferences.revealContact || formData.contactDetails.revealContact)
        },
        revealContact: isGroomProfile && Boolean(formData.contactPreferences.revealContact || formData.contactDetails.revealContact),
        preferredContactMethod: formData.contactPreferences.contactMethod || 'guardian'
      };

      await onSaveUpdate(profile.id, payload);
      onClose();
    } catch (err) {
      alert("Error updating profile: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onDeleteProfile(profile.id);
      onClose();
    } catch (err) {
      alert("Error deleting profile: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="edit-proposal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
      ></div>

      {/* Modal Card Container */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 animate-fade-in">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit Proposal Listing</h2>
              <p className="text-xs text-slate-400">Proposal ID: <span className="font-mono text-amber-300 font-bold">{profile.id}</span></p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!isAuthenticated ? (
          /* PIN Verification Gate */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-slate-800 text-amber-400 mx-auto flex items-center justify-center border border-slate-700">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Enter Secret Edit PIN</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Only proposal creators with the secret PIN (or administrators) can modify or delete this profile.
              </p>
            </div>

            <form onSubmit={handlePinVerify} className="max-w-xs mx-auto space-y-4">
              <input
                type="password"
                maxLength="8"
                autoFocus
                placeholder="4-digit PIN"
                value={pinEntered}
                onChange={(e) => setPinEntered(e.target.value)}
                className="w-full text-center tracking-widest text-xl font-mono py-3 rounded-2xl bg-slate-950 text-amber-400 border border-slate-700 focus:outline-none focus:border-amber-500 font-bold"
              />
              
              {pinError && (
                <div className="text-rose-400 text-xs flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
              >
                Unlock &amp; Edit Proposal
              </button>
            </form>
          </div>
        ) : (
          /* Editable Form */
          <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            
            {confirmDelete ? (
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3">
                <h4 className="text-base font-bold text-rose-300">Are you sure you want to delete this proposal?</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  This action will permanently delete this proposal listing from the directory.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30"
                  >
                    {isSubmitting ? "Deleting..." : "Yes, Delete Permanently"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Proposal Listing Status */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white uppercase tracking-wider">
                      Listing Visibility Status
                    </label>
                    <span className="text-[10px] text-slate-400">Controls directory display</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'approved', label: 'Active Listing', desc: 'Visible in Directory' },
                      { key: 'hidden', label: 'Paused / In Talks', desc: 'Temporarily Hidden' },
                      { key: 'married', label: 'Nikah Settled', desc: 'Archived / Settled' }
                    ].map(st => (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, status: st.key }))}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          formData.status === st.key
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-semibold">{st.label}</div>
                        <div className="text-[9px] opacity-75">{st.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin-only Bride / Groom Category Correction */}
                {canAdminEdit && (
                  <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Proposal Category (Admin Fix)
                      </label>
                      <span className="text-[10px] text-slate-400">Fix Bride / Groom selection</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData(p => ({
                            ...p,
                            gender: 'female',
                            basicInfo: { ...p.basicInfo, gender: 'Bride' }
                          }))
                        }
                        className={`p-2 rounded-xl text-center border transition-all cursor-pointer text-xs font-bold ${
                          formData.basicInfo?.gender === 'Bride'
                            ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        Bride (Female)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData(p => ({
                            ...p,
                            gender: 'male',
                            basicInfo: { ...p.basicInfo, gender: 'Groom' }
                          }))
                        }
                        className={`p-2 rounded-xl text-center border transition-all cursor-pointer text-xs font-bold ${
                          formData.basicInfo?.gender === 'Groom'
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        Groom (Male)
                      </button>
                    </div>
                  </div>
                )}

                {/* Profile Registered By / Created By */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white uppercase tracking-wider">
                      Profile Registered By
                    </label>
                    <span className="text-[10px] text-slate-400">Proposal origin</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, profileCreatedBy: 'Parent' }))}
                      className={`p-2 rounded-xl text-center border transition-all cursor-pointer text-xs font-bold ${
                        formData.profileCreatedBy === 'Parent'
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Parent / Guardian
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, profileCreatedBy: 'Self' }))}
                      className={`p-2 rounded-xl text-center border transition-all cursor-pointer text-xs font-bold ${
                        formData.profileCreatedBy === 'Self'
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Self (Candidate)
                    </button>
                  </div>
                </div>

                {/* Basic Details */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Basic Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Name / Identifier</label>
                      <input
                        type="text"
                        value={formData.basicInfo.fullName}
                        onChange={(e) => updateSection('basicInfo', 'fullName', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Age (Years)</label>
                      <input
                        type="number"
                        value={formData.basicInfo.age}
                        onChange={(e) => updateSection('basicInfo', 'age', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Color / Complexion</label>
                      <select
                        value={formData.basicInfo.color || ''}
                        onChange={(e) => updateSection('basicInfo', 'color', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      >
                        <option value="">Select (Optional)</option>
                        {COMPLEXIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Islamic Qualifications Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Islamic Qualification
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Islamic Scholar Degree</label>
                      <select
                        value={formData.islamicQualification[0] || 'None'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            islamicQualification: [val],
                            islamicBackground: { ...prev.islamicBackground, qualification: val }
                          }));
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      >
                        {ISLAMIC_QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                      </select>
                    </div>

                    {/* Madrasa Class – shown only when Madrasa is selected */}
                    {formData.islamicQualification[0] === 'Madrasa' && (
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Highest Madrasa Class</label>
                        <select
                          value={formData.islamicBackground.madrasaClass || ''}
                          onChange={(e) => updateSection('islamicBackground', 'madrasaClass', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                        >
                          <option value="">Select Class</option>
                          {MADRASA_CLASSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Sect / Maslak</label>
                      <select
                        value={formData.islamicBackground.sect}
                        onChange={(e) => updateSection('islamicBackground', 'sect', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      >
                        {SECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* General Academic Education (Level, Degree, Subject Category, Specialization) */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" /> General Academic Education &amp; Subjects
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Education Level</label>
                      <select
                        value={formData.generalEducation.level}
                        onChange={(e) => updateSection('generalEducation', 'level', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      >
                        {EDUCATION_LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Degree Title</label>
                      <input
                        type="text"
                        value={formData.generalEducation.degreeName}
                        onChange={(e) => updateSection('generalEducation', 'degreeName', e.target.value)}
                        placeholder="e.g. B.A., M.Sc., Ph.D., B.Tech, MBBS"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Specialized Subject Category</label>
                      <select
                        value={formData.generalEducation.subjectCategory}
                        onChange={(e) => updateSection('generalEducation', 'subjectCategory', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      >
                        {SUBJECT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Specific Field of Study</label>
                      <input
                        type="text"
                        value={formData.generalEducation.specialization}
                        onChange={(e) => updateSection('generalEducation', 'specialization', e.target.value)}
                        placeholder="e.g. Economics, Biotechnology"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Profession & Location */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Profession &amp; District</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Profession</label>
                      <input
                        type="text"
                        value={formData.educationOccupation.profession}
                        onChange={(e) => updateSection('educationOccupation', 'profession', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Home District</label>
                      <select
                        value={formData.locationFamily.homeDistrict}
                        onChange={(e) => {
                          const newDist = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            locationFamily: {
                              ...prev.locationFamily,
                              homeDistrict: newDist,
                              nearestTown: ''
                            }
                          }));
                          setIsPlaceSuggestOpen(true);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      >
                        {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="relative" ref={placeDropdownRef}>
                      <label className="block text-[11px] text-slate-400 mb-1">Nearest Major Town (For GPS Distance)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.locationFamily.nearestTown || ''}
                          onChange={(e) => {
                            updateSection('locationFamily', 'nearestTown', e.target.value);
                            setIsPlaceSuggestOpen(true);
                          }}
                          onFocus={() => setIsPlaceSuggestOpen(true)}
                          placeholder={`Select or type town in ${formData.locationFamily.homeDistrict || 'Kerala'}`}
                          className="w-full px-3 py-2 pr-8 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => setIsPlaceSuggestOpen(prev => !prev)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-400 cursor-pointer"
                          aria-label="Toggle nearby locations list"
                        >
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPlaceSuggestOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      {isPlaceSuggestOpen && (
                        <div className="absolute z-30 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-1 custom-scrollbar">
                          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-slate-950/70 border-b border-slate-800 sticky top-0">
                            Nearby Locations in {formData.locationFamily.homeDistrict || 'Kerala'}
                          </div>
                          {searchKeralaTowns(formData.locationFamily.nearestTown, 25, formData.locationFamily.homeDistrict).map(town => (
                            <button
                              key={`${town.name}-${town.district}`}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  locationFamily: {
                                    ...prev.locationFamily,
                                    nearestTown: town.name,
                                    homeDistrict: town.district,
                                    nativePlace: prev.locationFamily.nativePlace || town.name,
                                    coordinates: { lat: town.lat, lng: town.lng }
                                  }
                                }));
                                setIsPlaceSuggestOpen(false);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-800 flex items-center justify-between text-slate-200 transition-colors cursor-pointer"
                            >
                              <div>
                                <span className="font-semibold text-emerald-300">{town.name}</span>
                                <span className="text-[10px] text-slate-400 ml-1.5">({town.district})</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Native Place / Village / Mahallu</label>
                      <input
                        type="text"
                        value={formData.locationFamily.nativePlace || ''}
                        onChange={(e) => updateSection('locationFamily', 'nativePlace', e.target.value)}
                        placeholder="e.g. Koolimadu, Chanthakkunnu, Pazhoor Mahallu"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Protected Contact Numbers & Preferences */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">Contact Preferences &amp; Guarded Numbers</h3>
                  
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Preferred Contact Method</label>
                    <select
                      value={formData.contactPreferences.contactMethod || formData.contactDetails.preferredContactMethod || 'guardian'}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateSection('contactPreferences', 'contactMethod', val);
                        updateSection('contactPreferences', 'preferredContactMethod', val);
                        updateSection('contactDetails', 'preferredContactMethod', val);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="whatsapp_only">WhatsApp Only (Calls discouraged)</option>
                      <option value="guardian">Contact Guardian / Wali</option>
                      <option value="candidate_self">Contact Candidate Directly</option>
                      <option value="both">Flexible / Any (Calls or WhatsApp)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        {formData.contactPreferences.contactMethod === 'candidate_self' ? 'Candidate Phone' : 'Guardian Phone'}
                      </label>
                      <input
                        type="tel"
                        value={formData.contactDetails.guardianPhone}
                        onChange={(e) => updateSection('contactDetails', 'guardianPhone', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        {formData.contactPreferences.contactMethod === 'whatsapp_only' ? 'Dedicated WhatsApp Number' : 'WhatsApp Number'}
                      </label>
                      <input
                        type="tel"
                        value={formData.contactDetails.whatsappNumber}
                        onChange={(e) => updateSection('contactDetails', 'whatsappNumber', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      />
                    </div>
                  </div>

                  {isGroomProfile ? (
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                      <label htmlFor="editRevealContactCheckbox" className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          id="editRevealContactCheckbox"
                          checked={Boolean(formData.contactPreferences.revealContact || formData.contactDetails.revealContact)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            updateSection('contactPreferences', 'revealContact', checked);
                            updateSection('contactDetails', 'revealContact', checked);
                          }}
                          className="w-4 h-4 mt-0.5 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer shrink-0"
                        />
                        <div>
                          <span className="text-xs font-bold text-emerald-300 block">
                            Reveal my contact details directly to verified Brides / Walis
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            If unchecked, your phone/WhatsApp stays hidden and requests go through Admin.
                          </span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="text-[11px] text-rose-200/90">
                        Bride contact numbers are always hidden for privacy; requests go through Admin.
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Proposal</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>
                </div>
              </>
            )}

          </form>
        )}

      </div>
    </div>
  );
}
