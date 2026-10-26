import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPortalModal from '../components/AdminPortalModal';
import { useProfiles } from '../context/ProfilesContext';

export default function AdminPage({
  onSelectEditProfile,
  onShowToast
}) {
  const navigate = useNavigate();
  const {
    rawProfiles,
    deleteProfile,
    updateProfile,
    bulkDeleteProfiles,
    bulkUpdateStatus,
    filterRequests,
    handleApproveFilterRequest,
    handleRejectFilterRequest
  } = useProfiles();

  const handleClose = () => {
    navigate('/profiles');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminPortalModal
        onClose={handleClose}
        profiles={rawProfiles}
        onDeleteProfile={deleteProfile}
        onUpdateProfile={updateProfile}
        onBulkDelete={bulkDeleteProfiles}
        onBulkUpdateStatus={bulkUpdateStatus}
        onSelectEditProfile={onSelectEditProfile}
        filterRequests={filterRequests}
        onApproveFilterRequest={handleApproveFilterRequest}
        onRejectFilterRequest={handleRejectFilterRequest}
      />
    </div>
  );
}
