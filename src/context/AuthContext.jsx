import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase/config';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as fbSignOut 
} from 'firebase/auth';

const AuthContext = createContext();

const WALLET_STORAGE_KEY = 'althayyiboon_wallet_credits_v2';
const UNLOCKED_STORAGE_KEY = 'althayyiboon_unlocked_profiles_v2';
const DEMO_USER_KEY = 'althayyiboon_demo_user_v2';
const PRICING_STORAGE_KEY = 'althayyiboon_pricing_config_v2';
const TAXONOMY_STORAGE_KEY = 'althayyiboon_custom_taxonomies_v2';

export const DEFAULT_PRICING = {
  contactUnlockFee: 15, // in INR (1 Credit)
  profileSubmissionFee: 0, // ₹0 during campaign
  campaignMode: true // When true, submissions are free and campaign banner is displayed
};

export function AuthProvider({ children }) {
  // Firebase Auth user
  const [fbUser, setFbUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Active User Persona (Allows easy gender lock testing: 'male' | 'female' | 'admin' | null)
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(DEMO_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    // Default demo persona: Male user looking for Bride (gives initial 3 trial credits)
    return {
      uid: 'demo_user_male_01',
      name: 'Ahmed K.',
      email: 'ahmed.demo@althayyiboon.com',
      gender: 'male', // 'male' or 'female'
      role: 'user', // 'user' or 'admin'
      isDemo: true
    };
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
    if (personaType === 'male') {
      setUserProfile({
        uid: 'user_male_1',
        name: 'Mohammed Shafi',
        email: 'shafi@example.com',
        gender: 'male',
        role: 'user',
        isDemo: true
      });
    } else if (personaType === 'female') {
      setUserProfile({
        uid: 'user_female_1',
        name: 'Fathima Zahra',
        email: 'fathima@example.com',
        gender: 'female',
        role: 'user',
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

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUserProfile({
        uid: user.uid,
        name: user.displayName || 'Community Member',
        email: user.email,
        photoURL: user.photoURL,
        gender: userProfile?.gender || 'male', // default or persist
        role: 'user',
        isDemo: false
      });
      return { success: true, user };
    } catch (err) {
      console.warn("Google Sign-In notice:", err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
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

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        userGender: currentUser?.gender || null, // 'male' | 'female' | 'all'
        credits,
        unlockedProfileIds,
        isContactUnlocked,
        unlockContact,
        addCredits,
        switchUserPersona,
        loginWithGoogle,
        logout,
        pricing,
        updatePricingConfig,
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
