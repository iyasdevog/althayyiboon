import React, { createContext, useContext } from 'react';
import { useProfiles as useProfilesHook } from '../hooks/useProfiles';

const ProfilesContext = createContext(null);

export function ProfilesProvider({ children }) {
  const profileState = useProfilesHook();
  return (
    <ProfilesContext.Provider value={profileState}>
      {children}
    </ProfilesContext.Provider>
  );
}

export function useProfiles() {
  const context = useContext(ProfilesContext);
  if (!context) {
    throw new Error('useProfiles must be used within a ProfilesProvider');
  }
  return context;
}
