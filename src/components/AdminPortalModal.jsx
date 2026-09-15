import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Download, 
  Search, 
  Filter, 
  Sparkles,
  Users,
  AlertCircle
} from 'lucide-react';

export default function AdminPortalModal({ 
  onClose, 
  profiles, 
  onDeleteProfile, 
  onUpdateProfile, 
  onSelectEditProfile,
  filterRequests,
  onApproveFilterRequest,
  onRejectFilterRequest
}) {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState("proposals"); // "proposals" | "filterRequests" | "export"

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Admin Passcode Authentication (Master Password: admin2014)
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError("");
    if (passcode.trim() === "admin2014") {
      setIsAuthenticated(true);
    } else {
      setAuthError("Invalid Admin Passcode. Please re-enter passcode.");
    }
  };

  // CSV Export Generator
  const handleExportCSV = () => {
    if (profiles.length === 0) {
      alert("No profiles to export.");
      return;
    }
    const headers = ["ID", "Name", "Gender", "Age", "Color/Complexion", "District", "Qualification", "Profession", "Work Country", "Special Demands", "WhatsApp", "Phone", "Alternate Contact", "Created At"];
    const rows = profiles.map(p => [
      p.id,
      `"${p.basicInfo?.fullName || ''}"`,
      p.basicInfo?.gender || '',
      p.basicInfo?.age || '',
      `"${p.basicInfo?.color || ''}"`,
      `"${p.locationFamily?.homeDistrict || ''}"`,
      `"${p.islamicBackground?.qualification || ''}"`,
      `"${p.educationOccupation?.profession || ''}"`,
      `"${p.educationOccupation?.workCountry || ''}"`,
      `"${(p.contactPreferences?.expectations || '').replace(/"/g, '""')}"`,
      `"${p.contactPreferences?.whatsapp || ''}"`,
      `"${p.contactPreferences?.phone || ''}"`,
      `"${p.contactPreferences?.alternateContact || ''}"`,
      p.createdAt || ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AlThayyiBoon_Proposals_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered proposal list for admin
  const adminProfiles = profiles.filter(p => {
    if (statusFilter !== "all" && (p.status || "approved") !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const text = `${p.id} ${p.basicInfo?.fullName} ${p.locationFamily?.homeDistrict} ${p.islamicBackground?.qualification} ${p.educationOccupation?.profession}`.toLowerCase();
      return text.includes(q);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
      ></div>

      {/* Modal Card Container */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 animate-fade-in">
        
        {/* Modal Top Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Admin Management Portal</h2>
              <p className="text-xs text-slate-400">Content Moderation & Filter Approvals</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AUTHENTICATION SCREEN */}
        {!isAuthenticated ? (
          <form onSubmit={handleAuthSubmit} className="p-10 space-y-6 max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Admin Passcode Required</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter master admin password to access moderation controls.
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Master Passcode"
                className="w-full text-center tracking-widest text-lg font-bold py-3 px-4 rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20"
            >
              Authenticate Admin
            </button>
          </form>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div>
            {/* Tab Navigation */}
            <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400 overflow-x-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("proposals")}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    activeTab === "proposals"
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Proposals ({profiles.length})
                </button>

                <button
                  onClick={() => setActiveTab("filterRequests")}
                  className={`px-4 py-2 rounded-xl transition-all relative ${
                    activeTab === "filterRequests"
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Filter Requests
                  {filterRequests.filter(r => r.status === "pending").length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold">
                      {filterRequests.filter(r => r.status === "pending").length}
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* TAB 1: PROPOSALS MODERATION */}
            {activeTab === "proposals" && (
              <div className="p-6 space-y-4 max-h-[calc(85vh-12rem)] overflow-y-auto custom-scrollbar">
                
                {/* Search & Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search proposals by Name, District, Qualification..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 text-white text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>

                {/* Proposals Table / List */}
                <div className="space-y-3">
                  {adminProfiles.length > 0 ? (
                    adminProfiles.map(profile => (
                      <div 
                        key={profile.id}
                        className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800/80 hover:border-slate-700"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">
                              {profile.basicInfo?.fullName || 'Candidate'}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              profile.basicInfo?.gender === "Bride"
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}>
                              {profile.basicInfo?.gender} ({profile.basicInfo?.age} Yrs)
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">#{profile.id.slice(-5)}</span>
                          </div>

                          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                            <span className="text-amber-300 font-semibold">{profile.islamicBackground?.qualification || 'No Title'}</span>
                            <span>•</span>
                            <span>{profile.educationOccupation?.profession || 'Profession N/A'}</span>
                            <span>•</span>
                            <span>{profile.locationFamily?.homeDistrict || 'District N/A'}</span>
                            <span>•</span>
                            <span className="text-slate-300 font-mono">
                              {[profile.contactPreferences?.whatsapp && `WA: ${profile.contactPreferences.whatsapp}`, profile.contactPreferences?.phone && `Tel: ${profile.contactPreferences.phone}`, profile.contactPreferences?.alternateContact && `Alt: ${profile.contactPreferences.alternateContact}`].filter(Boolean).join(" | ") || 'No Contact'}
                            </span>
                          </div>
                        </div>

                        {/* Admin Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectEditProfile(profile)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1"
                            title="Edit Proposal Details"
                          >
                            <Edit className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove unwanted proposal #${profile.id}?`)) {
                                onDeleteProfile(profile.id);
                              }
                            }}
                            className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1"
                            title="Remove Unwanted Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      No proposals match current search criteria.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: FILTER REQUESTS APPROVAL HUB */}
            {activeTab === "filterRequests" && (
              <div className="p-6 space-y-4 max-h-[calc(85vh-12rem)] overflow-y-auto custom-scrollbar">
                
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm mb-0.5">Filter Request Approval Hub</h4>
                    <p className="text-slate-300">
                      Community members click <span className="font-semibold text-emerald-300">+ Add Custom Filter</span> to suggest new tags. Approving a request instantly adds it to the public Filter Sidebar for everyone!
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {filterRequests.length > 0 ? (
                    filterRequests.map((req) => (
                      <div 
                        key={req.id}
                        className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{req.filterName}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {req.category}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              req.status === "approved" ? 'bg-emerald-500/20 text-emerald-300' :
                              req.status === "rejected" ? 'bg-rose-500/20 text-rose-300' :
                              'bg-amber-500/20 text-amber-300'
                            }`}>
                              {req.status || 'pending'}
                            </span>
                          </div>
                          {req.reason && <p className="text-xs text-slate-400 italic">"{req.reason}"</p>}
                        </div>

                        {req.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onApproveFilterRequest(req)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              onClick={() => onRejectFilterRequest(req.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs border border-rose-500/30"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      No custom filter requests pending.
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
