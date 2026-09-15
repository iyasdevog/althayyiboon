import React, { useState } from 'react';
import { 
  X, 
  User, 
  BookOpen, 
  GraduationCap, 
  MapPin, 
  Phone, 
  MessageSquare,
  Send, 
  Sparkles, 
  CheckCircle,
  AlertCircle,
  Key,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { 
  KERALA_DISTRICTS, 
  ISLAMIC_QUALIFICATIONS, 
  SECTS, 
  COMMUNITY_GROUPS, 
  MARITAL_STATUSES,
  COMMON_PROFESSIONS 
} from '../data/mockProfiles';


export default function AddProfileModal({ onClose, onSubmitProfile }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedPin, setSubmittedPin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    basicInfo: {
      fullName: "",
      gender: "Bride",
      age: 22,
      dob: "",
      maritalStatus: "Unmarried",
      height: "5 ft 4 in (163 cm)",
      physicalStatus: "Normal"
    },
    islamicBackground: {
      sect: "Sunni",
      subGroup: "General Sunni",
      qualification: "Wafiyya"
    },
    educationOccupation: {
      education: "",
      profession: "",
      workLocation: "Kerala",
      workCountry: "India"
    },
    locationFamily: {
      homeDistrict: "Malappuram",
      nativePlace: "",
      familyType: "Nuclear",
      financialStatus: "Middle Class",
      familyDetails: ""
    },
    contactPreferences: {
      contactPerson: "",
      relationship: "Father",
      phone: "",
      whatsapp: "",
      alternateContact: "",
      contactMethod: "both", // "whatsapp_only" | "both" | "call_only" | "any"
      expectations: ""
    },
    security: {
      editPin: "1234"
    }
  });

  const updateSection = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.basicInfo.fullName.trim()) {
      setErrorMsg("Please enter Full Name or Alias.");
      setStep(1);
      return;
    }

    const { contactMethod, phone, whatsapp, alternateContact } = formData.contactPreferences;
    const hasPhone = Boolean(phone && phone.trim());
    const hasWhatsapp = Boolean(whatsapp && whatsapp.trim());
    const hasAlternate = Boolean(alternateContact && alternateContact.trim());

    if (contactMethod === "whatsapp_only" && !hasWhatsapp) {
      setErrorMsg("Please provide a WhatsApp number.");
      setStep(4);
      return;
    }
    if (contactMethod === "call_only" && !hasPhone) {
      setErrorMsg("Please provide a Phone number for calling.");
      setStep(4);
      return;
    }
    if (!hasPhone && !hasWhatsapp && !hasAlternate) {
      setErrorMsg("Please provide at least one contact detail (WhatsApp, Direct Phone, or Alternate Contact).");
      setStep(4);
      return;
    }
    if (!formData.security.editPin || formData.security.editPin.length < 4) {
      setErrorMsg("Please enter a valid 4-digit secret Edit PIN.");
      setStep(4);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitProfile(formData);
      setSubmittedPin(formData.security.editPin);
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
      ></div>

      {/* Modal Card Container */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 animate-fade-in">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Matrimony Proposal</h2>
              <p className="text-xs text-slate-400">Open community directory submission • Secured with Secret PIN</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        {!success && (
          <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400">
            <button 
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 transition-colors ${step === 1 ? 'text-emerald-400 font-bold' : ''}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'bg-slate-800'}`}>1</span>
              <span>Basic Info</span>
            </button>
            <span>&gt;</span>
            <button 
              onClick={() => setStep(2)}
              className={`flex items-center gap-1.5 transition-colors ${step === 2 ? 'text-emerald-400 font-bold' : ''}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'bg-slate-800'}`}>2</span>
              <span>Islamic Background</span>
            </button>
            <span>&gt;</span>
            <button 
              onClick={() => setStep(3)}
              className={`flex items-center gap-1.5 transition-colors ${step === 3 ? 'text-emerald-400 font-bold' : ''}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'bg-slate-800'}`}>3</span>
              <span>Edu & Job</span>
            </button>
            <span>&gt;</span>
            <button 
              onClick={() => setStep(4)}
              className={`flex items-center gap-1.5 transition-colors ${step === 4 ? 'text-emerald-400 font-bold' : ''}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 4 ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'bg-slate-800'}`}>4</span>
              <span>Contact & Secret PIN</span>
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          
          {/* SUCCESS STATE WITH SECRET PIN NOTICE */}
          {success ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Proposal Listed Successfully!</h3>
              
              {/* PIN NOTICE BOX */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 space-y-2">
                <div className="flex items-center justify-center gap-2 font-bold text-amber-300 text-sm">
                  <Key className="w-4 h-4" />
                  <span>Your Secret Edit PIN: <span className="font-mono text-base underline text-white">{submittedPin}</span></span>
                </div>
                <p className="leading-relaxed">
                  Please remember or write down this secret PIN! You will need this PIN whenever you want to edit or delete your proposal in the future.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
                >
                  Done & Return to Directory
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: BASIC INFO */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Section A: Basic Personal Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name / Candidate Alias *</label>
                      <input
                        type="text"
                        required
                        value={formData.basicInfo.fullName}
                        onChange={(e) => updateSection('basicInfo', 'fullName', e.target.value)}
                        placeholder="e.g. Aysha Fathima / Candidate Name"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Gender *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Bride", "Groom"].map(g => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => updateSection('basicInfo', 'gender', g)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                              formData.basicInfo.gender === g
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                : 'bg-slate-950 text-slate-400 border-slate-800'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Age (Years) *</label>
                      <input
                        type="number"
                        min="18"
                        max="70"
                        value={formData.basicInfo.age}
                        onChange={(e) => updateSection('basicInfo', 'age', Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.basicInfo.dob}
                        onChange={(e) => updateSection('basicInfo', 'dob', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Marital Status</label>
                      <select
                        value={formData.basicInfo.maritalStatus}
                        onChange={(e) => updateSection('basicInfo', 'maritalStatus', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                      >
                        {MARITAL_STATUSES.map(ms => <option key={ms} value={ms}>{ms}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Height (e.g. 5 ft 4 in / 163 cm)</label>
                      <input
                        type="text"
                        value={formData.basicInfo.height}
                        onChange={(e) => updateSection('basicInfo', 'height', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Physical Status</label>
                      <input
                        type="text"
                        value={formData.basicInfo.physicalStatus}
                        onChange={(e) => updateSection('basicInfo', 'physicalStatus', e.target.value)}
                        placeholder="Normal / Differently Abled"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                    >
                      Next: Islamic Background &gt;
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: ISLAMIC BACKGROUND */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Section B: Islamic & Community Background</h3>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Islamic Qualification / Scholar Title</label>
                    <select
                      value={formData.islamicBackground.qualification}
                      onChange={(e) => updateSection('islamicBackground', 'qualification', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      {ISLAMIC_QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Sect / Maslak</label>
                      <select
                        value={formData.islamicBackground.sect}
                        onChange={(e) => updateSection('islamicBackground', 'sect', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                      >
                        {SECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Community / Lineage Group</label>
                      <select
                        value={formData.islamicBackground.subGroup}
                        onChange={(e) => updateSection('islamicBackground', 'subGroup', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                      >
                        {COMMUNITY_GROUPS.map(cg => <option key={cg} value={cg}>{cg}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                    >
                      &lt; Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                    >
                      Next: Education & Job &gt;
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: GENERAL EDUCATION & OCCUPATION */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Section C: Education & Occupation</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Highest General Education *</label>
                      <input
                        type="text"
                        required
                        value={formData.educationOccupation.education}
                        onChange={(e) => updateSection('educationOccupation', 'education', e.target.value)}
                        placeholder="e.g. B.Tech CS / M.Sc Math / MBBS / High School"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Profession / Occupation *</label>
                      <input
                        type="text"
                        required
                        list="common-professions-list"
                        value={formData.educationOccupation.profession}
                        onChange={(e) => updateSection('educationOccupation', 'profession', e.target.value)}
                        placeholder="e.g. Software Engineer / Teacher / Business"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                      <datalist id="common-professions-list">
                        {COMMON_PROFESSIONS.map(p => (
                          <option key={p} value={p} />
                        ))}
                      </datalist>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Work Location City/State</label>
                      <input
                        type="text"
                        value={formData.educationOccupation.workLocation}
                        onChange={(e) => updateSection('educationOccupation', 'workLocation', e.target.value)}
                        placeholder="e.g. Kozhikode / Dubai / Riyadh"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Work Country</label>
                      <select
                        value={formData.educationOccupation.workCountry}
                        onChange={(e) => updateSection('educationOccupation', 'workCountry', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="India">India</option>
                        <option value="UAE">UAE</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Oman">Oman</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Abroad (Other)">Abroad (Other)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                    >
                      &lt; Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                    >
                      Next: Contact & Secret PIN &gt;
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: LOCATION, FAMILY & SECRET EDIT PIN */}
              {step === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Section D: Contact Details & Secret Edit PIN</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Home District (Kerala) *</label>
                      <select
                        value={formData.locationFamily.homeDistrict}
                        onChange={(e) => updateSection('locationFamily', 'homeDistrict', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                      >
                        {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Native City / Place *</label>
                      <input
                        type="text"
                        required
                        value={formData.locationFamily.nativePlace}
                        onChange={(e) => updateSection('locationFamily', 'nativePlace', e.target.value)}
                        placeholder="e.g. Koduvally / Tirur / Thalassery"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Guardian Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.contactPreferences.contactPerson}
                        onChange={(e) => updateSection('contactPreferences', 'contactPerson', e.target.value)}
                        placeholder="e.g. Muhammad (Father)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Preferred Contact Mode Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Contact Mode *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => updateSection('contactPreferences', 'contactMethod', 'whatsapp_only')}
                          className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                            formData.contactPreferences.contactMethod === 'whatsapp_only'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/50'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp Only</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateSection('contactPreferences', 'contactMethod', 'both')}
                          className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                            formData.contactPreferences.contactMethod === 'both'
                              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 ring-1 ring-teal-500/50'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                          }`}
                        >
                          <span>Call & WhatsApp</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateSection('contactPreferences', 'contactMethod', 'call_only')}
                          className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                            formData.contactPreferences.contactMethod === 'call_only'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 ring-1 ring-blue-500/50'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                          }`}
                        >
                          <Phone className="w-3.5 h-3.5 text-blue-400" />
                          <span>Call Only</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateSection('contactPreferences', 'contactMethod', 'any')}
                          className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                            formData.contactPreferences.contactMethod === 'any'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 ring-1 ring-purple-500/50'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                          }`}
                        >
                          <span>Any Contact</span>
                        </button>
                      </div>
                      {formData.contactPreferences.contactMethod === 'whatsapp_only' && (
                        <p className="text-[11px] text-emerald-400/90 mt-1 flex items-center gap-1">
                          🔒 Direct Phone Call button will be hidden. Viewers will be directed to WhatsApp.
                        </p>
                      )}
                    </div>

                    {/* Separate Phone, WhatsApp & Alternate Contact Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Number
                        </label>
                        <input
                          type="text"
                          required={formData.contactPreferences.contactMethod === 'whatsapp_only'}
                          value={formData.contactPreferences.whatsapp}
                          onChange={(e) => updateSection('contactPreferences', 'whatsapp', e.target.value)}
                          placeholder="e.g. +91 9876543210"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-blue-400" /> Direct Calling Phone Number
                        </label>
                        <input
                          type="text"
                          required={formData.contactPreferences.contactMethod === 'call_only'}
                          value={formData.contactPreferences.phone}
                          onChange={(e) => updateSection('contactPreferences', 'phone', e.target.value)}
                          placeholder="e.g. +91 9876543210"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-purple-400" /> Alternate Contact (Secondary Phone / Landline / Email)
                        </label>
                        <input
                          type="text"
                          value={formData.contactPreferences.alternateContact || ''}
                          onChange={(e) => updateSection('contactPreferences', 'alternateContact', e.target.value)}
                          placeholder="e.g. +91 9123456789 (Relative) or contact@family.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PROMINENT SECRET PIN INPUT & SECURITY NOTICE */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                      <Key className="w-4 h-4 text-amber-400" />
                      <span>Set Secret Edit PIN (Required)</span>
                    </div>
                    
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      💡 <strong className="text-amber-300">Security Notice:</strong> Keep this 4-digit PIN safe! You will need this secret PIN whenever you want to edit or remove your proposal in the future.
                    </p>

                    <div>
                      <input
                        type="text"
                        maxLength="6"
                        required
                        value={formData.security.editPin}
                        onChange={(e) => updateSection('security', 'editPin', e.target.value)}
                        placeholder="e.g. 1234"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-amber-300 font-mono font-bold text-sm border border-amber-500/40 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                    >
                      &lt; Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? "Submitting..." : "Submit Proposal"}</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </form>

      </div>
    </div>
  );
}
