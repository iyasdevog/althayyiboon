import React, { useState } from 'react';
import {
  X,
  User,
  BookOpen,
  GraduationCap,
  Briefcase,
  Phone,
  Send,
  CheckCircle,
  AlertCircle,
  Key,
  ChevronLeft,
  ChevronRight,
  Shield,
  Users,
  CreditCard,
  QrCode,
  Copy,
  Gift,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import {
  KERALA_DISTRICTS,
  ISLAMIC_QUALIFICATIONS,
  EDUCATION_LEVELS,
  SUBJECT_CATEGORIES,
  SECTS,
  COMMUNITY_GROUPS,
  MARITAL_STATUSES,
  COMMON_PROFESSIONS,
  COMPLEXIONS,
  WORK_LOCATIONS
} from '../data/mockProfiles';
import { useAuth } from '../context/AuthContext';

const inputCls =
  'w-full px-4 py-3 rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-colors text-xs sm:text-sm';
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
  { num: 2, label: 'Background', icon: BookOpen },
  { num: 3, label: 'Edu & Job', icon: GraduationCap },
  { num: 4, label: 'Contact', icon: Phone },
];

export default function AddProfileModal({ onClose, onSubmitProfile, defaultGender = 'Bride' }) {
  const { currentUser, loginWithGoogle, loginWithEmailPassword, setHasRegisteredProfile, pricing } = useAuth();
  const [authError, setAuthError] = useState('');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedPin, setSubmittedPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const determinedGender = (defaultGender === 'Groom' || defaultGender === 'Bride')
    ? defaultGender
    : (currentUser?.gender === 'female' || currentUser?.role === 'bride' ? 'Bride' : 'Groom');
  const initialGender = determinedGender;

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'razorpay'
  const [paymentRef, setPaymentRef] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showUpiQr, setShowUpiQr] = useState(false);

  const [formData, setFormData] = useState({
    profileCreatedBy: 'Parent', // 'Parent' | 'Self'
    gender: initialGender === 'Bride' ? 'female' : 'male',
    whatsappConsent: true,
    whatsappGroupNumber: '',
    basicInfo: {
      fullName: (currentUser?.name && currentUser.name !== 'Member') ? currentUser.name : '',
      gender: initialGender,
      age: 23,
      dob: '',
      maritalStatus: 'Never Married',
      height: '',
      physicalStatus: 'Normal',
      color: '',
      motherTongue: 'Malayalam'
    },
    islamicQualification: [initialGender === 'Bride' ? 'Wafiyya' : 'Wafi'],
    islamicBackground: {
      qualification: initialGender === 'Bride' ? 'Wafiyya' : 'Wafi',
      institution: '',
      sect: 'Sunni',
      subGroup: 'General Sunni',
    },
    generalEducation: {
      level: "Bachelor's Degree (BA, BSc, BCom, BTech, MBBS, etc.)",
      degreeName: '',
      subjectCategory: 'Arts & Humanities',
      specialization: '',
    },
    educationOccupation: {
      education: '',
      profession: '',
      jobTitle: '',
      workLocation: '',
      workCountry: 'India (Kerala)',
    },
    locationFamily: {
      homeDistrict: 'Malappuram',
      nativePlace: '',
      fatherName: '',
      motherName: '',
      siblings: ''
    },
    contactDetails: {
      guardianPhone: '',
      whatsappNumber: ''
    },
    contactPreferences: {
      guardianName: '',
      relation: 'Father',
      phone: '',
      whatsapp: '',
      email: currentUser?.email || '',
      alternateContact: '',
      contactMethod: 'both',
      expectations: '',
    },
    security: { editPin: '' },
  });

  const updateSection = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleGenderToggle = (selectedG) => {
    updateSection('basicInfo', 'gender', selectedG);
    const defaultQual = selectedG === 'Bride' ? 'Wafiyya' : 'Wafi';
    setFormData(prev => ({
      ...prev,
      gender: selectedG === 'Bride' ? 'female' : 'male',
      islamicQualification: [defaultQual],
      islamicBackground: {
        ...prev.islamicBackground,
        qualification: defaultQual
      }
    }));
  };

  const validateStep = (s) => {
    if (s === 1) {
      if (!formData.basicInfo.fullName.trim()) return 'Please enter name or candidate alias';
      if (!formData.basicInfo.age || formData.basicInfo.age < 18) return 'Candidate must be at least 18 years old';
    }
    if (s === 2) {
      if (!formData.locationFamily.homeDistrict) return 'Please select home district';
    }
    if (s === 3) {
      if (!formData.generalEducation.level) return 'Please select highest qualification level';
      if (!formData.generalEducation.degreeName.trim()) return 'Please enter academic degree title (e.g. B.A., M.Sc., B.Tech, MBBS)';
      if (!formData.generalEducation.subjectCategory) return 'Please select specialized subject category';
      if (!formData.educationOccupation.profession.trim()) return 'Please enter profession or current occupation';
    }
    if (s === 4) {
      const phone = formData.contactDetails.guardianPhone || formData.contactPreferences.phone;
      if (!phone || phone.replace(/[^0-9]/g, '').length < 7) {
        return 'Please enter a valid Guardian contact phone number';
      }
      if (!formData.security.editPin || formData.security.editPin.length < 4) {
        return 'Please create a 4-digit secret Edit PIN for future edits';
      }
    }
    return null;
  };

  const handleNext = () => {
    setErrorMsg('');
    const err = validateStep(step);
    if (err) {
      setErrorMsg(err);
      return;
    }
    setStep(prev => Math.min(prev + 1, 4));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const err = validateStep(4);
    if (err) {
      setErrorMsg(err);
      return;
    }

    setIsSubmitting(true);
    try {
      const pin = formData.security.editPin.trim();
      const phone = formData.contactDetails.guardianPhone.trim() || formData.contactPreferences.phone.trim();
      const whatsapp = formData.contactDetails.whatsappNumber.trim() || formData.contactPreferences.whatsapp.trim() || phone;

      const payload = {
        ...formData,
        profileCreatedBy: formData.profileCreatedBy || 'Parent',
        registeredBy: formData.profileCreatedBy || 'Parent',
        gender: formData.basicInfo.gender === 'Bride' ? 'female' : 'male',
        islamicQualification: formData.islamicQualification,
        islamicBackground: {
          ...formData.islamicBackground,
          qualification: formData.islamicQualification[0] || 'None'
        },
        generalEducation: {
          ...formData.generalEducation,
          degreeName: formData.generalEducation.degreeName.trim(),
          specialization: formData.generalEducation.specialization.trim()
        },
        educationOccupation: {
          ...formData.educationOccupation,
          education: `${formData.generalEducation.degreeName} ${formData.generalEducation.specialization ? `(${formData.generalEducation.specialization})` : ''}`.trim(),
          degree: formData.generalEducation.degreeName.trim(),
          profession: formData.educationOccupation.profession.trim()
        },
        contactDetails: {
          guardianPhone: phone,
          whatsappNumber: whatsapp
        },
        contactPreferences: {
          ...formData.contactPreferences,
          phone: phone,
          whatsapp: whatsapp,
          secretPin: pin
        },
        whatsappConsent: formData.whatsappConsent !== false,
        whatsappGroupNumber: formData.whatsappGroupNumber || whatsapp || phone,
        registeredDuringCampaign: Boolean(pricing?.campaignMode),
        paymentStatus: pricing?.campaignMode ? 'free_campaign' : (paymentRef ? 'paid' : 'pending_payment'),
        submissionFee: pricing?.campaignMode ? 0 : (pricing?.profileSubmissionFee || 499),
        paymentRef: paymentRef.trim() || null,
        paymentMethod: pricing?.campaignMode ? 'campaign_free' : paymentMethod,
        loginCredentials: {
          username: `ALTB-${Date.now().toString().slice(-4)}`,
          password: pin || `altb${Date.now().toString().slice(-4)}`
        },
        creatorUid: currentUser?.uid || null,
        creatorEmail: currentUser?.email || null,
        creatorName: currentUser?.name || null,
        security: { editPin: pin }
      };

      await onSubmitProfile(payload);
      if (setHasRegisteredProfile) {
        setHasRegisteredProfile(payload);
      }
      setSubmittedPin(pin);
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit proposal. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // State for email auth in unauthenticated modal gate
  const [unauthEmailMode, setUnauthEmailMode] = useState(false);
  const [unauthEmail, setUnauthEmail] = useState('');
  const [unauthPassword, setUnauthPassword] = useState('');
  const [unauthIsSignUp, setUnauthIsSignUp] = useState(true);
  const [unauthFullName, setUnauthFullName] = useState('');

  // Close modal on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Auth gate: User must be signed in to add profiles
  if (!currentUser) {
    return (
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-label="Sign In Required to Post Proposal"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      >
        <div onClick={onClose} className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" />
        <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 text-center z-10 shadow-2xl animate-fade-in my-auto">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto mb-3 flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-black text-white mb-1.5">Sign In or Register to Submit</h3>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            To maintain directory authenticity and protect candidate privacy, all members must sign in or register before submitting a matrimonial proposal.
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium text-left">
              {authError}
            </div>
          )}

          {!unauthEmailMode ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={async () => {
                  setAuthError('');
                  const res = await loginWithGoogle(initialGender === 'Bride' ? 'bride' : 'groom');
                  if (!res.success) {
                    setAuthError(res.error || 'Failed to sign in with Google. Please try again.');
                  }
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-lg transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => setUnauthEmailMode(true)}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                Continue with Email &amp; Password
              </button>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setAuthError('');
                const res = await loginWithEmailPassword(
                  unauthEmail,
                  unauthPassword,
                  unauthIsSignUp,
                  initialGender === 'Bride' ? 'bride' : 'groom',
                  [],
                  unauthFullName
                );
                if (!res.success) {
                  setAuthError(res.error || 'Authentication failed. Please check credentials.');
                }
              }}
              className="space-y-3 text-left"
            >
              {unauthIsSignUp && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={unauthFullName}
                    onChange={(e) => setUnauthFullName(e.target.value)}
                    placeholder="Candidate or Guardian Name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={unauthEmail}
                  onChange={(e) => setUnauthEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={unauthPassword}
                  onChange={(e) => setUnauthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {unauthIsSignUp ? 'Register & Continue' : 'Sign In & Continue'}
              </button>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setUnauthIsSignUp(!unauthIsSignUp)}
                  className="text-emerald-400 hover:underline cursor-pointer"
                >
                  {unauthIsSignUp ? 'Already registered? Sign In' : 'Need an account? Sign Up'}
                </button>
                <button
                  type="button"
                  onClick={() => setUnauthEmailMode(false)}
                  className="text-slate-400 hover:underline cursor-pointer"
                >
                  Back to Google
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    );
  }

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="add-proposal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-4 flex flex-col max-h-[92vh] animate-fade-in">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Create New Proposal</h2>
                <p className="text-xs text-slate-400">Islamic &amp; Academic Matrimony Listing</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Wizard Indicator */}
          {!success && (
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <div className="grid grid-cols-4 gap-2 text-center">
                {STEPS.map((s) => {
                  const Icon = s.icon;
                  const active = step === s.num;
                  const done = step > s.num;
                  return (
                    <div
                      key={s.num}
                      className={`flex flex-col items-center gap-1 cursor-pointer ${
                        active ? 'text-emerald-400 font-bold' : done ? 'text-emerald-500/80' : 'text-slate-500'
                      }`}
                      onClick={() => s.num < step && setStep(s.num)}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                        active
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30'
                          : done
                          ? 'bg-emerald-950/60 border-emerald-600 text-emerald-400'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}>
                        {done ? <CheckCircle className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-[10px] truncate max-w-full">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-4">

            {success ? (
              <div className="py-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Proposal Successfully Listed!</h3>
                  <p className="text-xs text-slate-400 mt-1">Your profile is now live in the directory.</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 space-y-2 text-left">
                  <div className="flex items-center gap-2 font-bold text-amber-300 text-sm justify-center">
                    <Key className="w-4 h-4" />
                    <span>Secret Edit PIN: <span className="font-mono text-base text-white underline">{submittedPin}</span></span>
                  </div>
                  <p className="leading-relaxed text-center">
                    Please remember this PIN! You will need it whenever you want to update or remove this proposal.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Return to Directory
                </button>
              </div>
            ) : (
              <>
                {/* Campaign Mode Free Notice Banner */}
                {pricing?.campaignMode && (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2.5">
                    <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0 font-bold">
                      FREE (₹0)
                    </span>
                    <span className="leading-snug">
                      <strong>Launch Campaign Active:</strong> Proposal registration is 100% free! You will not be prompted for payment and will receive <strong>{pricing.campaignRewardCredits || 3} complimentary contact views</strong> when the directory opens.
                    </span>
                  </div>
                )}

                {/* ── STEP 1: BASIC INFO ── */}
                {step === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    {/* PROFILE CREATED BY: PARENT OR SELF */}
                    <div>
                      <label className={labelCls}>Profile Registered By / Created By *</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              profileCreatedBy: 'Parent',
                              contactPreferences: {
                                ...prev.contactPreferences,
                                relation: prev.contactPreferences.relation === 'Self' ? 'Father' : prev.contactPreferences.relation
                              }
                            }));
                          }}
                          className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                            formData.profileCreatedBy === 'Parent'
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400'
                              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <Users className="w-4 h-4" />
                          <span>Parent / Guardian</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              profileCreatedBy: 'Self',
                              contactPreferences: {
                                ...prev.contactPreferences,
                                relation: 'Self'
                              }
                            }));
                          }}
                          className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                            formData.profileCreatedBy === 'Self'
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400'
                              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <User className="w-4 h-4" />
                          <span>Self (Candidate)</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        {formData.profileCreatedBy === 'Parent'
                          ? 'Registration on behalf of son or daughter with family / guardian oversight.'
                          : 'Direct registration by the candidate (Brother or Sister).'}
                      </p>
                    </div>

                    <div>
                      <label className={labelCls}>Candidate Name / Identifier *</label>
                      <input
                        type="text"
                        required
                        value={formData.basicInfo.fullName}
                        onChange={e => updateSection('basicInfo', 'fullName', e.target.value)}
                        placeholder="e.g. Fathima / Anas (Private or Public Name)"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Gender Proposal *</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Bride', 'Groom'].map(g => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleGenderToggle(g)}
                            className={`py-3 rounded-xl font-bold text-sm transition-all border ${
                              formData.basicInfo.gender === g
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                                : 'bg-slate-950 text-slate-300 border-slate-800'
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

                    <div className="grid grid-cols-2 gap-3">
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
                          Height (cm/ft auto-convert)
                        </label>
                        <input
                          type="text"
                          value={formData.basicInfo.height}
                          onChange={e => handleHeightChange(e.target.value, v => updateSection('basicInfo', 'height', v))}
                          placeholder="e.g. 165 cm  or  5 ft 5 in"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Complexion</label>
                        <select
                          value={formData.basicInfo.color || ''}
                          onChange={e => updateSection('basicInfo', 'color', e.target.value)}
                          className={inputCls}
                        >
                          <option value="">Select (Optional)</option>
                          {COMPLEXIONS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Mother Tongue</label>
                        <input
                          type="text"
                          value={formData.basicInfo.motherTongue}
                          onChange={e => updateSection('basicInfo', 'motherTongue', e.target.value)}
                          placeholder="Malayalam"
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: RELIGIOUS & LOCATION BACKGROUND ── */}
                {step === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-3">
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
                        <label className={labelCls}>Community / Lineage</label>
                        <select
                          value={formData.islamicBackground.subGroup}
                          onChange={e => updateSection('islamicBackground', 'subGroup', e.target.value)}
                          className={inputCls}
                        >
                          {COMMUNITY_GROUPS.map(cg => <option key={cg} value={cg}>{cg}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Home District (Kerala) *</label>
                        <select
                          value={formData.locationFamily.homeDistrict}
                          onChange={e => updateSection('locationFamily', 'homeDistrict', e.target.value)}
                          className={inputCls}
                        >
                          {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Native City / Town</label>
                        <input
                          type="text"
                          value={formData.locationFamily.nativePlace}
                          onChange={e => updateSection('locationFamily', 'nativePlace', e.target.value)}
                          placeholder="e.g. Manjeri, Feroke, Vadakara"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Family Details (Parents, Siblings)</label>
                      <input
                        type="text"
                        value={formData.locationFamily.fatherName}
                        onChange={e => updateSection('locationFamily', 'fatherName', e.target.value)}
                        placeholder="Father's name & occupation (e.g. K. Abdul Kareem, Business)"
                        className={inputCls}
                      />
                    </div>
                  </div>
                )}

                {/* ── STEP 3: EDUCATION & OCCUPATION (UPDATED WITH 2 SUB-SECTIONS) ── */}
                {step === 3 && (
                  <div className="space-y-5 animate-fade-in">
                    
                    {/* SUB-SECTION 1: ISLAMIC EDUCATION (OPTIONAL / CONDITIONAL) */}
                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
                      <div className="flex items-center gap-2 pb-1 border-b border-emerald-900/30">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                          1. Islamic Education (Optional / Conditional)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Islamic Degree / Scholar Title</label>
                          <select
                            value={formData.islamicQualification[0] || 'None'}
                            onChange={e => {
                              const val = e.target.value;
                              setFormData(prev => ({
                                ...prev,
                                islamicQualification: [val],
                                islamicBackground: {
                                  ...prev.islamicBackground,
                                  qualification: val
                                }
                              }));
                            }}
                            className={inputCls}
                          >
                            {ISLAMIC_QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className={labelCls}>Islamic Institution / College</label>
                          <input
                            type="text"
                            value={formData.islamicBackground.institution || ''}
                            onChange={e => updateSection('islamicBackground', 'institution', e.target.value)}
                            placeholder="e.g. CIC, Darul Huda, Jamia Nooriya"
                            className={inputCls}
                          />
                        </div>
                      </div>
                    </div>

                    {/* SUB-SECTION 2: GENERAL ACADEMIC EDUCATION (MANDATORY) */}
                    <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-900/40 space-y-3">
                      <div className="flex items-center gap-2 pb-1 border-b border-sky-900/30">
                        <GraduationCap className="w-4 h-4 text-sky-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                          2. General Academic Education (Mandatory)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Highest Qualification Level *</label>
                          <select
                            required
                            value={formData.generalEducation.level}
                            onChange={e => updateSection('generalEducation', 'level', e.target.value)}
                            className={inputCls}
                          >
                            {EDUCATION_LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className={labelCls}>Degree Title *</label>
                          <input
                            type="text"
                            required
                            value={formData.generalEducation.degreeName}
                            onChange={e => updateSection('generalEducation', 'degreeName', e.target.value)}
                            placeholder="e.g. B.A., M.Sc., Ph.D., B.Tech, MBBS"
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Specialized Subject Category *</label>
                          <select
                            required
                            value={formData.generalEducation.subjectCategory}
                            onChange={e => updateSection('generalEducation', 'subjectCategory', e.target.value)}
                            className={inputCls}
                          >
                            {SUBJECT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className={labelCls}>Specific Subject / Field of Study</label>
                          <input
                            type="text"
                            value={formData.generalEducation.specialization}
                            onChange={e => updateSection('generalEducation', 'specialization', e.target.value)}
                            placeholder="e.g. Economics, Computer Science, Chemistry"
                            className={inputCls}
                          />
                        </div>
                      </div>
                    </div>

                    {/* OCCUPATION & EMPLOYMENT */}
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
                        <Briefcase className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                          Profession &amp; Employment Details
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Profession / Job Role *</label>
                          <input
                            type="text"
                            required
                            list="prof-options"
                            value={formData.educationOccupation.profession}
                            onChange={e => updateSection('educationOccupation', 'profession', e.target.value)}
                            placeholder="e.g. Software Engineer, Assistant Professor"
                            className={inputCls}
                          />
                          <datalist id="prof-options">
                            {COMMON_PROFESSIONS.map(p => <option key={p} value={p} />)}
                          </datalist>
                        </div>

                        <div>
                          <label className={labelCls}>Work Location / Country</label>
                          <select
                            value={formData.educationOccupation.workCountry}
                            onChange={e => updateSection('educationOccupation', 'workCountry', e.target.value)}
                            className={inputCls}
                          >
                            {WORK_LOCATIONS.map(w => <option key={w} value={w}>{w}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* ── STEP 4: CONTACT & SECRET PIN ── */}
                {step === 4 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5">
                      <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        Guardian contact numbers are protected with pay-per-view access and masked by default to prevent spam.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>
                          {formData.profileCreatedBy === 'Self' ? 'Contact Phone Call Number (Self) *' : 'Guardian Phone Call Number *'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.contactDetails.guardianPhone}
                          onChange={e => {
                            const val = e.target.value;
                            updateSection('contactDetails', 'guardianPhone', val);
                            updateSection('contactPreferences', 'phone', val);
                          }}
                          placeholder="+91 9847123456"
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label className={labelCls}>
                          {formData.profileCreatedBy === 'Self' ? 'WhatsApp Number (Self)' : 'Guardian WhatsApp Number'}
                        </label>
                        <input
                          type="tel"
                          value={formData.contactDetails.whatsappNumber}
                          onChange={e => {
                            const val = e.target.value;
                            updateSection('contactDetails', 'whatsappNumber', val);
                            updateSection('contactPreferences', 'whatsapp', val);
                          }}
                          placeholder="+91 9847123456 (Leave blank if same)"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>
                        {formData.profileCreatedBy === 'Self' ? 'Guardian / Family Reference Name & Relation' : 'Guardian Relation / Name'}
                      </label>
                      <input
                        type="text"
                        value={formData.contactPreferences.guardianName}
                        onChange={e => updateSection('contactPreferences', 'guardianName', e.target.value)}
                        placeholder={formData.profileCreatedBy === 'Self' ? "e.g. Father Abdul Latheef / Brother" : "e.g. Father, Uncle, Mother"}
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Partner Expectations &amp; Preferences</label>
                      <textarea
                        rows="2"
                        value={formData.contactPreferences.expectations}
                        onChange={e => updateSection('contactPreferences', 'expectations', e.target.value)}
                        placeholder="e.g. Seeking educated, religious partner (Wafiyya / Doctor / Engineer)..."
                        className={inputCls}
                      ></textarea>
                    </div>

                    {/* WHATSAPP GROUP NOTIFICATION CONSENT */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-teal-950/30 border border-emerald-500/40 space-y-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="whatsappConsent"
                          checked={formData.whatsappConsent}
                          onChange={e => setFormData(prev => ({ ...prev, whatsappConsent: e.target.checked }))}
                          className="w-5 h-5 mt-0.5 rounded-lg text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer"
                        />
                        <label htmlFor="whatsappConsent" className="text-xs text-slate-200 cursor-pointer">
                          <span className="font-bold text-emerald-400 block mb-0.5">
                            Join Official Matrimonial WhatsApp Group
                          </span>
                          Yes, I give consent to add my number to the Al-ThayyiBoon WhatsApp group to receive newly updated verified candidate profiles directly.
                        </label>
                      </div>

                      {formData.whatsappConsent && (
                        <div className="pt-2 border-t border-slate-800">
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            WhatsApp Number for Group Alerts
                          </label>
                          <input
                            type="tel"
                            value={formData.whatsappGroupNumber}
                            onChange={e => setFormData(prev => ({ ...prev, whatsappGroupNumber: e.target.value }))}
                            placeholder={formData.contactDetails.whatsappNumber || formData.contactDetails.guardianPhone || "+91 9847123456"}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-emerald-500 text-xs"
                          />
                          <p className="text-[10px] text-slate-400 mt-1">
                            Leave blank to automatically use the Guardian phone/WhatsApp number above.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* SECRET 4-DIGIT PIN */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-emerald-400" />
                        <label className="text-xs font-bold text-white uppercase tracking-wider">
                          Create Secret 4-Digit Edit PIN *
                        </label>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Enter 4 digits. You will use this PIN to edit or delete this proposal in future.
                      </p>
                      <input
                        type="password"
                        maxLength="6"
                        required
                        value={formData.security.editPin}
                        onChange={e => updateSection('security', 'editPin', e.target.value)}
                        placeholder="e.g. 7842"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono font-bold tracking-widest text-center text-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* LISTING FEE & CAMPAIGN STATUS */}
                    {pricing?.campaignMode ? (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-teal-950/30 border border-emerald-500/40 space-y-2">
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            Campaign Listing Benefit
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase ml-auto border border-emerald-500/40">
                            100% Free (₹0)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          During this active candidate drive, registration and directory listing are completely <strong>FREE (₹0)</strong>. No payment required. You will also receive 3 complimentary contact views when the directory opens!
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                            <div>
                              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                                Proposal Listing &amp; Verification Fee
                              </span>
                              <span className="text-[11px] text-slate-400">
                                One-time directory verification &amp; listing charge
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-lg font-black text-amber-300">
                              ₹{pricing?.profileSubmissionFee || 499}
                            </span>
                          </div>
                        </div>

                        {/* UPI Payment Instructions */}
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-200">
                              Direct UPI Payment (GPay / PhonePe / Paytm)
                            </span>
                            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                              0% Platform Fee
                            </span>
                          </div>

                          <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-700/80">
                            <span className="text-xs font-mono text-emerald-300 font-bold flex-1 truncate">
                              {pricing?.upiId || 'althayyiboon@upi'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (navigator.clipboard) {
                                  navigator.clipboard.writeText(pricing?.upiId || 'althayyiboon@upi');
                                  setCopiedUpi(true);
                                  setTimeout(() => setCopiedUpi(false), 2000);
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              <span>{copiedUpi ? 'Copied!' : 'Copy UPI'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowUpiQr(prev => !prev)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <QrCode className="w-3 h-3" />
                              <span>{showUpiQr ? 'Hide QR' : 'Show QR'}</span>
                            </button>
                          </div>

                          {showUpiQr && (
                            <div className="p-3 bg-white rounded-xl flex flex-col items-center justify-center text-center animate-fade-in">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                                  `upi://pay?pa=${pricing?.upiId || 'althayyiboon@upi'}&pn=AlThayyiBoon&am=${pricing?.profileSubmissionFee || 499}&cu=INR`
                                )}`}
                                alt="UPI QR Code"
                                className="w-36 h-36 rounded-lg"
                              />
                              <p className="text-[10px] text-slate-900 font-bold mt-1">
                                Scan with GPay / PhonePe / Paytm to Pay ₹{pricing?.profileSubmissionFee || 499}
                              </p>
                            </div>
                          )}

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                              UPI Transaction ID / UTR Number
                            </label>
                            <input
                              type="text"
                              value={paymentRef}
                              onChange={e => setPaymentRef(e.target.value)}
                              placeholder="e.g. 4289XXXXXXXX (12-digit UTR)"
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-amber-500 text-xs font-mono"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">
                              Enter the 12-digit transaction reference number from your payment app after completing payment.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

          </div>

          {/* Bottom Navigation Controls */}
          {!success && (
            <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(prev => prev - 1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all ml-auto"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all ml-auto disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Proposal...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Proposal</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

        </form>

      </div>
    </div>
  );
}
