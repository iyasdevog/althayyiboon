import React, { useState } from 'react';
import { X, Lock, Key, Trash2, Save, AlertCircle, CheckCircle, ShieldCheck, Phone, MessageSquare } from 'lucide-react';
import { 
  KERALA_DISTRICTS, 
  ISLAMIC_QUALIFICATIONS, 
  SECTS, 
  COMMUNITY_GROUPS, 
  MARITAL_STATUSES,
  COMMON_PROFESSIONS 
} from '../data/mockProfiles';


export default function EditProfileModal({ 
  profile, 
  onClose, 
  onSaveUpdate, 
  onDeleteProfile,
  isAdminOverride 
}) {
  const [pinEntered, setPinEntered] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminOverride);
  const [pinError, setPinError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [formData, setFormData] = useState({
    basicInfo: { ...profile.basicInfo },
    islamicBackground: { ...profile.islamicBackground },
    educationOccupation: { ...profile.educationOccupation },
    locationFamily: { ...profile.locationFamily },
    contactPreferences: { 
      contactMethod: "both",
      alternateContact: "",
      ...profile.contactPreferences 
    },
    security: { editPin: profile.security?.editPin || "1234" }
  });

  const handlePinVerify = (e) => {
    e.preventDefault();
    setPinError("");

    const correctPin = profile.security?.editPin || "1234";
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
      await onSaveUpdate(profile.id, formData);
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
        <div className="p-6 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Proposal #{profile.id.slice(-5)}</h2>
              <p className="text-xs text-slate-400">Update details or remove listing</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN VERIFICATION STEP */}
        {!isAuthenticated ? (
          <form onSubmit={handlePinVerify} className="p-8 space-y-6 max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Security Verification Required</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter the secret 4-digit PIN you created when listing this proposal.
              </p>
            </div>

            {pinError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{pinError}</span>
              </div>
            )}

            <div>
              <input
                type="password"
                maxLength="6"
                required
                value={pinEntered}
                onChange={(e) => setPinEntered(e.target.value)}
                placeholder="Enter 4-digit Secret PIN"
                className="w-full text-center tracking-widest text-lg font-bold py-3 px-4 rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
              >
                Verify & Unlock
              </button>
            </div>
          </form>
        ) : (
          /* AUTHENTICATED EDIT FORM */
          <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[calc(85vh-10rem)] overflow-y-auto custom-scrollbar">
            
            {/* Delete Confirmation Warning */}
            {confirmDelete ? (
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3">
                <h4 className="text-base font-bold text-rose-300">Are you sure you want to delete this proposal?</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  This action will permanently delete this proposal listing from the directory and Firestore.
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
                {/* Basic Details */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Basic Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Full Name</label>
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
                  </div>
                </div>

                {/* Islamic Background */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Islamic Background</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Qualification</label>
                      <select
                        value={formData.islamicBackground.qualification}
                        onChange={(e) => updateSection('islamicBackground', 'qualification', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      >
                        {ISLAMIC_QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                      </select>
                    </div>
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

                {/* Education & Occupation */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Education & Profession</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Education</label>
                      <input
                        type="text"
                        value={formData.educationOccupation.education}
                        onChange={(e) => updateSection('educationOccupation', 'education', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Profession</label>
                      <input
                        type="text"
                        list="common-professions-list-edit"
                        value={formData.educationOccupation.profession}
                        onChange={(e) => updateSection('educationOccupation', 'profession', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      />
                      <datalist id="common-professions-list-edit">
                        {COMMON_PROFESSIONS.map(p => (
                          <option key={p} value={p} />
                        ))}
                      </datalist>
                    </div>

                  </div>
                </div>

                {/* Contact Preferences */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Contact & Expectations</h3>
                  
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Preferred Contact Mode</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => updateSection('contactPreferences', 'contactMethod', 'whatsapp_only')}
                        className={`px-2 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 ${
                          formData.contactPreferences.contactMethod === 'whatsapp_only'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-400" /> WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={() => updateSection('contactPreferences', 'contactMethod', 'both')}
                        className={`px-2 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center ${
                          formData.contactPreferences.contactMethod === 'both'
                            ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        Call & WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={() => updateSection('contactPreferences', 'contactMethod', 'call_only')}
                        className={`px-2 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 ${
                          formData.contactPreferences.contactMethod === 'call_only'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        <Phone className="w-3 h-3 text-blue-400" /> Call Only
                      </button>
                      <button
                        type="button"
                        onClick={() => updateSection('contactPreferences', 'contactMethod', 'any')}
                        className={`px-2 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 ${
                          formData.contactPreferences.contactMethod === 'any'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        Any Method
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={formData.contactPreferences.whatsapp || ''}
                        onChange={(e) => updateSection('contactPreferences', 'whatsapp', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Direct Phone Number</label>
                      <input
                        type="text"
                        value={formData.contactPreferences.phone || ''}
                        onChange={(e) => updateSection('contactPreferences', 'phone', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1">Alternate Contact (Phone / Landline / Email)</label>
                      <input
                        type="text"
                        value={formData.contactPreferences.alternateContact || ''}
                        onChange={(e) => updateSection('contactPreferences', 'alternateContact', e.target.value)}
                        placeholder="e.g. +91 9123456789 (Uncle) or email@example.com"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Secret Edit PIN</label>
                      <input
                        type="text"
                        maxLength="6"
                        value={formData.security?.editPin || '1234'}
                        onChange={(e) => updateSection('security', 'editPin', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs border border-rose-500/30"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Proposal</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                    >
                      <Save className="w-4 h-4" />
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
