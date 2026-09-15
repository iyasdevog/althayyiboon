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
  CheckCircle,
  AlertCircle,
  Key,
  ChevronLeft,
  ChevronRight,
  FileText,
  Shield
} from 'lucide-react';
import {
  KERALA_DISTRICTS,
  ISLAMIC_QUALIFICATIONS,
  SECTS,
  COMMUNITY_GROUPS,
  MARITAL_STATUSES,
  COMMON_PROFESSIONS,
  COMPLEXIONS
} from '../data/mockProfiles';

const inputCls =
  'w-full px-4 py-3 rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-colors';
const labelCls = 'block text-xs font-semibold text-slate-300 mb-1.5';

// cm → feet auto-convert helper
function handleHeightChange(raw, updateFn) {
  const numMatch = raw.match(/^\s*(\d{2,3})\s*(?:cm)?\s*$/i);
  if (numMatch) {
    const cm = parseInt(numMatch[1], 10);
    if (cm >= 100 && cm <= 250) {
      const totalInches = cm / 2.54;
      const ft = Math.floor(totalInches / 12);
      const inch = Math.round(totalInches % 12);
      updateFn(`${ft} ft ${inch} in (${cm} cm)`);
      return;
    }
  }
  updateFn(raw);
}

const STEPS = [
  { num: 1, label: 'Basic Info', icon: User },
  { num: 2, label: 'Islamic', icon: BookOpen },
  { num: 3, label: 'Edu & Job', icon: GraduationCap },
  { num: 4, label: 'Contact', icon: Phone },
];

export default function AddProfileModal({ onClose, onSubmitProfile, defaultGender = 'Bride' }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedPin, setSubmittedPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const initialGender = (defaultGender === 'Groom' || defaultGender === 'Bride') ? defaultGender : 'Bride';

  const [formData, setFormData] = useState({
    basicInfo: {
      fullName: '',
      gender: initialGender,
      age: 22,
      dob: '',
      maritalStatus: 'Unmarried',
      height: '',
      physicalStatus: 'Normal',
      color: '',
    },
    islamicBackground: {
      sect: 'Sunni',
      subGroup: 'General Sunni',
      qualification: 'Wafiyya',
    },
    educationOccupation: {
      education: '',
      profession: '',
      workLocation: '',
      workCountry: 'India',
    },
    locationFamily: {
      homeDistrict: 'Malappuram',
      nativePlace: '',
    },
    contactPreferences: {
      contactPerson: '',
      phone: '',
      whatsapp: '',
      alternateContact: '',
      contactMethod: 'both',
      expectations: '',
    },
    security: { editPin: '' },
  });

  const updateSection = (section, field, value) =>
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.basicInfo.fullName.trim()) {
      setErrorMsg('Please enter the Full Name or Alias.');
      setStep(1);
      return;
    }

    const { contactMethod, phone, whatsapp, alternateContact } = formData.contactPreferences;
    const hasPhone = Boolean(phone?.trim());
    const hasWhatsapp = Boolean(whatsapp?.trim());
    const hasAlternate = Boolean(alternateContact?.trim());

    if (contactMethod === 'whatsapp_only' && !hasWhatsapp) {
      setErrorMsg('Please provide a WhatsApp number.');
      setStep(4);
      return;
    }
    if (contactMethod === 'call_only' && !hasPhone) {
      setErrorMsg('Please provide a Phone number.');
      setStep(4);
      return;
    }
    if (!hasPhone && !hasWhatsapp && !hasAlternate) {
      setErrorMsg('Please provide at least one contact (WhatsApp, Phone, or Alternate).');
      setStep(4);
      return;
    }
    if (!formData.security.editPin || formData.security.editPin.length < 4) {
      setErrorMsg('Please set a 4-digit Secret Edit PIN.');
      setStep(4);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitProfile(formData);
      setSubmittedPin(formData.security.editPin);
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    /* Full-screen on mobile, centered card on sm+ */
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-slate-900 sm:border sm:border-slate-700/80 sm:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[100dvh] sm:max-h-[92dvh] animate-slide-up overflow-hidden">

        {/* ── STICKY HEADER ── */}
        <div className="flex-shrink-0">
          {/* Title row */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <User className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-white leading-tight">Add Matrimony Proposal</h2>
                <p className="text-[10px] text-slate-400 truncate">Free community listing • Secured with PIN</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step progress */}
          {!success && (
            <div className="px-5 py-3 bg-slate-950/70 border-b border-slate-800">
              {/* Progress bar */}
              <div className="relative flex items-center justify-between mb-2.5">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500 z-0 transition-all duration-300"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
                {STEPS.map(s => {
                  const Icon = s.icon;
                  const done = s.num < step;
                  const active = s.num === step;
                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => s.num < step && setStep(s.num)}
                      className="relative z-10 flex flex-col items-center gap-1"
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                        active ? 'bg-emerald-500 border-emerald-400 scale-110' :
                        done  ? 'bg-emerald-700 border-emerald-600' :
                                'bg-slate-800 border-slate-700'
                      }`}>
                        {done
                          ? <CheckCircle className="w-3.5 h-3.5 text-white" />
                          : <Icon className={`w-3 h-3 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                        }
                      </div>
                    </button>
                  );
                })}
              </div>
              {/* Active step label */}
              <p className="text-center text-[11px] font-bold text-emerald-400 tracking-wide uppercase">
                Step {step} of 4 — {STEPS[step - 1].label}
              </p>
            </div>
          )}

          {/* Error */}
          {errorMsg && (
            <div className="mx-4 mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* ── SCROLLABLE FORM BODY ── */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-4">

            {/* SUCCESS */}
            {success ? (
              <div className="py-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Proposal Listed!</h3>
                  <p className="text-xs text-slate-400 mt-1">Your listing is now live in the directory.</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 space-y-2 text-left">
                  <div className="flex items-center gap-2 font-bold text-amber-300 text-sm justify-center">
                    <Key className="w-4 h-4" />
                    <span>Your Secret Edit PIN: <span className="font-mono text-base text-white underline">{submittedPin}</span></span>
                  </div>
                  <p className="leading-relaxed text-center">
                    Save this PIN! You'll need it to edit or delete your proposal later.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Done — Return to Directory
                </button>
              </div>
            ) : (
              <>
                {/* ── STEP 1: BASIC INFO ── */}
                {step === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <SectionTitle>A. Basic Personal Information</SectionTitle>

                    <div>
                      <label className={labelCls}>Full Name / Alias *</label>
                      <input
                        type="text"
                        required
                        value={formData.basicInfo.fullName}
                        onChange={e => updateSection('basicInfo', 'fullName', e.target.value)}
                        placeholder="e.g. Aysha Fathima"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Gender *</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Bride', 'Groom'].map(g => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => updateSection('basicInfo', 'gender', g)}
                            className={`py-3 rounded-xl font-bold text-sm transition-all border ${
                              formData.basicInfo.gender === g
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                                : 'bg-slate-950 text-slate-300 border-slate-800 active:bg-slate-800'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Age (Years) *</label>
                        <input
                          type="number"
                          min="18" max="70"
                          value={formData.basicInfo.age}
                          onChange={e => updateSection('basicInfo', 'age', Number(e.target.value))}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Date of Birth</label>
                        <input
                          type="date"
                          value={formData.basicInfo.dob}
                          onChange={e => updateSection('basicInfo', 'dob', e.target.value)}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Marital Status</label>
                      <select
                        value={formData.basicInfo.maritalStatus}
                        onChange={e => updateSection('basicInfo', 'maritalStatus', e.target.value)}
                        className={inputCls}
                      >
                        {MARITAL_STATUSES.map(ms => <option key={ms} value={ms}>{ms}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>
                        Height
                        <span className="ml-1.5 text-emerald-400/70 font-normal normal-case">
                          (type cm to auto-convert)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.basicInfo.height}
                        onChange={e => handleHeightChange(e.target.value, v => updateSection('basicInfo', 'height', v))}
                        placeholder="e.g. 163 cm  or  5 ft 4 in"
                        className={inputCls}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Physical Status</label>
                        <input
                          type="text"
                          value={formData.basicInfo.physicalStatus}
                          onChange={e => updateSection('basicInfo', 'physicalStatus', e.target.value)}
                          placeholder="Normal"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Complexion</label>
                        <select
                          value={formData.basicInfo.color || ''}
                          onChange={e => updateSection('basicInfo', 'color', e.target.value)}
                          className={inputCls}
                        >
                          <option value="">Optional</option>
                          {COMPLEXIONS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: ISLAMIC BACKGROUND ── */}
                {step === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <SectionTitle>B. Islamic &amp; Community Background</SectionTitle>

                    <div>
                      <label className={labelCls}>Islamic Qualification / Scholar Title</label>
                      <select
                        value={formData.islamicBackground.qualification}
                        onChange={e => updateSection('islamicBackground', 'qualification', e.target.value)}
                        className={inputCls}
                      >
                        {ISLAMIC_QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>Sect / Maslak</label>
                      <select
                        value={formData.islamicBackground.sect}
                        onChange={e => updateSection('islamicBackground', 'sect', e.target.value)}
                        className={inputCls}
                      >
                        {SECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>Community / Lineage Group</label>
                      <select
                        value={formData.islamicBackground.subGroup}
                        onChange={e => updateSection('islamicBackground', 'subGroup', e.target.value)}
                        className={inputCls}
                      >
                        {COMMUNITY_GROUPS.map(cg => <option key={cg} value={cg}>{cg}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: EDUCATION & JOB ── */}
                {step === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    <SectionTitle>C. Education &amp; Occupation</SectionTitle>

                    <div>
                      <label className={labelCls}>Highest General Education *</label>
                      <input
                        type="text"
                        required
                        value={formData.educationOccupation.education}
                        onChange={e => updateSection('educationOccupation', 'education', e.target.value)}
                        placeholder="e.g. B.Tech / MBBS / High School"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Profession / Occupation *</label>
                      <input
                        type="text"
                        required
                        list="prof-list"
                        value={formData.educationOccupation.profession}
                        onChange={e => updateSection('educationOccupation', 'profession', e.target.value)}
                        placeholder="e.g. Software Engineer / Teacher"
                        className={inputCls}
                      />
                      <datalist id="prof-list">
                        {COMMON_PROFESSIONS.map(p => <option key={p} value={p} />)}
                      </datalist>
                    </div>

                    <div>
                      <label className={labelCls}>Work Location / City</label>
                      <input
                        type="text"
                        value={formData.educationOccupation.workLocation}
                        onChange={e => updateSection('educationOccupation', 'workLocation', e.target.value)}
                        placeholder="e.g. Kozhikode / Dubai / Riyadh"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Work Country</label>
                      <select
                        value={formData.educationOccupation.workCountry}
                        onChange={e => updateSection('educationOccupation', 'workCountry', e.target.value)}
                        className={inputCls}
                      >
                        {['India','UAE','Saudi Arabia','Qatar','Oman','Kuwait','Bahrain','Abroad (Other)'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* ── STEP 4: CONTACT & PIN ── */}
                {step === 4 && (
                  <div className="space-y-4 animate-fade-in">
                    <SectionTitle>D. Contact Details &amp; Secret PIN</SectionTitle>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Home District *</label>
                        <select
                          value={formData.locationFamily.homeDistrict}
                          onChange={e => updateSection('locationFamily', 'homeDistrict', e.target.value)}
                          className={inputCls}
                        >
                          {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Native Place *</label>
                        <input
                          type="text"
                          required
                          value={formData.locationFamily.nativePlace}
                          onChange={e => updateSection('locationFamily', 'nativePlace', e.target.value)}
                          placeholder="e.g. Tirur"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Contact Guardian Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.contactPreferences.contactPerson}
                        onChange={e => updateSection('contactPreferences', 'contactPerson', e.target.value)}
                        placeholder="e.g. Muhammad (Father)"
                        className={inputCls}
                      />
                    </div>

                    {/* Contact Mode */}
                    <div>
                      <label className={labelCls}>Preferred Contact Mode *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { val: 'whatsapp_only', label: 'WhatsApp Only', color: 'emerald' },
                          { val: 'both',          label: 'Call & WhatsApp', color: 'teal' },
                          { val: 'call_only',     label: 'Call Only', color: 'blue' },
                          { val: 'any',           label: 'Any Method', color: 'purple' },
                        ].map(({ val, label, color }) => {
                          const active = formData.contactPreferences.contactMethod === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => updateSection('contactPreferences', 'contactMethod', val)}
                              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                                active
                                  ? `bg-${color}-500/20 text-${color}-300 border-${color}-500/40 ring-1 ring-${color}-500/40`
                                  : 'bg-slate-950 text-slate-400 border-slate-800 active:bg-slate-800'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Phone inputs */}
                    <div>
                      <label className={labelCls}>
                        <MessageSquare className="inline w-3.5 h-3.5 text-emerald-400 mr-1" />
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={formData.contactPreferences.whatsapp}
                        onChange={e => updateSection('contactPreferences', 'whatsapp', e.target.value)}
                        placeholder="+91 9876543210"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>
                        <Phone className="inline w-3.5 h-3.5 text-blue-400 mr-1" />
                        Direct Call Number
                      </label>
                      <input
                        type="tel"
                        value={formData.contactPreferences.phone}
                        onChange={e => updateSection('contactPreferences', 'phone', e.target.value)}
                        placeholder="+91 9876543210"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Alternate Contact (Optional)</label>
                      <input
                        type="text"
                        value={formData.contactPreferences.alternateContact || ''}
                        onChange={e => updateSection('contactPreferences', 'alternateContact', e.target.value)}
                        placeholder="Secondary phone / email"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>
                        <FileText className="inline w-3.5 h-3.5 text-emerald-400 mr-1" />
                        Expectations &amp; Demands (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.contactPreferences.expectations || ''}
                        onChange={e => updateSection('contactPreferences', 'expectations', e.target.value)}
                        placeholder="Any specific expectations for the bride / groom..."
                        className={`${inputCls} resize-none custom-scrollbar`}
                      />
                    </div>

                    {/* Secret PIN box */}
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2.5">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                        <Key className="w-4 h-4 text-amber-400" />
                        <span>Set Secret Edit PIN</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        🔒 You'll need this 4-digit PIN to edit or delete your proposal later. Keep it safe!
                      </p>
                      <input
                        type="number"
                        maxLength="6"
                        required
                        value={formData.security.editPin}
                        onChange={e => updateSection('security', 'editPin', e.target.value)}
                        placeholder="Enter 4-digit PIN"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 text-amber-300 font-mono font-bold text-lg text-center tracking-widest border border-amber-500/40 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── STICKY FOOTER NAVIGATION ── */}
          {!success && (
            <div className="flex-shrink-0 px-5 py-4 border-t border-slate-800 bg-slate-900 flex items-center gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-semibold text-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}

              <div className="flex-1" />

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                </button>
              )}
            </div>
          )}
        </form>

      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
      <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{children}</h3>
    </div>
  );
}
