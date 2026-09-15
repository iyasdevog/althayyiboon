import { useState, useEffect, useMemo } from 'react';
import { 
  fetchProfilesFromStore, 
  saveProfileToStore, 
  updateProfileInStore,
  deleteProfileFromStore,
  subscribeToProfiles,
  fetchApprovedCustomFilters,
  submitFilterRequest,
  fetchFilterRequests,
  approveFilterRequest,
  rejectFilterRequest
} from '../firebase/profileService';

const BOOKMARKS_KEY = "althayyiboon_bookmarks_v1";

const PROFESSION_KEYWORDS = {
  "Software Engineer / IT": ["software", "developer", "engineer", "it", "programmer", "coder", "web", "tech", "data", "system", "full stack", "frontend", "backend"],
  "Doctor / Healthcare": ["doctor", "mbbs", "md", "physician", "surgeon", "dentist", "healthcare", "medical", "pediatrician", "gynecologist"],
  "Nurse / Paramedical": ["nurse", "nursing", "paramedical", "lab tech", "radiographer", "pharmacist"],
  "Civil / Mech / Electrical Engineer": ["engineer", "engineering", "civil", "mechanical", "electrical", "electronics", "automotive", "site engineer"],
  "Teacher / Educator / Lecturer": ["teacher", "educator", "lecturer", "professor", "faculty", "tutor", "school", "college", "headmaster"],
  "Accountant / Finance / CA": ["account", "finance", "ca", "chartered", "auditor", "tax", "tally", "bookkeeper"],
  "Business / Entrepreneur": ["business", "entrepreneur", "trader", "shop", "owner", "merchant", "self", "director", "founder"],
  "Banking Professional": ["bank", "banking", "finance", "clerk", "po", "manager"],
  "Government / Civil Services": ["government", "govt", "civil service", "psc", "upsc", "clerk", "officer", "police", "revenue"],
  "Graphic Designer / Media / Content": ["designer", "design", "graphic", "media", "content", "editor", "video", "ui/ux", "animator", "photographer"],
  "Architect / Interior Designer": ["architect", "architecture", "interior"],
  "Pharmacist / Medical Rep": ["pharmacist", "pharmacy", "medical rep", "pharma"],
  "HR / Administrative": ["hr", "human resource", "admin", "administrator", "manager", "executive", "office"],
  "Islamic Teacher / Usthad": ["usthad", "isla", "islamic teacher", "arabic teacher", "mudarris", "imam", "khateeb", "wafi", "hudawi"],
  "Student / Pursuing Higher Education": ["student", "studying", "pursuing", "scholar"],
  "Other / Private Employee": ["employee", "private", "work", "job", "staff", "associate"]
};

export function useProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("All");
  const [activeQuickTag, setActiveQuickTag] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Dynamic Custom Filters & Admin Requests State
  const [approvedCustomFilters, setApprovedCustomFilters] = useState([]);
  const [filterRequests, setFilterRequests] = useState([]);

  // Bookmark State
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Filter state
  const defaultFilters = {
    gender: "All",
    minAge: 18,
    maxAge: 70,
    qualifications: [],
    professions: [],
    profession: "",
    district: "",
    workLocation: "",
    maritalStatus: "",
    sect: "",
    postedWithin: ""  // "" = all, "1" = today, "7" = last 7d, "30" = last 30d, "90" = last 90d
  };


  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setFilters(prev => ({ ...prev, gender: selectedGender }));
  }, [selectedGender]);

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Load profiles, approved filters, & filter requests
  useEffect(() => {
    let unsubscribe = () => {};

    async function loadData() {
      setLoading(true);
      const data = await fetchProfilesFromStore();
      setProfiles(data);

      const customF = await fetchApprovedCustomFilters();
      setApprovedCustomFilters(customF);

      const fReqs = await fetchFilterRequests();
      setFilterRequests(fReqs);

      setLoading(false);

      unsubscribe = subscribeToProfiles((updatedList) => {
        setProfiles(updatedList);
      });
    }

    loadData();
    return () => unsubscribe();
  }, []);

  // CRUD Handlers
  const addNewProfile = async (formData) => {
    const newDoc = await saveProfileToStore(formData);
    setProfiles(prev => [newDoc, ...prev.filter(p => p.id !== newDoc.id)]);
    return newDoc;
  };

  const updateProfile = async (profileId, updatedFields) => {
    await updateProfileInStore(profileId, updatedFields);
    setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, ...updatedFields } : p));
  };

  const deleteProfile = async (profileId) => {
    await deleteProfileFromStore(profileId);
    setProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  // Custom Filter Request Handlers
  const handleUserFilterRequest = async (requestData) => {
    const newItem = await submitFilterRequest(requestData);
    setFilterRequests(prev => [newItem, ...prev]);
    return newItem;
  };

  const handleApproveFilterRequest = async (requestItem) => {
    await approveFilterRequest(requestItem);
    setFilterRequests(prev => prev.map(r => r.id === requestItem.id ? { ...r, status: "approved" } : r));
    const updatedCustom = await fetchApprovedCustomFilters();
    setApprovedCustomFilters(updatedCustom);
  };

  const handleRejectFilterRequest = async (requestId) => {
    await rejectFilterRequest(requestId);
    setFilterRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "rejected" } : r));
  };

  const toggleBookmark = (id) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSelectedGender("All");
    setActiveQuickTag("");
    setSearchQuery("");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.gender !== "All") count++;
    if (filters.minAge > 18 || filters.maxAge < 70) count++;
    if (filters.qualifications?.length > 0) count += filters.qualifications.length;
    if (filters.professions?.length > 0) count += filters.professions.length;
    if (filters.profession) count++;
    if (filters.district) count++;
    if (filters.workLocation) count++;
    if (filters.maritalStatus) count++;
    if (filters.sect) count++;
    if (filters.postedWithin) count++;
    return count;
  }, [filters]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const basic = profile.basicInfo || {};
      const islamic = profile.islamicBackground || {};
      const edu = profile.educationOccupation || {};
      const loc = profile.locationFamily || {};

      if (filters.gender !== "All" && basic.gender !== filters.gender) {
        return false;
      }

      const age = Number(basic.age) || 0;
      if (age < filters.minAge || age > filters.maxAge) {
        return false;
      }

      if (filters.district && loc.homeDistrict !== filters.district) {
        return false;
      }

      if (filters.workLocation && edu.workCountry !== filters.workLocation && !((edu.workLocation || "").includes(filters.workLocation))) {
        return false;
      }

      if (filters.maritalStatus && basic.maritalStatus !== filters.maritalStatus) {
        return false;
      }

      if (filters.sect && islamic.sect !== filters.sect) {
        return false;
      }

      if (filters.qualifications?.length > 0) {
        const pQual = islamic.qualification || "";
        const matchesQual = filters.qualifications.some(q => pQual.toLowerCase().includes(q.toLowerCase()));
        if (!matchesQual) return false;
      }

      const selectedProfs = [
        ...(filters.professions || []),
        ...(filters.profession ? [filters.profession] : [])
      ];

      if (selectedProfs.length > 0) {
        const pProf = (edu.profession || "").toLowerCase();
        if (!pProf) return false;

        const matchesProf = selectedProfs.some(filterProf => {
          const lowerFilter = filterProf.toLowerCase();
          if (pProf.includes(lowerFilter)) return true;

          const keywords = PROFESSION_KEYWORDS[filterProf] || [];
          if (keywords.some(kw => pProf.includes(kw))) return true;

          const words = lowerFilter.split(/[\s/(),-]+/).filter(w => w.length >= 3);
          return words.some(w => pProf.includes(w));
        });

        if (!matchesProf) return false;
      }


      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const searchableText = [
          basic.fullName,
          basic.gender,
          basic.maritalStatus,
          islamic.qualification,
          islamic.sect,
          islamic.subGroup,
          edu.education,
          edu.profession,
          edu.workLocation,
          edu.workCountry,
          loc.homeDistrict,
          loc.nativePlace,
          ...(profile.searchKeywords || [])
        ].filter(Boolean).join(" ").toLowerCase();

        if (!searchableText.includes(q)) {
          return false;
        }
      }

      // Posted within filter
      if (filters.postedWithin) {
        const days = parseInt(filters.postedWithin, 10);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const posted = new Date(profile.createdAt || 0);
        if (isNaN(posted.getTime()) || posted < cutoff) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "ageAsc") {
        return (a.basicInfo?.age || 0) - (b.basicInfo?.age || 0);
      }
      if (sortBy === "ageDesc") {
        return (b.basicInfo?.age || 0) - (a.basicInfo?.age || 0);
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [profiles, filters, searchQuery, sortBy]);

  return {
    profiles: filteredProfiles,
    rawProfiles: profiles,
    totalCount: profiles.length,
    loading,
    searchQuery,
    setSearchQuery,
    selectedGender,
    setSelectedGender,
    activeQuickTag,
    setActiveQuickTag,
    filters,
    setFilters,
    resetFilters,
    activeFilterCount,
    sortBy,
    setSortBy,
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    bookmarks,
    toggleBookmark,
    addNewProfile,
    updateProfile,
    deleteProfile,
    approvedCustomFilters,
    filterRequests,
    handleUserFilterRequest,
    handleApproveFilterRequest,
    handleRejectFilterRequest
  };
}
