/**
 * Utility function to handle Web Share API with fallbacks to Clipboard and WhatsApp share
 */
export async function shareProfile(profile, onShowToast) {
  if (!profile) return;

  const {
    id = '',
    basicInfo = {},
    islamicBackground = {},
    locationFamily = {},
    educationOccupation = {}
  } = profile;

  const fullName = basicInfo.fullName || 'Candidate';
  const ageStr = basicInfo.age ? `${basicInfo.age} Yrs` : '';
  const genderStr = basicInfo.gender || '';
  const qualStr = islamicBackground.qualification ? `, ${islamicBackground.qualification}` : '';
  const profStr = educationOccupation.profession ? `, ${educationOccupation.profession}` : '';
  const distStr = locationFamily.homeDistrict ? `, ${locationFamily.homeDistrict}` : '';

  const shareTitle = `Al-ThayyiBoon Matrimony Proposal - ${fullName}`;
  
  const textSummary = [
    `💍 *Al-ThayyiBoon Matrimony Proposal*`,
    `• *Candidate:* ${fullName}`,
    `• *Gender/Age:* ${genderStr} (${ageStr})`,
    `• *Qualification:* ${islamicBackground.qualification || 'N/A'}`,
    `• *Profession:* ${educationOccupation.profession || 'N/A'}`,
    `• *District:* ${locationFamily.homeDistrict || 'Kerala'}`,
    ``,
    `View full proposal details:`
  ].join('\n');

  const shareUrl = `${window.location.origin}/?profile=${id}`;

  // 1. Try native Web Share API (Mobile Browsers, Chrome, Safari)
  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: textSummary,
        url: shareUrl
      });
      return;
    } catch (err) {
      // User cancelled or share failed, proceed to fallback
      if (err.name !== 'AbortError') {
        console.warn('Web Share failed, using clipboard fallback:', err);
      } else {
        return; // User intentionally cancelled native share sheet
      }
    }
  }

  // 2. Clipboard Fallback
  try {
    const fullShareContent = `${textSummary}\n${shareUrl}`;
    await navigator.clipboard.writeText(fullShareContent);
    if (onShowToast) {
      onShowToast('Proposal details copied to clipboard!');
    } else {
      alert('Proposal details & link copied to clipboard!');
    }
  } catch (clipErr) {
    // 3. Direct WhatsApp Share fallback
    const waText = encodeURIComponent(`${textSummary}\n${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${waText}`, '_blank');
  }
}
