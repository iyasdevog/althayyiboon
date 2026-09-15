import React, { useState } from 'react';
import { X, Plus, Filter, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

export default function RequestFilterModal({ onClose, onSubmitFilterRequest }) {
  const [category, setCategory] = useState("Islamic Qualification");
  const [filterName, setFilterName] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!filterName.trim()) {
      setErrorMsg("Please enter the custom filter name (e.g. Thanwi, Specialized Course, etc.).");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitFilterRequest({
        category,
        filterName: filterName.trim(),
        reason: reason.trim()
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
      ></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 animate-fade-in">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Request Custom Filter</h2>
              <p className="text-xs text-slate-400">Suggest new tags or qualifications</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Filter Request Submitted!</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Your request for "<span className="text-emerald-300 font-semibold">{filterName}</span>" has been submitted to the Admin Approval Queue.
              </p>
            </div>
          ) : (
            <>
              {/* Notice Box */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  Filter requests are reviewed by an Admin before going live across the site. Once approved, everyone can filter proposals by your requested tag.
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Filter Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Islamic Qualification">Islamic Qualification / Scholar Title</option>
                  <option value="District / Region">District / Region / City</option>
                  <option value="Community Group">Community / Sub-group</option>
                  <option value="General Education">General Education / Profession</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Requested Filter Name *</label>
                <input
                  type="text"
                  required
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="e.g. Thanwi, Custom Title, Middle East Region"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Brief Description / Reason (Optional)</label>
                <textarea
                  rows="2"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Scholars from Thanwi institute needing specific proposal search."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
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
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting..." : "Submit Request"}</span>
                </button>
              </div>
            </>
          )}

        </form>

      </div>
    </div>
  );
}
