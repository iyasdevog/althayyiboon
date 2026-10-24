import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Trash2, 
  Edit, 
  CheckCircle, 
  Plus, 
  Download, 
  Search, 
  Sparkles,
  Users,
  FileCheck,
  Coins,
  GraduationCap,
  ToggleLeft,
  ToggleRight,
  Save,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SUBJECT_CATEGORIES } from '../data/mockProfiles';

export default function AdminPortalModal({ 
  onClose, 
  profiles = [], 
  onDeleteProfile, 
  onUpdateProfile, 
  onSelectEditProfile,
  filterRequests = [],
  onApproveFilterRequest,
  onRejectFilterRequest,
  onBulkDelete,
  onBulkUpdateStatus
}) {
  const { 
    pricing, 
    updatePricingConfig, 
    customTaxonomies, 
    addCustomTaxonomy,
    isAdmin 
  } = useAuth();

  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(isAdmin);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState("proposals"); // "proposals" | "pricing" | "taxonomies" | "filterRequests"

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState([]);

  // Local Pricing Form State
  const [localPricing, setLocalPricing] = useState({
    contactUnlockFee: pricing.contactUnlockFee || 15,
    profileSubmissionFee: pricing.profileSubmissionFee || 0,
    campaignMode: pricing.campaignMode !== undefined ? pricing.campaignMode : true
  });
  const [pricingSavedToast, setPricingSavedToast] = useState(false);

  // Custom Taxonomy inputs
  const [newSubjectCategory, setNewSubjectCategory] = useState("");
  const [newDegreeName, setNewDegreeName] = useState("");
  const [taxonomyToast, setTaxonomyToast] = useState("");

  // Admin Passcode Authentication (Master Password: admin2014)
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError("");
    if (passcode.trim() === "admin2014") {
      setIsAuthenticated(true);
    } else {
      setAuthError("Invalid Admin Passcode. Please enter passcode: admin2014");
    }
  };

  const handleSavePricing = (e) => {
    e.preventDefault();
    updatePricingConfig(localPricing);
    setPricingSavedToast(true);
    setTimeout(() => setPricingSavedToast(false), 2500);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newSubjectCategory.trim()) return;
    addCustomTaxonomy('subjectCategories', newSubjectCategory.trim());
    setTaxonomyToast(`Added "${newSubjectCategory.trim()}" to Subject Categories!`);
    setNewSubjectCategory("");
    setTimeout(() => setTaxonomyToast(""), 2500);
  };

  const handleAddDegree = (e) => {
    e.preventDefault();
    if (!newDegreeName.trim()) return;
    addCustomTaxonomy('degreeNames', newDegreeName.trim());
    setTaxonomyToast(`Added "${newDegreeName.trim()}" to Degree Titles!`);
    setNewDegreeName("");
    setTimeout(() => setTaxonomyToast(""), 2500);
  };

  // CSV Export Generator
  const handleExportCSV = () => {
    if (profiles.length === 0) {
      alert("No profiles to export.");
      return;
    }
    const headers = [
      "ID", "Status", "Gender", "Name", "Age", "District", 
      "Islamic Qualification", "Academic Level", "Degree", "Subject Category", 
      "Specialization", "Profession", "Work Country", "Guardian Phone", "WhatsApp", "Created At"
    ];

    const rows = profiles.map(p => {
      const basic = p.basicInfo || {};
      const genEdu = p.generalEducation || {};
      const edu = p.educationOccupation || {};
      const loc = p.locationFamily || {};
      const contacts = p.contactDetails || p.contactPreferences || {};

      const islamicList = Array.isArray(p.islamicQualification)
        ? p.islamicQualification.join(";")
        : (p.islamicBackground?.qualification || "");

      return [
        p.id,
        p.status || 'approved',
        `"${basic.gender || p.gender || ''}"`,
        `"${basic.fullName || ''}"`,
        basic.age || '',
        `"${loc.homeDistrict || ''}"`,
        `"${islamicList}"`,
        `"${genEdu.level || ''}"`,
        `"${genEdu.degreeName || edu.education || ''}"`,
        `"${genEdu.subjectCategory || ''}"`,
        `"${genEdu.specialization || ''}"`,
        `"${edu.profession || ''}"`,
        `"${edu.workCountry || ''}"`,
        `"${contacts.guardianPhone || contacts.phone || ''}"`,
        `"${contacts.whatsappNumber || contacts.whatsapp || ''}"`,
        p.createdAt || ''
      ];
    });

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
    const currentStatus = p.status || "approved";
    if (statusFilter !== "all" && currentStatus !== statusFilter) return false;
    if (genderFilter !== "all" && (p.basicInfo?.gender || "").toLowerCase() !== genderFilter.toLowerCase()) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const text = `${p.id} ${p.basicInfo?.fullName} ${p.locationFamily?.homeDistrict} ${p.islamicBackground?.qualification} ${p.generalEducation?.degreeName} ${p.generalEducation?.subjectCategory} ${p.educationOccupation?.profession}`.toLowerCase();
      return text.includes(q);
    }
    return true;
  });

  // KPI Overview Calculations
  const totalCount = profiles.length;
  const hiddenCount = profiles.filter(p => p.status === "hidden").length;
  const brideCount = profiles.filter(p => p.basicInfo?.gender === "Bride" || p.gender === "female").length;
  const groomCount = profiles.filter(p => p.basicInfo?.gender === "Groom" || p.gender === "male").length;
  const pendingFilterReqs = filterRequests.filter(r => r.status === "pending").length;

  // Selection Logic
  const handleToggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === adminProfiles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(adminProfiles.map(p => p.id));
    }
  };

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return;
    if (onBulkUpdateStatus) {
      onBulkUpdateStatus(selectedIds, "approved");
    } else {
      selectedIds.forEach(id => onUpdateProfile(id, { status: "approved" }));
    }
    setSelectedIds([]);
  };

  const handleBulkHide = () => {
    if (selectedIds.length === 0) return;
    if (onBulkUpdateStatus) {
      onBulkUpdateStatus(selectedIds, "hidden");
    } else {
      selectedIds.forEach(id => onUpdateProfile(id, { status: "hidden" }));
    }
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Are you sure you want to permanently delete ${selectedIds.length} selected proposal(s)?`)) {
      if (onBulkDelete) {
        onBulkDelete(selectedIds);
      } else {
        selectedIds.forEach(id => onDeleteProfile(id));
      }
      setSelectedIds([]);
    }
  };

  // Master Campaign Toggle
  const toggleCampaignMode = () => {
    const updated = !localPricing.campaignMode;
    const newConfig = {
      ...localPricing,
      campaignMode: updated,
      profileSubmissionFee: updated ? 0 : 15
    };
    setLocalPricing(newConfig);
    updatePricingConfig(newConfig);
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
      aria-label="Admin Management Console"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
      ></div>

      {/* Modal Card Container */}
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-4 flex flex-col max-h-[94vh] animate-fade-in">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Al-ThayyiBoon Admin Console</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Master Control
                </span>
              </div>
              <p className="text-xs text-slate-400">Moderation, Pricing Controls &amp; Taxonomy Management</p>
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
          <form onSubmit={handleAuthSubmit} className="p-8 sm:p-12 space-y-5 max-w-md mx-auto text-center my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Admin Master Passcode Required</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter master passcode to configure pricing, taxonomies, and manage proposals.
              </p>
            </div>
            <input 
              type="password"
              placeholder="Passcode (Default: admin2014)"
              autoFocus
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full text-center py-3 rounded-2xl bg-slate-950 text-emerald-400 font-mono font-bold tracking-widest text-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
            />
            {authError && <p className="text-rose-400 text-xs font-semibold">{authError}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
            >
              Authenticate &amp; Enter
            </button>
          </form>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            
            {/* Top Navigation Tabs */}
            <div className="px-4 sm:px-6 pt-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setActiveTab("proposals")}
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === "proposals"
                      ? "border-emerald-500 text-emerald-300 bg-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Proposals Directory ({totalCount})</span>
                </button>

                <button
                  onClick={() => setActiveTab("pricing")}
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === "pricing"
                      ? "border-emerald-500 text-emerald-300 bg-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Pricing &amp; Campaign Controls</span>
                </button>

                <button
                  onClick={() => setActiveTab("taxonomies")}
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === "taxonomies"
                      ? "border-emerald-500 text-emerald-300 bg-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-sky-400" />
                  <span>Education Taxonomies</span>
                </button>

                <button
                  onClick={() => setActiveTab("filterRequests")}
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === "filterRequests"
                      ? "border-emerald-500 text-emerald-300 bg-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <FileCheck className="w-4 h-4 text-purple-400" />
                  <span>User Filter Requests</span>
                  {pendingFilterReqs > 0 && (
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                      {pendingFilterReqs}
                    </span>
                  )}
                </button>
              </div>

              {/* CSV Export Button */}
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shrink-0 mb-1"
                title="Export all database records to CSV spreadsheet"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
              
              {/* ========================================================= */}
              {/* TAB 1: PROPOSALS DIRECTORY MANAGEMENT                      */}
              {/* ========================================================= */}
              {activeTab === "proposals" && (
                <div className="space-y-4">
                  
                  {/* Top Stats Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Total Proposals</span>
                      <span className="text-xl font-extrabold text-white">{totalCount}</span>
                    </div>
                    <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Brides / Grooms</span>
                      <span className="text-xl font-extrabold text-white">{brideCount} / {groomCount}</span>
                    </div>
                    <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Hidden Records</span>
                      <span className="text-xl font-extrabold text-amber-400">{hiddenCount}</span>
                    </div>
                    <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Campaign Mode</span>
                      <span className={`text-base font-bold ${localPricing.campaignMode ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {localPricing.campaignMode ? 'Active (Free Add)' : 'Standard (Paid)'}
                      </span>
                    </div>
                  </div>

                  {/* Search & Filter Toolbar */}
                  <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                      <Search className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search ID, Name, District, Qualification, Degree..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={genderFilter}
                        onChange={(e) => setGenderFilter(e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-xs text-slate-300 border border-slate-800"
                      >
                        <option value="all">All Genders</option>
                        <option value="bride">Brides Only</option>
                        <option value="groom">Grooms Only</option>
                      </select>

                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-xs text-slate-300 border border-slate-800"
                      >
                        <option value="all">All Status</option>
                        <option value="approved">Active / Approved</option>
                        <option value="hidden">Hidden</option>
                      </select>
                    </div>
                  </div>

                  {/* Bulk Actions Bar */}
                  {selectedIds.length > 0 && (
                    <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between gap-3 animate-fade-in">
                      <span className="text-xs font-bold text-emerald-300">
                        {selectedIds.length} proposal(s) selected
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleBulkApprove}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30"
                        >
                          Mark Active
                        </button>
                        <button
                          onClick={handleBulkHide}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold hover:bg-slate-700"
                        >
                          Hide from Directory
                        </button>
                        <button
                          onClick={handleBulkDelete}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/30"
                        >
                          Delete Selected
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Proposals Table */}
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="p-3 w-10">
                              <input
                                type="checkbox"
                                checked={selectedIds.length === adminProfiles.length && adminProfiles.length > 0}
                                onChange={handleSelectAll}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500"
                              />
                            </th>
                            <th className="p-3">ID / Candidate</th>
                            <th className="p-3">Gender / Age</th>
                            <th className="p-3">Islamic Qual.</th>
                            <th className="p-3">Academic Degree &amp; Category</th>
                            <th className="p-3">District</th>
                            <th className="p-3">Guardian Contact</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {adminProfiles.map((p) => {
                            const isSelected = selectedIds.includes(p.id);
                            const basic = p.basicInfo || {};
                            const genEdu = p.generalEducation || {};
                            const islamicList = Array.isArray(p.islamicQualification)
                              ? p.islamicQualification
                              : (p.islamicBackground?.qualification ? [p.islamicBackground.qualification] : []);
                            const contacts = p.contactDetails || p.contactPreferences || {};

                            return (
                              <tr 
                                key={p.id}
                                className={`hover:bg-slate-900/50 transition-colors ${
                                  isSelected ? 'bg-emerald-950/20' : ''
                                }`}
                              >
                                <td className="p-3">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleSelect(p.id)}
                                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500"
                                  />
                                </td>
                                <td className="p-3">
                                  <div className="font-mono text-emerald-400 font-bold">{p.id}</div>
                                  <div className="font-semibold text-white">{basic.fullName || "Candidate"}</div>
                                </td>
                                <td className="p-3">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                                    basic.gender === 'Bride' || p.gender === 'female'
                                      ? 'bg-rose-500/10 text-rose-300'
                                      : 'bg-emerald-500/10 text-emerald-300'
                                  }`}>
                                    {basic.gender || (p.gender === 'female' ? 'Bride' : 'Groom')}
                                  </span>
                                  <span className="text-slate-400 ml-1.5">{basic.age} Yrs</span>
                                </td>
                                <td className="p-3">
                                  <span className="font-semibold text-emerald-300">
                                    {islamicList.length > 0 ? islamicList.join(', ') : 'None'}
                                  </span>
                                </td>
                                <td className="p-3 max-w-[200px]">
                                  <div className="font-bold text-sky-300 truncate">
                                    {genEdu.degreeName || p.educationOccupation?.education || 'Not specified'}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">
                                    {genEdu.subjectCategory || 'General'}
                                    {genEdu.specialization ? ` (${genEdu.specialization})` : ''}
                                  </div>
                                </td>
                                <td className="p-3 text-slate-300">
                                  {p.locationFamily?.homeDistrict || 'Kerala'}
                                </td>
                                <td className="p-3 font-mono text-[11px] text-slate-300">
                                  {contacts.guardianPhone || contacts.phone || 'N/A'}
                                </td>
                                <td className="p-3">
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    p.status === 'hidden'
                                      ? 'bg-slate-800 text-slate-400'
                                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                                  }`}>
                                    {p.status || 'Active'}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => onSelectEditProfile(p)}
                                      className="p-1.5 rounded-lg bg-slate-800 text-amber-300 hover:bg-slate-700"
                                      title="Admin Override Edit"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm(`Delete profile ${p.id}?`)) {
                                          onDeleteProfile(p.id);
                                        }
                                      }}
                                      className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-slate-700"
                                      title="Delete Profile"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 2: DYNAMIC PRICING CONTROLS & CAMPAIGN MODE TOGGLE     */}
              {/* ========================================================= */}
              {activeTab === "pricing" && (
                <div className="max-w-2xl space-y-6">
                  
                  {pricingSavedToast && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Pricing &amp; Campaign configuration saved successfully!</span>
                    </div>
                  )}

                  {/* Campaign Mode Override Card */}
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Campaign Drive Mode (Free Onboarding)</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-md">
                          When Campaign Mode is ACTIVE, profile submission is free (₹0) to encourage data collection and directory growth. When turned OFF, submission fee is applied.
                        </p>
                      </div>
                      <button
                        onClick={toggleCampaignMode}
                        className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                          localPricing.campaignMode
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {localPricing.campaignMode ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        <span>{localPricing.campaignMode ? 'Campaign ACTIVE' : 'Campaign OFF'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Pricing Inputs Form */}
                  <form onSubmit={handleSavePricing} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                      <Coins className="w-4 h-4 text-amber-400" />
                      <span>Dynamic Pricing Fees</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Contact Unlock Fee (₹ / 1 Credit)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-2.5 text-xs text-slate-500">₹</span>
                          <input
                            type="number"
                            min="1"
                            value={localPricing.contactUnlockFee}
                            onChange={(e) => setLocalPricing(prev => ({ ...prev, contactUnlockFee: Number(e.target.value) || 15 }))}
                            className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs border border-slate-700 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Default: ₹15 / 1 Credit</p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Profile Submission Fee (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-2.5 text-xs text-slate-500">₹</span>
                          <input
                            type="number"
                            min="0"
                            value={localPricing.profileSubmissionFee}
                            onChange={(e) => setLocalPricing(prev => ({ ...prev, profileSubmissionFee: Number(e.target.value) || 0 }))}
                            className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs border border-slate-700 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {localPricing.campaignMode ? 'Currently overridden to ₹0 by Campaign Mode' : 'Default: ₹15'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Pricing Configuration</span>
                      </button>
                    </div>
                  </form>

                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 3: EDUCATION TAXONOMIES MANAGEMENT                     */}
              {/* ========================================================= */}
              {activeTab === "taxonomies" && (
                <div className="max-w-3xl space-y-6">
                  
                  {taxonomyToast && (
                    <div className="p-3.5 rounded-2xl bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>{taxonomyToast}</span>
                    </div>
                  )}

                  {/* Add New Subject Category */}
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Tag className="w-4 h-4 text-sky-400" />
                      <span>Add New Subject Category</span>
                    </h4>
                    <form onSubmit={handleAddCategory} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Data Science &amp; Artificial Intelligence"
                        value={newSubjectCategory}
                        onChange={(e) => setNewSubjectCategory(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-xl bg-slate-900 text-xs text-white border border-slate-700 focus:outline-none focus:border-sky-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Category</span>
                      </button>
                    </form>

                    <div className="pt-2">
                      <span className="text-[11px] text-slate-400 block mb-1.5">Active Subject Categories:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[...SUBJECT_CATEGORIES, ...(customTaxonomies.subjectCategories || [])].map((cat, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20 font-medium">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Add New Degree Title */}
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <span>Add Custom Degree Title</span>
                    </h4>
                    <form onSubmit={handleAddDegree} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. B.Des (Fashion Design), Ph.D. Islamic Jurisprudence"
                        value={newDegreeName}
                        onChange={(e) => setNewDegreeName(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-xl bg-slate-900 text-xs text-white border border-slate-700 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Degree</span>
                      </button>
                    </form>

                    {customTaxonomies.degreeNames?.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] text-slate-400 block mb-1.5">Custom Degree Titles:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {customTaxonomies.degreeNames.map((deg, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                              {deg}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 4: USER FILTER REQUESTS MODERATION                     */}
              {/* ========================================================= */}
              {activeTab === "filterRequests" && (
                <div className="space-y-4">
                  {filterRequests.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      No filter requests submitted yet.
                    </div>
                  ) : (
                    <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="p-3">Category</th>
                            <th className="p-3">Suggested Tag</th>
                            <th className="p-3">Reason</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {filterRequests.map(r => (
                            <tr key={r.id} className="hover:bg-slate-900/50">
                              <td className="p-3 font-semibold text-white">{r.category}</td>
                              <td className="p-3 font-bold text-emerald-400">{r.filterName}</td>
                              <td className="p-3 text-slate-400 max-w-xs">{r.reason || "None"}</td>
                              <td className="p-3">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  r.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                                  r.status === 'rejected' ? 'bg-rose-500/20 text-rose-300' :
                                  'bg-amber-500/20 text-amber-300'
                                }`}>
                                  {r.status || 'Pending'}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                {r.status !== 'approved' && (
                                  <button
                                    onClick={() => onApproveFilterRequest(r)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold hover:bg-emerald-500/30 mr-1.5"
                                  >
                                    Approve
                                  </button>
                                )}
                                {r.status !== 'rejected' && (
                                  <button
                                    onClick={() => onRejectFilterRequest(r.id)}
                                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold hover:bg-rose-500/30"
                                  >
                                    Reject
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
