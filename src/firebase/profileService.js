import { db } from "./config.js";
import { calculateListingExpiry } from "../utils/profileValidity.js";
import { 
  collection, 
  getDocs, 
  getDoc,
  setDoc,
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  writeBatch,
  query, 
  orderBy, 
  where,
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";

const LOCAL_STORAGE_KEY = "althayyiboon_profiles_v2";
const CUSTOM_FILTERS_KEY = "althayyiboon_custom_filters_v2";
const FILTER_REQUESTS_KEY = "althayyiboon_filter_requests_v2";
const CONNECTION_REQUESTS_KEY = "althayyiboon_connection_requests_v1";

/**
 * Strips sensitive contact details, WhatsApp numbers, edit PINs, and credentials
 * from profile objects before exposing them to non-admin / non-owner clients.
 */
export function sanitizeProfileForPublic(profile, isAdmin = false, currentUid = null) {
  if (!profile) return profile;
  const isOwner = Boolean(currentUid && profile.creatorUid && profile.creatorUid === currentUid);
  if (isAdmin || isOwner) return profile;

  const preferredMethod =
    profile.preferredContactMethod ||
    profile.contactDetails?.preferredContactMethod ||
    profile.contactPreferences?.contactMethod ||
    profile.contactPreferences?.preferredContactMethod ||
    'guardian';

  const {
    security: _sec,
    loginCredentials: _creds,
    whatsappGroupNumber: _wg,
    creatorEmail: _ce,
    ...safeRest
  } = profile;

  const {
    phone: _p,
    whatsapp: _w,
    secretPin: _sp,
    alternateContact: _ac,
    email: _em,
    ...safeContactPrefs
  } = profile.contactPreferences || {};

  return {
    ...safeRest,
    preferredContactMethod: preferredMethod,
    contactDetails: {
      preferredContactMethod: preferredMethod,
      isProtected: true
    },
    contactPreferences: {
      ...safeContactPrefs,
      contactMethod: preferredMethod,
      preferredContactMethod: preferredMethod
    }
  };
}

// Helper to generate search keywords array for Firestore keyword searching
export function generateSearchKeywords(profile) {
  const tokens = new Set();
  
  const fieldsToTokenize = [
    profile.basicInfo?.fullName,
    profile.basicInfo?.gender,
    profile.gender,
    profile.basicInfo?.maritalStatus,
    profile.basicInfo?.color,
    profile.islamicBackground?.qualification,
    ...(Array.isArray(profile.islamicQualification) ? profile.islamicQualification : [profile.islamicQualification]),
    profile.islamicBackground?.sect,
    profile.islamicBackground?.subGroup,
    profile.generalEducation?.level,
    profile.generalEducation?.degreeName,
    profile.generalEducation?.subjectCategory,
    profile.generalEducation?.specialization,
    profile.educationOccupation?.education,
    profile.educationOccupation?.degree,
    profile.educationOccupation?.profession,
    profile.educationOccupation?.workLocation,
    profile.educationOccupation?.workCountry,
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

// Get local storage profiles (offline cache / locally created)
function getLocalStorageProfiles() {
  try {
    // Purge legacy storage keys if present
    ["althayyiboon_profiles_v1"].forEach(k => {
      try { localStorage.removeItem(k); } catch (e) {}
    });

    const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (existing) {
      const parsed = JSON.parse(existing);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Purge any legacy fake seed profiles (e.g. IDs starting with ALTB-10)
        const validProfiles = parsed.filter(p => !p.id || !p.id.startsWith("ALTB-10"));
        if (validProfiles.length !== parsed.length) {
          saveLocalStorageProfiles(validProfiles);
        }
        return validProfiles;
      }
    }
  } catch (e) {
    // fallback
  }
  return [];
}

function saveLocalStorageProfiles(list) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
}

// Helper to merge Firestore profiles with LocalStorage profiles (preserves real offline user profiles)
function mergeProfiles(fsProfiles = []) {
  const localList = getLocalStorageProfiles();
  if (!localList || localList.length === 0) return fsProfiles;

  const fsIds = new Set(fsProfiles.map(p => p.id));
  const merged = [...fsProfiles];
  
  for (const lp of localList) {
    if (!fsIds.has(lp.id) && !lp.id?.startsWith("ALTB-10")) {
      merged.push(lp);
    }
  }
  return merged.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

// ---------------- PROFILES CRUD ---------------- //

// Helper to merge profilePrivate records for Admin views
async function mergeAdminPrivateContacts(profilesList = []) {
  try {
    const privSnap = await getDocs(collection(db, "profilePrivate"));
    if (privSnap.empty) return profilesList;
    const privMap = new Map();
    privSnap.docs.forEach(d => {
      privMap.set(d.id, d.data());
    });
    return profilesList.map(p => {
      const priv = privMap.get(p.id);
      if (!priv) return p;
      return {
        ...p,
        contactDetails: {
          ...(p.contactDetails || {}),
          ...(priv.contactDetails || {}),
          guardianPhone: priv.contactDetails?.guardianPhone || priv.phone || p.contactDetails?.guardianPhone || '',
          whatsappNumber: priv.contactDetails?.whatsappNumber || priv.whatsapp || p.contactDetails?.whatsappNumber || ''
        },
        contactPreferences: {
          ...(p.contactPreferences || {}),
          phone: priv.phone || priv.contactDetails?.guardianPhone || p.contactPreferences?.phone || '',
          whatsapp: priv.whatsapp || priv.contactDetails?.whatsappNumber || p.contactPreferences?.whatsapp || '',
          secretPin: priv.secretPin || p.contactPreferences?.secretPin || ''
        },
        whatsappGroupNumber: priv.whatsappGroupNumber || p.whatsappGroupNumber || '',
        security: priv.editPin ? { ...(p.security || {}), editPin: priv.editPin } : p.security,
        loginCredentials: priv.loginCredentials || p.loginCredentials
      };
    });
  } catch (e) {
    console.warn("Admin private contact merge notice:", e.message);
    return profilesList;
  }
}

export async function fetchProfilesFromStore(authGender = null, isAdmin = false, currentUid = null) {
  try {
    const colRef = collection(db, "profiles");
    let q;

    // Enforce Gender-Based View Lock at query level for authenticated non-admin users
    if (!isAdmin && authGender === 'male') {
      // Male users only see female / Bride profiles
      q = query(colRef, where("gender", "==", "female"), orderBy("createdAt", "desc"));
    } else if (!isAdmin && authGender === 'female') {
      // Female users only see male / Groom profiles
      q = query(colRef, where("gender", "==", "male"), orderBy("createdAt", "desc"));
    } else {
      q = query(colRef, orderBy("createdAt", "desc"));
    }

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      let fsProfiles = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      if (isAdmin) {
        fsProfiles = await mergeAdminPrivateContacts(fsProfiles);
      }
      return mergeProfiles(fsProfiles).map(p => sanitizeProfileForPublic(p, isAdmin, currentUid));
    }
  } catch (err) {
    console.warn("Firestore fetch notice:", err.message);
  }
  return getLocalStorageProfiles().map(p => sanitizeProfileForPublic(p, isAdmin, currentUid));
}

export async function saveProfileToStore(newProfileData) {
  const searchKeywords = generateSearchKeywords(newProfileData);
  const secretPin = newProfileData.security?.editPin || newProfileData.contactPreferences?.secretPin || "1234";

  // Normalize gender to 'male' | 'female'
  const isBride = newProfileData.basicInfo?.gender === 'Bride' || newProfileData.gender === 'female';
  const normalizedGender = isBride ? 'female' : 'male';

  // Normalize Islamic qualifications to string[]
  let normalizedIslamicQual = [];
  if (Array.isArray(newProfileData.islamicQualification)) {
    normalizedIslamicQual = newProfileData.islamicQualification;
  } else if (newProfileData.islamicQualification) {
    normalizedIslamicQual = [newProfileData.islamicQualification];
  } else if (newProfileData.islamicBackground?.qualification) {
    normalizedIslamicQual = [newProfileData.islamicBackground.qualification];
  } else {
    normalizedIslamicQual = ["None"];
  }

  // Normalize general education
  const generalEdu = newProfileData.generalEducation || {
    level: newProfileData.educationOccupation?.level || "Bachelor's Degree (BA, BSc, BCom, BTech, MBBS, etc.)",
    degreeName: newProfileData.educationOccupation?.degree || newProfileData.educationOccupation?.education || "",
    subjectCategory: newProfileData.educationOccupation?.subjectCategory || "Arts & Humanities",
    specialization: newProfileData.educationOccupation?.specialization || ""
  };

  // Normalize contact details (guarded & masked by default)
  const contactDetails = newProfileData.contactDetails || {
    guardianPhone: newProfileData.contactPreferences?.phone || "",
    whatsappNumber: newProfileData.contactPreferences?.whatsapp || ""
  };
  
    const now = new Date();
    const expiresAt = calculateListingExpiry(now, 3).toISOString();
    const preferredMethod =
      newProfileData.preferredContactMethod ||
      contactDetails.preferredContactMethod ||
      newProfileData.contactPreferences?.contactMethod ||
      "guardian";

    // Public-safe payload stored in `profiles` (no raw phone/WhatsApp/PINs/credentials)
    const {
      security: _dropSec,
      loginCredentials: _dropCreds,
      whatsappGroupNumber: _dropWg,
      ...restInput
    } = newProfileData;

    const {
      phone: _dropPhone,
      whatsapp: _dropWa,
      secretPin: _dropPin,
      alternateContact: _dropAlt,
      ...safePrefs
    } = newProfileData.contactPreferences || {};

    const publicDocPayload = {
      ...restInput,
      gender: normalizedGender,
      islamicQualification: normalizedIslamicQual,
      generalEducation: generalEdu,
      preferredContactMethod: preferredMethod,
      contactDetails: {
        preferredContactMethod: preferredMethod,
        isProtected: true
      },
      contactPreferences: {
        ...safePrefs,
        contactMethod: preferredMethod,
        preferredContactMethod: preferredMethod
      },
      status: "approved",
      listingStatus: "active",
      listingDurationMonths: 3,
      createdAt: now.toISOString(),
      expiresAt: expiresAt,
      whatsappRenewalNotified: false,
      searchKeywords
    };

    const fullDocPayload = {
      ...newProfileData,
      gender: normalizedGender,
      islamicQualification: normalizedIslamicQual,
      generalEducation: generalEdu,
      preferredContactMethod: preferredMethod,
      contactDetails: contactDetails,
      contactPreferences: {
        ...newProfileData.contactPreferences,
        secretPin
      },
      security: {
        ...newProfileData.security,
        editPin: secretPin
      },
      status: "approved",
      listingStatus: "active",
      listingDurationMonths: 3,
      createdAt: now.toISOString(),
      expiresAt: expiresAt,
      whatsappRenewalNotified: false,
      searchKeywords
    };

  let savedId = "prof_" + Date.now();

  try {
    const colRef = collection(db, "profiles");
    const docRef = await addDoc(colRef, {
      ...publicDocPayload,
      firestoreTimestamp: serverTimestamp()
    });
    savedId = docRef.id;

    // Store sensitive contact details & PIN in protected `profilePrivate` collection
    await setDoc(doc(db, "profilePrivate", savedId), {
      profileId: savedId,
      contactDetails,
      phone: contactDetails.guardianPhone || newProfileData.contactPreferences?.phone || "",
      whatsapp: contactDetails.whatsappNumber || newProfileData.contactPreferences?.whatsapp || "",
      whatsappGroupNumber: newProfileData.whatsappGroupNumber || "",
      secretPin,
      editPin: secretPin,
      loginCredentials: newProfileData.loginCredentials || null,
      creatorUid: newProfileData.creatorUid || null,
      creatorEmail: newProfileData.creatorEmail || null,
      createdAt: now.toISOString()
    });
  } catch (err) {
    console.warn("Firestore save fallback:", err.message);
  }

  const localList = getLocalStorageProfiles();
  const completeProfile = { ...fullDocPayload, id: savedId };
  saveLocalStorageProfiles([completeProfile, ...localList.filter(p => p.id !== savedId)]);
  return completeProfile;
}

export async function updateProfileInStore(profileId, updatedFields) {
  const searchKeywords = generateSearchKeywords(updatedFields);
  const secretPin = updatedFields.security?.editPin || updatedFields.contactPreferences?.secretPin;

  const {
    security: _dropSec,
    loginCredentials: _dropCreds,
    whatsappGroupNumber: _dropWg,
    contactDetails: updatedContactDetails,
    contactPreferences: updatedContactPrefs,
    ...publicUpdates
  } = updatedFields;

  const {
    phone: _dropPhone,
    whatsapp: _dropWa,
    secretPin: _dropPin,
    alternateContact: _dropAlt,
    ...safePrefs
  } = updatedContactPrefs || {};

  const publicPatchData = {
    ...publicUpdates,
    ...(updatedContactDetails ? {
      contactDetails: {
        preferredContactMethod: updatedContactDetails.preferredContactMethod || safePrefs.contactMethod || 'guardian',
        isProtected: true
      }
    } : {}),
    ...(updatedContactPrefs ? {
      contactPreferences: safePrefs
    } : {}),
    updatedAt: new Date().toISOString(),
    searchKeywords
  };

  const fullPatchData = {
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
    await setDoc(docRef, publicPatchData, { merge: true });

    if (updatedContactDetails || updatedContactPrefs || secretPin || updatedFields.whatsappGroupNumber) {
      const privRef = doc(db, "profilePrivate", profileId);
      await setDoc(privRef, {
        profileId,
        ...(updatedContactDetails ? { contactDetails: updatedContactDetails } : {}),
        ...(updatedContactDetails?.guardianPhone || updatedContactPrefs?.phone
          ? { phone: updatedContactDetails?.guardianPhone || updatedContactPrefs?.phone }
          : {}),
        ...(updatedContactDetails?.whatsappNumber || updatedContactPrefs?.whatsapp
          ? { whatsapp: updatedContactDetails?.whatsappNumber || updatedContactPrefs?.whatsapp }
          : {}),
        ...(updatedFields.whatsappGroupNumber ? { whatsappGroupNumber: updatedFields.whatsappGroupNumber } : {}),
        ...(secretPin ? { secretPin, editPin: secretPin } : {}),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (err) {
    console.warn("Firestore update fallback to local:", err.message);
  }

  const list = getLocalStorageProfiles();
  const index = list.findIndex(p => p.id === profileId);
  if (index !== -1) {
    list[index] = { ...list[index], ...fullPatchData };
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

// Bulk delete using Firestore writeBatch for high throughput
export async function bulkDeleteProfilesFromStore(profileIds = []) {
  if (!profileIds.length) return;
  try {
    const batch = writeBatch(db);
    profileIds.forEach(id => {
      const docRef = doc(db, "profiles", id);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (err) {
    console.warn("Firestore bulk delete fallback to individual:", err.message);
    for (const id of profileIds) {
      await deleteProfileFromStore(id);
    }
  }

  const list = getLocalStorageProfiles();
  const updated = list.filter(p => !profileIds.includes(p.id));
  saveLocalStorageProfiles(updated);
}

// Bulk status update using Firestore writeBatch
export async function bulkUpdateStatusInStore(profileIds = [], newStatus = "approved") {
  if (!profileIds.length) return;
  const patch = { status: newStatus, updatedAt: new Date().toISOString() };
  try {
    const batch = writeBatch(db);
    profileIds.forEach(id => {
      const docRef = doc(db, "profiles", id);
      batch.set(docRef, patch, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.warn("Firestore bulk status update fallback to individual:", err.message);
    for (const id of profileIds) {
      await updateProfileInStore(id, { status: newStatus });
    }
  }

  const list = getLocalStorageProfiles();
  const updated = list.map(p => profileIds.includes(p.id) ? { ...p, ...patch } : p);
  saveLocalStorageProfiles(updated);
}

export function subscribeToProfiles(onDataChange, authGender = null, isAdmin = false, currentUid = null) {
  try {
    const colRef = collection(db, "profiles");
    let q;

    // Enforce Gender-Based View Lock at query level to minimize read operations
    if (!isAdmin && authGender === 'male') {
      q = query(colRef, where("gender", "==", "female"), orderBy("createdAt", "desc"));
    } else if (!isAdmin && authGender === 'female') {
      q = query(colRef, where("gender", "==", "male"), orderBy("createdAt", "desc"));
    } else {
      q = query(colRef, orderBy("createdAt", "desc"));
    }

    return onSnapshot(q, async (snapshot) => {
      if (!snapshot.empty) {
        let fsProfiles = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        if (isAdmin) {
          fsProfiles = await mergeAdminPrivateContacts(fsProfiles);
        }
        onDataChange(mergeProfiles(fsProfiles).map(p => sanitizeProfileForPublic(p, isAdmin, currentUid)));
      } else {
        onDataChange(getLocalStorageProfiles().map(p => sanitizeProfileForPublic(p, isAdmin, currentUid)));
      }
    }, (error) => {
      console.warn("Firestore listener error, falling back to local storage:", error.message);
      onDataChange(getLocalStorageProfiles().map(p => sanitizeProfileForPublic(p, isAdmin, currentUid)));
    });
  } catch (e) {
    console.warn("Subscribe error, falling back to local storage:", e.message);
    onDataChange(getLocalStorageProfiles().map(p => sanitizeProfileForPublic(p, isAdmin, currentUid)));
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

// ---------------- APP SETTINGS / CONFIG (CLOUD PERSISTENCE) ---------------- //

export async function fetchSettingsFromStore() {
  try {
    const docRef = doc(db, "settings", "app_config");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (e) {
    console.warn("Firestore fetchSettings notice:", e.message);
  }
  return null;
}

export async function saveSettingsToStore(settingsData) {
  try {
    const docRef = doc(db, "settings", "app_config");
    await setDoc(docRef, {
      ...settingsData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (e) {
    console.warn("Firestore saveSettings fallback:", e.message);
    return false;
  }
}

export function subscribeToSettings(onSettingsChange) {
  try {
    const docRef = doc(db, "settings", "app_config");
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        onSettingsChange(snap.data());
      }
    }, (err) => {
      console.warn("Firestore settings listener notice:", err.message);
    });
  } catch (e) {
    return () => {};
  }
}

// ---------------- HEALTH CHECK / CONNECTION VERIFICATION ---------------- //

export async function checkFirestoreHealth() {
  try {
    const testDocRef = doc(db, "settings", "health_check");
    await setDoc(testDocRef, {
      lastChecked: new Date().toISOString(),
      status: "online",
      clientVersion: "v2.0"
    }, { merge: true });
    return { success: true, status: "connected", timestamp: new Date().toISOString() };
  } catch (e) {
    return { success: false, status: "error", error: e.message };
  }
}

// ---------------- ADMIN-MEDIATED CONNECTION REQUESTS ---------------- //

function getLocalConnectionRequests() {
  try {
    const saved = localStorage.getItem(CONNECTION_REQUESTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalConnectionRequests(list) {
  try {
    localStorage.setItem(CONNECTION_REQUESTS_KEY, JSON.stringify(list));
  } catch (e) {}
}

export async function submitConnectionRequest(requestData) {
  const now = new Date().toISOString();
  const payload = {
    targetProfileId: requestData.targetProfileId,
    targetCandidateName: requestData.targetCandidateName || 'Candidate',
    targetGender: requestData.targetGender || '',
    targetDistrict: requestData.targetDistrict || '',
    requesterUid: requestData.requesterUid || null,
    requesterProfileId: requestData.requesterProfileId || null,
    requesterName: (requestData.requesterName || '').trim(),
    requesterContact: (requestData.requesterContact || '').trim(),
    requesterEmail: requestData.requesterEmail || null,
    requesterRole: requestData.requesterRole || 'member',
    message: (requestData.message || '').trim(),
    status: "pending",
    createdAt: now
  };

  let id = "creq_" + Date.now();
  try {
    const colRef = collection(db, "connectionRequests");
    const docRef = await addDoc(colRef, {
      ...payload,
      firestoreTimestamp: serverTimestamp()
    });
    id = docRef.id;
  } catch (e) {
    console.warn("Firestore connectionRequest save fallback:", e.message);
  }

  const newItem = { ...payload, id };
  const existing = getLocalConnectionRequests();
  saveLocalConnectionRequests([newItem, ...existing]);
  return newItem;
}

export async function fetchConnectionRequests() {
  try {
    const colRef = collection(db, "connectionRequests");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (e) {
    console.warn("Firestore connectionRequests fetch notice:", e.message);
  }
  return getLocalConnectionRequests();
}

export async function updateConnectionRequestStatus(requestId, status, adminNote = "") {
  const patch = {
    status,
    ...(adminNote ? { adminNote } : {}),
    updatedAt: new Date().toISOString()
  };
  try {
    if (requestId && !requestId.startsWith("creq_")) {
      const docRef = doc(db, "connectionRequests", requestId);
      await updateDoc(docRef, patch);
    }
  } catch (e) {
    console.warn("Firestore updateConnectionRequestStatus notice:", e.message);
  }

  const list = getLocalConnectionRequests();
  saveLocalConnectionRequests(list.map(r => r.id === requestId ? { ...r, ...patch } : r));
}
