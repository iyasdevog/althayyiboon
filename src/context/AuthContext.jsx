import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut 
} from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

const WALLET_STORAGE_KEY = 'althayyiboon_wallet_credits_v2';
const UNLOCKED_STORAGE_KEY = 'althayyiboon_unlocked_profiles_v2';
const DEMO_USER_KEY = 'althayyiboon_demo_user_v2';
const PRICING_STORAGE_KEY = 'althayyiboon_pricing_config_v2';
const TAXONOMY_STORAGE_KEY = 'althayyiboon_custom_taxonomies_v2';

export const DEFAULT_PRICING = {
  contactUnlockFee: 15, // in INR (1 Credit)
  profileSubmissionFee: 0, // ₹0 during campaign
  campaignMode: true, // When true, submissions are free and campaign holding page is displayed
  campaignEndDate: '2026-11-20T23:59:00', // End date & time defined by admin
  campaignRewardCredits: 3, // Granted at campaign ending date (e.g. 3 contact views)
  whatsappGroupLink: 'https://chat.whatsapp.com/sample-althayyiboon-group',
  whatsappGroupName: 'Al-ThayyiBoon Matrimonial Network',
  razorpayKeyId: '',
  razorpayKeySecret: '',
  whatsappApiKey: '',
  statsVisibility: 'auto', // 'auto' | 'always_show' | 'always_hide'
  statsThreshold: 200 // Threshold for auto-showing profile numbers
};

let _googlePopupInProgress = false;

export function AuthProvider({ children }) {
  // Firebase Auth user
  const [fbUser, setFbUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Active User Account / Persona (Null by default for guest visitors)
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(DEMO_USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear out legacy default demo persona so visitors start unauthenticated
        if (parsed?.uid === 'demo_user_male_01') {
          localStorage.removeItem(DEMO_USER_KEY);
          return null;
        }
        return parsed;
      }
    } catch (e) {
      // fallback
    }
    return null; // Guest visitor by default
  });

  // In-app Wallet Credits
  const [credits, setCredits] = useState(() => {
    try {
      const saved = localStorage.getItem(WALLET_STORAGE_KEY);
      if (saved !== null) return Number(saved);
    } catch (e) {}
    return 3; // 3 free trial credits for new users
  });

  // Unlocked Profile IDs
  const [unlockedProfileIds, setUnlockedProfileIds] = useState(() => {
    try {
      const saved = localStorage.getItem(UNLOCKED_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Dynamic Pricing Controls
  const [pricing, setPricing] = useState(() => {
    try {
      const saved = localStorage.getItem(PRICING_STORAGE_KEY);
      if (saved) return { ...DEFAULT_PRICING, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_PRICING;
  });

  // Custom Taxonomies (Dynamic categories/degrees managed by admin)
  const [customTaxonomies, setCustomTaxonomies] = useState(() => {
    try {
      const saved = localStorage.getItem(TAXONOMY_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      subjectCategories: [],
      degreeNames: []
    };
  });

  // Checkout / Recharge Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingUnlockProfile, setPendingUnlockProfile] = useState(null);

  // Listen to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFbUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(WALLET_STORAGE_KEY, credits.toString());
  }, [credits]);

  useEffect(() => {
    localStorage.setItem(UNLOCKED_STORAGE_KEY, JSON.stringify(unlockedProfileIds));
  }, [unlockedProfileIds]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(userProfile));
    } else {
      localStorage.removeItem(DEMO_USER_KEY);
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(pricing));
  }, [pricing]);

  useEffect(() => {
    localStorage.setItem(TAXONOMY_STORAGE_KEY, JSON.stringify(customTaxonomies));
  }, [customTaxonomies]);

  // Methods
  const switchUserPersona = (personaType) => {
    if (personaType === 'groom' || personaType === 'male') {
      setUserProfile({
        uid: 'user_groom_1',
        name: 'Muhammed Shafi (Groom)',
        email: 'shafi@example.com',
        gender: 'male',
        role: 'groom',
        isDemo: true
      });
    } else if (personaType === 'bride' || personaType === 'female') {
      setUserProfile({
        uid: 'user_bride_1',
        name: 'Fathima Zahra (Bride)',
        email: 'fathima@example.com',
        gender: 'female',
        role: 'bride',
        isDemo: true
      });
    } else if (personaType === 'parent') {
      setUserProfile({
        uid: 'user_parent_1',
        name: 'Haji Abdul Kareem (Parent)',
        email: 'parent.kareem@example.com',
        gender: null,
        role: 'parent',
        isDemo: true
      });
    } else if (personaType === 'admin') {
      setUserProfile({
        uid: 'user_admin_1',
        name: 'Directory Administrator',
        email: 'admin@althayyiboon.com',
        gender: 'all',
        role: 'admin',
        isDemo: true
      });
    } else {
      setUserProfile(null); // Guest / Signed out
    }
  };

  const loginWithGoogle = async (intendedRole = 'groom') => {
    // Guard: prevent a second popup while one is already open (causes auth/cancelled-popup-request)
    if (_googlePopupInProgress) {
      return { success: false, error: 'Sign-in already in progress. Please wait.' };
    }
    _googlePopupInProgress = true;
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      let gender = 'male';
      let role = intendedRole || 'groom';

      if (intendedRole === 'bride') {
        gender = 'female';
        role = 'bride';
      } else if (intendedRole === 'parent') {
        gender = null;
        role = 'parent';
      } else {
        gender = 'male';
        role = 'groom';
      }

      const profile = {
        uid: user.uid,
        name: user.displayName || (role === 'parent' ? 'Parent / Guardian' : role === 'bride' ? 'Bride Member' : 'Groom Member'),
        email: user.email,
        photoURL: user.photoURL,
        gender: gender,
        role: role,
        isDemo: false
      };

      setUserProfile(profile);
      return { success: true, user, profile };
    } catch (err) {
      // auth/cancelled-popup-request is benign — another popup was opened, just ignore it
      if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        console.info('Google sign-in popup cancelled or superseded:', err.code);
        return { success: false, error: null }; // silent, no toast needed
      }
      console.warn("Google Sign-In notice:", err.message);
      return { success: false, error: err.message };
    } finally {
      _googlePopupInProgress = false;
    }
  };

  const loginWithEmailPassword = async (email, password, isSignUp = false, intendedRole = 'groom') => {
    try {
      let result;
      if (isSignUp) {
        result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        result = await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      const user = result.user;
      let gender = intendedRole === 'bride' ? 'female' : 'male';
      let role = intendedRole || 'groom';
      if (intendedRole === 'parent') {
        gender = null;
        role = 'parent';
      }
      const profile = {
        uid: user.uid,
        name: user.displayName || email.split('@')[0],
        email: user.email,
        gender: gender,
        role: role,
        isDemo: false
      };
      setUserProfile(profile);
      return { success: true, user, profile };
    } catch (err) {
      console.warn("Email/Password Sign-In error:", err.message);
      return { success: false, error: err.message };
    }
  };

  const loginWithLegacyCredentials = async (identifier, password, profileList = []) => {
    try {
      const cleanId = (identifier || '').trim().toLowerCase();
      const cleanPass = (password || '').trim();

      if (!cleanId || !cleanPass) {
        return { success: false, error: 'Please enter your username/ID and password.' };
      }

      // Search in profile list
      const matched = profileList.find(p => {
        const pId = (p.id || '').toLowerCase();
        const pUser = (p.loginCredentials?.username || '').toLowerCase();
        const pEmail = (p.email || p.contactPreferences?.email || '').toLowerCase();
        const pPhone = (p.contactDetails?.guardianPhone || p.contactPreferences?.phone || '').replace(/[^0-9]/g, '');
        const cleanInputPhone = cleanId.replace(/[^0-9]/g, '');

        const matchesIdentifier = (pId === cleanId) || 
                                  (pUser === cleanId) || 
                                  (pEmail === cleanId) || 
                                  (cleanInputPhone && pPhone && pPhone.endsWith(cleanInputPhone));

        if (!matchesIdentifier) return false;

        const storedPass = p.loginCredentials?.password || p.security?.editPin || `ALTB@${p.id}`;
        return storedPass === cleanPass;
      });

      if (!matched) {
        return { success: false, error: 'Invalid username, ID or password. Please contact admin if you need credentials.' };
      }

      const isBrideGender = matched.basicInfo?.gender === 'Bride' || matched.gender === 'female';
      const role = isBrideGender ? 'bride' : 'groom';
      const gender = isBrideGender ? 'female' : 'male';

      const profile = {
        uid: matched.id,
        name: matched.basicInfo?.fullName || `Candidate (${matched.id})`,
        email: matched.email || `${matched.id.toLowerCase()}@althayyiboon.com`,
        gender: gender,
        role: role,
        profileId: matched.id,
        isLegacyUser: true,
        isDemo: false,
        linkedProfile: matched
      };

      setUserProfile(profile);
      return { success: true, profile };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {}
    setUserProfile(null);
  };

  const addCredits = (amount) => {
    setCredits((prev) => prev + Number(amount));
  };

  const isContactUnlocked = (profileId) => {
    if (!profileId) return false;
    if (userProfile?.role === 'admin') return true;
    return unlockedProfileIds.includes(profileId);
  };

  const unlockContact = (profile) => {
    const profileId = profile?.id || profile;
    if (!profileId) return { success: false, reason: 'invalid_profile' };

    // Already unlocked
    if (isContactUnlocked(profileId)) {
      return { success: true, alreadyUnlocked: true };
    }

    // Admin bypass
    if (userProfile?.role === 'admin') {
      setUnlockedProfileIds((prev) => [...prev, profileId]);
      return { success: true, adminBypass: true };
    }

    // Check credits
    if (credits >= 1) {
      setCredits((prev) => prev - 1);
      setUnlockedProfileIds((prev) => [...prev, profileId]);
      return { success: true, remainingCredits: credits - 1 };
    }

    // Insufficient credits -> Open recharge checkout
    setPendingUnlockProfile(typeof profile === 'object' ? profile : { id: profileId });
    setIsCheckoutOpen(true);
    return { success: false, reason: 'insufficient_credits' };
  };

  const updatePricingConfig = (newConfig) => {
    setPricing((prev) => ({ ...prev, ...newConfig }));
  };

  const addCustomTaxonomy = (type, value) => {
    if (!value || !value.trim()) return;
    const clean = value.trim();
    setCustomTaxonomies((prev) => {
      const existing = prev[type] || [];
      if (existing.includes(clean)) return prev;
      return { ...prev, [type]: [...existing, clean] };
    });
  };

  const currentUser = userProfile || (fbUser ? {
    uid: fbUser.uid,
    name: fbUser.displayName || 'Member',
    email: fbUser.email,
    photoURL: fbUser.photoURL,
    gender: 'male',
    role: 'user'
  } : null);

  const isAdmin = currentUser?.role === 'admin';
  const isParent = currentUser?.role === 'parent';
  const isGroom = currentUser?.role === 'groom' || (!isParent && !isAdmin && currentUser?.gender === 'male');
  const isBride = currentUser?.role === 'bride' || (!isParent && !isAdmin && currentUser?.gender === 'female');
  const userGender = isParent ? null : (isAdmin ? 'all' : (currentUser?.gender || (isBride ? 'female' : 'male')));

  // Helper to determine if statistics numbers should be shown publicly
  const isStatsNumbersVisible = (totalCount = 0) => {
    const mode = pricing.statsVisibility || 'auto';
    if (mode === 'always_show') return true;
    if (mode === 'always_hide') return false;
    // 'auto' mode: only show if total count >= threshold (default: 200)
    const threshold = Number(pricing.statsThreshold) || 200;
    return (totalCount || 0) >= threshold;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isDemo: Boolean(currentUser?.isDemo),
        isAdmin,
        isParent,
        isGroom,
        isBride,
        userGender, // 'male' | 'female' | 'all' | null (for parent)
        credits,
        unlockedProfileIds,
        isContactUnlocked,
        unlockContact,
        addCredits,
        switchUserPersona,
        loginWithGoogle,
        loginWithEmailPassword,
        loginWithLegacyCredentials,
        logout,
        pricing,
        updatePricingConfig,
        isStatsNumbersVisible,
        customTaxonomies,
        addCustomTaxonomy,
        isCheckoutOpen,
        setIsCheckoutOpen,
        pendingUnlockProfile,
        setPendingUnlockProfile,
        authLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
