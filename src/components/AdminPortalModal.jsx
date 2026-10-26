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
  Tag,
  MessageSquare,
  Key,
  Share2,
  Copy,
  Send,
  Calendar,
  ExternalLink,
  Check
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
  const [activeTab, setActiveTab] = useState("proposals"); // "proposals" | "whatsapp" | "credentials" | "pricing" | "taxonomies" | "filterRequests"

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState([]);

  // Local Pricing, Campaign & Platform Settings State
  const [localPricing, setLocalPricing] = useState({
    contactUnlockFee: pricing.contactUnlockFee || 15,
    profileSubmissionFee: pricing.profileSubmissionFee || 0,
    campaignMode: pricing.campaignMode !== undefined ? pricing.campaignMode : true,
    campaignEndDate: pricing.campaignEndDate || '2026-11-20T23:59:00',
    campaignRewardCredits: pricing.campaignRewardCredits || 3,
    whatsappGroupLink: pricing.whatsappGroupLink || 'https://chat.whatsapp.com/sample-althayyiboon-group',
    whatsappGroupName: pricing.whatsappGroupName || 'Al-ThayyiBoon Official Matrimony',
    razorpayKeyId: pricing.razorpayKeyId || '',
    razorpayKeySecret: pricing.razorpayKeySecret || '',
    whatsappApiKey: pricing.whatsappApiKey || '',
    statsVisibility: pricing.statsVisibility || 'auto',
    statsThreshold: pricing.statsThreshold || 200
  });
  const [pricingSavedToast, setPricingSavedToast] = useState(false);
  const [whatsappToast, setWhatsappToast] = useState("");

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

  // WhatsApp & Legacy Credentials Management Actions
  const handleSendWhatsAppInvite = (profile) => {
    const phone = profile.whatsappGroupNumber || profile.contactDetails?.whatsappNumber || profile.contactDetails?.guardianPhone || profile.contactPreferences?.phone || '';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const name = profile.basicInfo?.fullName || 'Candidate';
    const groupLink = localPricing.whatsappGroupLink || 'https://chat.whatsapp.com/sample-althayyiboon-group';
    
    const text = `Assalamu Alaikum ${name},\n\nWelcome to Al-ThayyiBoon Matrimony! Join our official WhatsApp group to receive newly verified profiles:\n${groupLink}\n\nJazakallahu Khair.`;
    
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareCredentials = (profile) => {
    const phone = profile.contactDetails?.whatsappNumber || profile.contactDetails?.guardianPhone || profile.contactPreferences?.phone || '';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const name = profile.basicInfo?.fullName || 'Candidate';
    const username = profile.loginCredentials?.username || profile.id;
    const password = profile.loginCredentials?.password || profile.security?.editPin || `ALTB@${profile.id}`;
    const siteUrl = window.location.origin;

    const text = `Assalamu Alaikum ${name},\n\nHere are your account login credentials for Al-ThayyiBoon Matrimonial Network:\n\n👤 Username / ID: ${username}\n🔑 Password / PIN: ${password}\n🌐 Login at: ${siteUrl}\n\nPlease keep your credentials confidential. You can view matching proposals and manage your profile anytime.`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareProfileBiodata = (profile) => {
    const basic = profile.basicInfo || {};
    const edu = profile.educationOccupation || {};
    const loc = profile.locationFamily || {};
    const islamic = Array.isArray(profile.islamicQualification) ? profile.islamicQualification.join(', ') : (profile.islamicBackground?.qualification || 'None');
    
    const text = `*Al-ThayyiBoon Matrimonial Proposal*\n` +
      `🆔 Proposal ID: ${profile.id}\n` +
      `👤 Candidate: ${basic.gender || profile.gender} (${basic.age || ''} Yrs)\n` +
      `📍 District: ${loc.homeDistrict || 'Kerala'}\n` +
      `🎓 Islamic Qualification: ${islamic}\n` +
      `📚 General Education: ${profile.generalEducation?.degreeName || edu.education || 'Graduate'}\n` +
      `💼 Profession: ${edu.profession || 'Not Specified'}\n` +
      `🌍 Work Location: ${edu.workCountry || 'Kerala'}\n\n` +
      `To view full guardian contact details, visit: ${window.location.origin}`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyAllWhatsAppNumbers = () => {
    const numbers = profiles
      .filter(p => p.whatsappConsent !== false)
      .map(p => p.whatsappGroupNumber || p.contactDetails?.whatsappNumber || p.contactDetails?.guardianPhone || p.contactPreferences?.phone || '')
      .map(n => n.replace(/[^0-9]/g, ''))
      .filter(n => n.length >= 10);

    const uniqueNumbers = Array.from(new Set(numbers));
    if (uniqueNumbers.length === 0) {
      alert("No WhatsApp numbers found to copy.");
      return;
    }
    navigator.clipboard.writeText(uniqueNumbers.join(', '));
    setWhatsappToast(`Copied ${uniqueNumbers.length} WhatsApp numbers to clipboard!`);
    setTimeout(() => setWhatsappToast(""), 3000);
  };

  const handleDownloadVCard = () => {
    const optIns = profiles.filter(p => p.whatsappConsent !== false);
    if (optIns.length === 0) {
      alert("No opted-in profiles found.");
      return;
    }

    let vcfContent = "";
    optIns.forEach(p => {
      const name = p.basicInfo?.fullName || p.id;
      const phone = (p.whatsappGroupNumber || p.contactDetails?.whatsappNumber || p.contactDetails?.guardianPhone || '').replace(/[^0-9]/g, '');
      if (phone) {
        vcfContent += `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:AT-${name}\r\nTEL;TYPE=CELL:+${phone}\r\nNOTE:Al-ThayyiBoon Candidate (${p.id})\r\nEND:VCARD\r\n`;
      }
    });

    const blob = new Blob([vcfContent], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `althayyiboon_whatsapp_contacts_${Date.now()}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setWhatsappToast(`Downloaded ${optIns.length} contacts (.vcf) for one-click WhatsApp import!`);
    setTimeout(() => setWhatsappToast(""), 3000);
  };

  const handleExportCredentialsCSV = () => {
    const headers = ["Profile ID", "Candidate Name", "Gender", "Phone / WhatsApp", "Username", "Password / PIN", "Status"];
    const rows = profiles.map(p => {
      const basic = p.basicInfo || {};
      const phone = p.contactDetails?.whatsappNumber || p.contactDetails?.guardianPhone || p.contactPreferences?.phone || '';
      const username = p.loginCredentials?.username || p.id;
      const pass = p.loginCredentials?.password || p.security?.editPin || `ALTB@${p.id}`;
      return [
        p.id,
        `"${basic.fullName || ''}"`,
        basic.gender || p.gender || '',
        `"${phone}"`,
        `"${username}"`,
        `"${pass}"`,
        p.status || 'approved'
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `althayyiboon_candidate_credentials_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered proposal list for admin
  const adminProfiles = profiles.filter(p => {
    const currentStatus = p.status || "approved";
    if (statusFilter === "campaign") {
      if (!p.registeredDuringCampaign) return false;
    } else if (statusFilter === "whatsapp") {
      if (p.whatsappConsent === false) return false;
    } else if (statusFilter !== "all" && currentStatus !== statusFilter) {
      return false;
    }
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
  const campaignCount = profiles.filter(p => p.registeredDuringCampaign).length;
  const whatsappCount = profiles.filter(p => p.whatsappConsent !== false).length;
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
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 shrink-0 ${
                    activeTab === "proposals"
                      ? "border-emerald-500 text-emerald-300 bg-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Proposals ({totalCount})</span>
                </button>

                <button
                  onClick={() => setActiveTab("whatsapp")}
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 shrink-0 ${
                    activeTab === "whatsapp"
                      ? "border-emerald-500 text-emerald-300 bg-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp &amp; Broadcast ({whatsappCount})</span>
                </button>

                <button
                  onClick={() => setActiveTab("credentials")}
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 shrink-0 ${
                    activeTab === "credentials"
                      ? "border-emerald-500 text-emerald-300 bg-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Candidate Logins ({totalCount})</span>
                </button>

                <button
                  onClick={() => setActiveTab("pricing")}
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 shrink-0 ${
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
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 shrink-0 ${
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
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 shrink-0 ${
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
              
              {/* WhatsApp Notification Toast */}
              {whatsappToast && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{whatsappToast}</span>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 1: PROPOSALS DIRECTORY MANAGEMENT                      */}
              {/* ========================================================= */}
              {activeTab === "proposals" && (
                <div className="space-y-4">
                  
                  {/* Top Stats Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Total Proposals</span>
                      <span className="text-xl font-extrabold text-white">{totalCount}</span>
                    </div>
                    <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Brides / Grooms</span>
                      <span className="text-xl font-extrabold text-white">{brideCount} / {groomCount}</span>
                    </div>
                    <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/5">
                      <span className="text-[11px] text-amber-300 block font-semibold">Campaign Regs</span>
                      <span className="text-xl font-extrabold text-amber-300">{campaignCount}</span>
                    </div>
                    <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
                      <span className="text-[11px] text-emerald-300 block font-semibold">WhatsApp Opt-Ins</span>
                      <span className="text-xl font-extrabold text-emerald-300">{whatsappCount}</span>
                    </div>
                    <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Campaign Mode</span>
                      <span className={`text-base font-bold ${localPricing.campaignMode ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {localPricing.campaignMode ? 'Active (Free)' : 'Standard (Paid)'}
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
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-xs text-slate-300 border border-slate-800 cursor-pointer"
                      >
                        <option value="all">All Genders</option>
                        <option value="bride">Brides Only</option>
                        <option value="groom">Grooms Only</option>
                      </select>

                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-xs text-slate-300 border border-slate-800 cursor-pointer"
                      >
                        <option value="all">All Status</option>
                        <option value="campaign">Campaign Registrations ({campaignCount})</option>
                        <option value="whatsapp">WhatsApp Opt-Ins ({whatsappCount})</option>
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
                                      onClick={() => handleSendWhatsAppInvite(p)}
                                      className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                                      title="Send WhatsApp Group Invite"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleShareCredentials(p)}
                                      className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30"
                                      title="Share Login Credentials via WhatsApp"
                                    >
                                      <Key className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleShareProfileBiodata(p)}
                                      className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 border border-teal-500/30"
                                      title="Share Proposal Biodata to WhatsApp"
                                    >
                                      <Share2 className="w-3.5 h-3.5" />
                                    </button>
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
              {/* TAB 2: WHATSAPP GROUP & BROADCAST MANAGEMENT              */}
              {/* ========================================================= */}
              {activeTab === "whatsapp" && (
                <div className="space-y-6">
                  
                  {/* WhatsApp Group Configuration Card */}
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-400" />
                          <span>Official WhatsApp Group Settings</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Configure group invite link shared with candidates when they register or receive invites.
                        </p>
                      </div>
                      {localPricing.whatsappGroupLink && (
                        <a
                          href={localPricing.whatsappGroupLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/30 shrink-0"
                        >
                          <span>Test Group Link</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Group Link</label>
                        <input
                          type="url"
                          value={localPricing.whatsappGroupLink}
                          onChange={(e) => setLocalPricing(prev => ({ ...prev, whatsappGroupLink: e.target.value }))}
                          placeholder="https://chat.whatsapp.com/..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white placeholder-slate-500 border border-slate-700 text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Group Name</label>
                        <input
                          type="text"
                          value={localPricing.whatsappGroupName}
                          onChange={(e) => setLocalPricing(prev => ({ ...prev, whatsappGroupName: e.target.value }))}
                          placeholder="Al-ThayyiBoon Verified Proposals"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white placeholder-slate-500 border border-slate-700 text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleSavePricing}
                        className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Group Settings</span>
                      </button>
                    </div>
                  </div>

                  {/* WhatsApp Bulk Action Bar */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-950 to-teal-950/20 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span>Candidate WhatsApp Opt-Ins ({whatsappCount} Candidates)</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Candidates who gave consent in their registration form to receive matrimonial proposals on WhatsApp.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyAllWhatsAppNumbers}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        title="Copy all phone numbers comma-separated to paste in WhatsApp"
                      >
                        <Copy className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copy All Numbers</span>
                      </button>
                      <button
                        onClick={handleDownloadVCard}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/30 cursor-pointer"
                        title="Download .vcf file to import into phone contacts and add to WhatsApp group"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Contacts (.vcf)</span>
                      </button>
                    </div>
                  </div>

                  {/* WhatsApp Opt-in Candidates Table */}
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="p-3">ID / Candidate</th>
                            <th className="p-3">Gender / Age</th>
                            <th className="p-3">Opt-in WhatsApp Number</th>
                            <th className="p-3">District</th>
                            <th className="p-3">Campaign Reg?</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {profiles.filter(p => p.whatsappConsent !== false).map(p => {
                            const basic = p.basicInfo || {};
                            const number = p.whatsappGroupNumber || p.contactDetails?.whatsappNumber || p.contactDetails?.guardianPhone || p.contactPreferences?.phone || 'N/A';
                            return (
                              <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
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
                                <td className="p-3 font-mono text-slate-200 font-semibold">
                                  {number}
                                </td>
                                <td className="p-3 text-slate-300">
                                  {p.locationFamily?.homeDistrict || 'Kerala'}
                                </td>
                                <td className="p-3">
                                  {p.registeredDuringCampaign ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                      Campaign Reg
                                    </span>
                                  ) : (
                                    <span className="text-slate-500 text-[11px]">Standard</span>
                                  )}
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleSendWhatsAppInvite(p)}
                                      className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                    >
                                      <MessageSquare className="w-3 h-3 text-emerald-400" />
                                      <span>Invite to Group</span>
                                    </button>
                                    <button
                                      onClick={() => handleShareProfileBiodata(p)}
                                      className="p-1.5 rounded-xl bg-slate-800 text-teal-300 hover:bg-slate-700 border border-slate-700 cursor-pointer"
                                      title="Share Proposal Biodata"
                                    >
                                      <Share2 className="w-3.5 h-3.5" />
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
              {/* TAB 3: CANDIDATE LOGINS & LEGACY PROFILE CREDENTIALS      */}
              {/* ========================================================= */}
              {activeTab === "credentials" && (
                <div className="space-y-6">
                  
                  {/* Credentials Header & Explanation */}
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Key className="w-4 h-4 text-amber-400" />
                          <span>Candidate Account Credentials &amp; Passwords</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                          Legacy profiles and offline candidates do not have Google authentication accounts yet. 
                          You can share their unique username/ID and password individually via WhatsApp, or export them all together. 
                          Candidates can log in using their credentials to view and manage their proposal.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={handleExportCredentialsCSV}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>Export Credentials (CSV)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Credentials Table */}
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="p-3">ID / Candidate Name</th>
                            <th className="p-3">Phone / WhatsApp</th>
                            <th className="p-3">Username / Login ID</th>
                            <th className="p-3">Password / Access PIN</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Share Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {profiles.map(p => {
                            const basic = p.basicInfo || {};
                            const phone = p.contactDetails?.whatsappNumber || p.contactDetails?.guardianPhone || p.contactPreferences?.phone || 'N/A';
                            const username = p.loginCredentials?.username || p.id;
                            const password = p.loginCredentials?.password || p.security?.editPin || `ALTB@${p.id}`;

                            return (
                              <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                                <td className="p-3">
                                  <div className="font-mono text-emerald-400 font-bold">{p.id}</div>
                                  <div className="font-semibold text-white">{basic.fullName || "Candidate"}</div>
                                </td>
                                <td className="p-3 font-mono text-slate-300">
                                  {phone}
                                </td>
                                <td className="p-3 font-mono text-slate-200 font-bold bg-slate-900/40 px-2 py-1 rounded">
                                  {username}
                                </td>
                                <td className="p-3 font-mono text-amber-400 font-bold bg-slate-900/40 px-2 py-1 rounded">
                                  {password}
                                </td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                    Ready to Share
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => handleShareCredentials(p)}
                                    className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 font-bold text-[11px] inline-flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Send className="w-3 h-3 text-amber-400" />
                                    <span>Share via WhatsApp</span>
                                  </button>
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
              {/* TAB 4: DYNAMIC PRICING CONTROLS & CAMPAIGN MODE TOGGLE     */}
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
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>Campaign Drive Mode (Free Onboarding &amp; Profile Guarding)</span>
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {campaignCount} Registrations
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 max-w-md">
                          When active, the directory is guarded behind the Campaign Launch Holding Page, registration is 100% free (₹0), and candidates earn free contact views when directory unlocks.
                        </p>
                      </div>
                      <button
                        onClick={toggleCampaignMode}
                        className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                          localPricing.campaignMode
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {localPricing.campaignMode ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        <span>{localPricing.campaignMode ? 'Campaign ACTIVE' : 'Campaign OFF'}</span>
                      </button>
                    </div>

                    {/* Campaign End Date & Time and Reward Credits */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Campaign Target End Date &amp; Time</span>
                        </label>
                        <input
                          type="datetime-local"
                          value={localPricing.campaignEndDate ? localPricing.campaignEndDate.slice(0, 16) : '2026-11-20T23:59'}
                          onChange={(e) => setLocalPricing(prev => ({ ...prev, campaignEndDate: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white font-mono text-xs border border-slate-700 focus:outline-none focus:border-emerald-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          The public countdown page will count down to this exact date and time.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                          <Coins className="w-3.5 h-3.5 text-amber-400" />
                          <span>Complimentary Contact Views at Launch</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={localPricing.campaignRewardCredits || 3}
                          onChange={(e) => setLocalPricing(prev => ({ ...prev, campaignRewardCredits: Number(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs border border-slate-700 focus:outline-none focus:border-emerald-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          Free contact views promised to registered candidates when directory opens.
                        </p>
                      </div>
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

                    {/* Public Profile Statistics Visibility Controls */}
                    <div className="pt-4 border-t border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-emerald-400" />
                            <span>Public Statistics &amp; Profile Numbers Visibility</span>
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Control when community statistics numbers (Total, Brides, Grooms, Scholars) appear on the homepage.
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          (localPricing.statsVisibility === 'always_show' || (localPricing.statsVisibility === 'auto' && profiles.length >= (Number(localPricing.statsThreshold) || 200)))
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {(localPricing.statsVisibility === 'always_show' || (localPricing.statsVisibility === 'auto' && profiles.length >= (Number(localPricing.statsThreshold) || 200)))
                            ? 'Currently Visible' 
                            : 'Currently Hidden'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setLocalPricing(prev => ({ ...prev, statsVisibility: 'auto' }))}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            localPricing.statsVisibility === 'auto'
                              ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="text-xs font-bold flex items-center justify-between">
                            <span>Auto (200+ profiles)</span>
                            {localPricing.statsVisibility === 'auto' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                            Auto-hides numbers until 200 profiles, then automatically reveals.
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setLocalPricing(prev => ({ ...prev, statsVisibility: 'always_hide' }))}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            localPricing.statsVisibility === 'always_hide'
                              ? 'bg-amber-500/20 border-amber-500 text-white shadow-sm'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="text-xs font-bold flex items-center justify-between">
                            <span>Always Hide</span>
                            {localPricing.statsVisibility === 'always_hide' && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                            Never display raw total statistics numbers publicly.
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setLocalPricing(prev => ({ ...prev, statsVisibility: 'always_show' }))}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            localPricing.statsVisibility === 'always_show'
                              ? 'bg-teal-500/20 border-teal-500 text-white shadow-sm'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="text-xs font-bold flex items-center justify-between">
                            <span>Always Show</span>
                            {localPricing.statsVisibility === 'always_show' && <CheckCircle className="w-3.5 h-3.5 text-teal-400" />}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                            Always display exact counts regardless of total number.
                          </div>
                        </button>
                      </div>

                      {/* Threshold count input if auto */}
                      {localPricing.statsVisibility === 'auto' && (
                        <div className="pt-1 flex items-center gap-3">
                          <label className="text-xs font-medium text-slate-300 whitespace-nowrap">
                            Auto-show threshold count:
                          </label>
                          <input
                            type="number"
                            min="10"
                            max="10000"
                            value={localPricing.statsThreshold || 200}
                            onChange={(e) => setLocalPricing(prev => ({ ...prev, statsThreshold: Number(e.target.value) || 200 }))}
                            className="w-24 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs border border-slate-700 focus:outline-none focus:border-emerald-500"
                          />
                          <span className="text-[11px] text-slate-500">profiles (Default: 200)</span>
                        </div>
                      )}
                    </div>

                    {/* Gateway Integrations (Razorpay & WhatsApp Business API) */}
                    <div className="pt-4 border-t border-slate-800 space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Coins className="w-4 h-4 text-emerald-400" />
                          <span>Payment &amp; Communication Gateways (Ready for Connection)</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Enter your Razorpay account keys and WhatsApp business details. The application is configured to connect immediately.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Razorpay Key ID
                          </label>
                          <input
                            type="text"
                            value={localPricing.razorpayKeyId}
                            onChange={(e) => setLocalPricing(prev => ({ ...prev, razorpayKeyId: e.target.value }))}
                            placeholder="rzp_live_... or rzp_test_..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white font-mono text-xs border border-slate-700 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Razorpay Key Secret
                          </label>
                          <input
                            type="password"
                            value={localPricing.razorpayKeySecret}
                            onChange={(e) => setLocalPricing(prev => ({ ...prev, razorpayKeySecret: e.target.value }))}
                            placeholder="••••••••••••"
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white font-mono text-xs border border-slate-700 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          WhatsApp Business API Token / Webhook (Optional)
                        </label>
                        <input
                          type="text"
                          value={localPricing.whatsappApiKey}
                          onChange={(e) => setLocalPricing(prev => ({ ...prev, whatsappApiKey: e.target.value }))}
                          placeholder="Optional WhatsApp cloud API key or provider token"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 text-white font-mono text-xs border border-slate-700 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Pricing, Campaign &amp; Gateway Configuration</span>
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
