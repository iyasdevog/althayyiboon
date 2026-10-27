import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import CampaignPage from '../components/CampaignPage';
import BrowsePage from './BrowsePage';
import { useAuth } from '../context/AuthContext';

export default function HomePage({
  onOpenAddModal,
  onOpenSignIn,
  onOpenWalletModal,
  onOpenPosterModal,
  onOpenEditModal,
  onOpenAdminPortal,
  onRequestFilterModal,
  onShowToast
}) {
  const navigate = useNavigate();
  const { currentUser, switchUserPersona, pricing, isAdmin } = useAuth();

  // Condition 1: Guest Visitor (Not Authenticated)
  if (!currentUser) {
    if (!isAdmin && pricing?.campaignMode) {
      return (
        <CampaignPage
          onOpenAddModal={onOpenAddModal ? onOpenAddModal : () => navigate('/add')}
          onOpenSignIn={(role) => onOpenSignIn ? onOpenSignIn(role) : navigate('/login')}
          onSwitchPersona={(role) => {
            switchUserPersona(role);
            onShowToast?.(`Switched to ${role} demo mode (Sample Data)!`);
            navigate('/profiles');
          }}
          onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')}
        />
      );
    }

    return (
      <LandingPage
        onSignIn={(role) => onOpenSignIn ? onOpenSignIn(role) : navigate('/login')}
        onSwitchPersona={(role) => {
          switchUserPersona(role);
          onShowToast?.(`Switched to ${role} demo mode (Sample Data)!`);
          navigate('/profiles');
        }}
        onOpenAdminPortal={onOpenAdminPortal ? onOpenAdminPortal : () => navigate('/admin')}
      />
    );
  }

  // Condition 3: Authenticated Member or Instant Demo: Show Main Directory
  return (
    <BrowsePage
      onOpenAddModal={onOpenAddModal}
      onOpenSignIn={onOpenSignIn}
      onOpenWalletModal={onOpenWalletModal}
      onOpenPosterModal={onOpenPosterModal}
      onOpenEditModal={onOpenEditModal}
      onOpenAdminPortal={onOpenAdminPortal}
      onRequestFilterModal={onRequestFilterModal}
      onShowToast={onShowToast}
    />
  );
}
