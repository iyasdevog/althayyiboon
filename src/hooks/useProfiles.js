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
    district: "",
    workLocation: "",
    maritalStatus: "",
    sect: ""
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
    if (filters.district) count++;
    if (filters.workLocation) count++;
    if (filters.maritalStatus) count++;
    if (filters.sect) count++;
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
