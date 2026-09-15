import { db } from "./config";
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";

const LOCAL_STORAGE_KEY = "althayyiboon_profiles_v1";
const CUSTOM_FILTERS_KEY = "althayyiboon_custom_filters_v1";
const FILTER_REQUESTS_KEY = "althayyiboon_filter_requests_v1";

// Helper to generate search keywords array for Firestore keyword searching
export function generateSearchKeywords(profile) {
  const tokens = new Set();
  
  const fieldsToTokenize = [
    profile.basicInfo?.fullName,
    profile.basicInfo?.gender,
    profile.basicInfo?.maritalStatus,
    profile.basicInfo?.color,
    profile.islamicBackground?.qualification,
    profile.islamicBackground?.sect,
    profile.islamicBackground?.subGroup,
    profile.educationOccupation?.education,
    profile.educationOccupation?.profession,
    profile.educationOccupation?.workLocation,
    profile.locationFamily?.homeDistrict,
    profile.locationFamily?.nativePlace,
    profile.contactPreferences?.expectations
  ];

  fieldsToTokenize.forEach(text => {
    if (!text) return;
    const cleanStr = String(text).toLowerCase().replace(/[^a-z0-9\s]/g, "");
    const words = cleanStr.split(/\s+/).filter(w => w.length > 1);
    words.forEach(w => tokens.add(w));
  });

  return Array.from(tokens);
}

// Get local storage profiles
function getLocalStorageProfiles() {
  try {
    const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!existing) return [];
    return JSON.parse(existing) || [];
  } catch (e) {
    return [];
  }
}

function saveLocalStorageProfiles(list) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
}

// Helper to merge Firestore profiles with LocalStorage profiles (preserves fallback & offline profiles)
function mergeProfiles(fsProfiles = []) {
  const localList = getLocalStorageProfiles();
  if (!localList || localList.length === 0) return fsProfiles;

  const fsIds = new Set(fsProfiles.map(p => p.id));
  const merged = [...fsProfiles];
  
  for (const lp of localList) {
    if (!fsIds.has(lp.id)) {
      merged.push(lp);
    }
  }
  return merged.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

// ---------------- PROFILES CRUD ---------------- //

export async function fetchProfilesFromStore() {
  try {
    const colRef = collection(db, "profiles");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const fsProfiles = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      return mergeProfiles(fsProfiles);
    }
  } catch (err) {
    console.warn("Firestore fetch notice:", err.message);
  }
  return getLocalStorageProfiles();
}

export async function saveProfileToStore(newProfileData) {
  const searchKeywords = generateSearchKeywords(newProfileData);
  const secretPin = newProfileData.security?.editPin || newProfileData.contactPreferences?.secretPin || "1234";
  
  const docPayload = {
    ...newProfileData,
    contactPreferences: {
      ...newProfileData.contactPreferences,
      secretPin
    },
    security: {
      ...newProfileData.security,
      editPin: secretPin
    },
    status: "approved",
    createdAt: new Date().toISOString(),
    searchKeywords
  };

  let savedId = "prof_" + Date.now();

  try {
    const colRef = collection(db, "profiles");
    const docRef = await addDoc(colRef, {
      ...docPayload,
      firestoreTimestamp: serverTimestamp()
    });
    savedId = docRef.id;
  } catch (err) {
    console.warn("Firestore save fallback:", err.message);
  }

  const localList = getLocalStorageProfiles();
  const completeProfile = { ...docPayload, id: savedId };
  saveLocalStorageProfiles([completeProfile, ...localList.filter(p => p.id !== savedId)]);
  return completeProfile;
}

export async function updateProfileInStore(profileId, updatedFields) {
  const searchKeywords = generateSearchKeywords(updatedFields);
  const secretPin = updatedFields.security?.editPin || updatedFields.contactPreferences?.secretPin;

  const patchData = {
    ...updatedFields,
    ...(secretPin ? {
      contactPreferences: {
        ...updatedFields.contactPreferences,
        secretPin
      },
      security: {
        ...updatedFields.security,
        editPin: secretPin
      }
    } : {}),
    updatedAt: new Date().toISOString(),
    searchKeywords
  };

  try {
    const docRef = doc(db, "profiles", profileId);
    await updateDoc(docRef, patchData);
  } catch (err) {
    console.warn("Firestore update fallback to local:", err.message);
  }

  const list = getLocalStorageProfiles();
  const index = list.findIndex(p => p.id === profileId);
  if (index !== -1) {
    list[index] = { ...list[index], ...patchData };
    saveLocalStorageProfiles(list);
  }
}

export async function deleteProfileFromStore(profileId) {
  try {
    const docRef = doc(db, "profiles", profileId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Firestore delete fallback to local:", err.message);
  }

  const list = getLocalStorageProfiles();
  const updated = list.filter(p => p.id !== profileId);
  saveLocalStorageProfiles(updated);
}

export function subscribeToProfiles(onDataChange) {
  try {
    const colRef = collection(db, "profiles");
    const q = query(colRef, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const fsProfiles = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        onDataChange(mergeProfiles(fsProfiles));
      } else {
        onDataChange(getLocalStorageProfiles());
      }
    }, (error) => {
      console.warn("Firestore listener error:", error.message);
    });
  } catch (e) {
    console.warn("Subscribe error:", e.message);
  }
  return () => {};
}


// ---------------- DYNAMIC CUSTOM FILTERS & REQUESTS ---------------- //

function getLocalCustomFilters() {
  try {
    const saved = localStorage.getItem(CUSTOM_FILTERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalCustomFilters(list) {
  localStorage.setItem(CUSTOM_FILTERS_KEY, JSON.stringify(list));
}

function getLocalFilterRequests() {
  try {
    const saved = localStorage.getItem(FILTER_REQUESTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalFilterRequests(list) {
  localStorage.setItem(FILTER_REQUESTS_KEY, JSON.stringify(list));
}

export async function fetchApprovedCustomFilters() {
  try {
    const colRef = collection(db, "customFilters");
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (e) {
    console.warn("Firestore customFilters fetch error:", e.message);
  }
  return getLocalCustomFilters();
}

export async function submitFilterRequest(requestData) {
  const payload = {
    ...requestData,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  let id = "freq_" + Date.now();

  try {
    const colRef = collection(db, "filterRequests");
    const docRef = await addDoc(colRef, payload);
    id = docRef.id;
  } catch (e) {
    console.warn("Firestore filterRequest save fallback:", e.message);
  }

  const list = getLocalFilterRequests();
  const newItem = { ...payload, id };
  saveLocalFilterRequests([newItem, ...list]);
  return newItem;
}

export async function fetchFilterRequests() {
  try {
    const colRef = collection(db, "filterRequests");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (e) {
    console.warn("Firestore filterRequests fetch error:", e.message);
  }
  return getLocalFilterRequests();
}

export async function approveFilterRequest(requestItem) {
  // 1. Add to customFilters
  const filterPayload = {
    category: requestItem.category,
    name: requestItem.filterName,
    approvedAt: new Date().toISOString()
  };

  try {
    const colRef = collection(db, "customFilters");
    await addDoc(colRef, filterPayload);
    // update status in filterRequests
    if (requestItem.id && !requestItem.id.startsWith("freq_")) {
      const reqRef = doc(db, "filterRequests", requestItem.id);
      await updateDoc(reqRef, { status: "approved" });
    }
  } catch (e) {
    console.warn("Firestore approveFilterRequest error:", e.message);
  }

  // Local storage sync
  const curFilters = getLocalCustomFilters();
  if (!curFilters.some(f => f.name.toLowerCase() === filterPayload.name.toLowerCase())) {
    saveLocalCustomFilters([...curFilters, filterPayload]);
  }

  const reqs = getLocalFilterRequests();
  const updatedReqs = reqs.map(r => r.id === requestItem.id ? { ...r, status: "approved" } : r);
  saveLocalFilterRequests(updatedReqs);
}

export async function rejectFilterRequest(requestId) {
  try {
    if (!requestId.startsWith("freq_")) {
      const reqRef = doc(db, "filterRequests", requestId);
      await updateDoc(reqRef, { status: "rejected" });
    }
  } catch (e) {
    console.warn("Firestore rejectFilterRequest error:", e.message);
  }

  const reqs = getLocalFilterRequests();
  const updatedReqs = reqs.map(r => r.id === requestId ? { ...r, status: "rejected" } : r);
  saveLocalFilterRequests(updatedReqs);
}
