/**
 * Utilities for 3-Month Profile Validity, WhatsApp Renewal Notifications,
 * and Monthly Data Collection Campaign Perks.
 */

export const LISTING_DURATION_MONTHS = 3;
export const LISTING_DURATION_DAYS = 90;
export const RENEWAL_WARNING_DAYS = 15;

export const ADMIN_EMAILS = [
  'admin@althayyiboon.com',
  'althayyiboon@gmail.com',
  'iyasdevog@gmail.com'
];

/**
 * Checks whether the current user is fully registered to browse listings.
 * Registered candidates, authorized administrators, and demo persona testers are allowed.
 * Unregistered signed-in candidates MUST register before viewing the directory.
 */
export function isUserRegistered(user, rawProfiles = []) {
  if (!user) return false;
  if (user.isDemo) return true;
  if (user.role === 'admin' || user.isAdmin) return true;
  if (user.email && ADMIN_EMAILS.some(e => e.toLowerCase() === user.email.toLowerCase())) {
    return true;
  }
  if (user.hasRegisteredProfile) return true;
  if (user.isLegacyUser) return true;
  if (!Array.isArray(rawProfiles)) return false;

  return rawProfiles.some(p => {
    if (!p) return false;
    const pCreatorUid = p.creatorUid;
    const pCreatorEmail = (p.creatorEmail || '').toLowerCase();
    const pEmail = (p.email || p.contactPreferences?.email || '').toLowerCase();
    const uEmail = (user.email || '').toLowerCase();

    if (pCreatorUid && user.uid && pCreatorUid === user.uid) return true;
    if (uEmail && (pCreatorEmail === uEmail || pEmail === uEmail)) return true;
    if (user.profileId && String(p.id).toLowerCase() === String(user.profileId).toLowerCase()) return true;
    return false;
  });
}

export const MONTHLY_CAMPAIGN_PERKS = [
  {
    title: '100% Free Registration (₹0)',
    titleMl: 'പൂർണ്ണമായും സൗജന്യ രജിസ്ട്രേഷൻ (₹0)',
    desc: 'No profile listing or submission fees during the monthly 1-2 day data collection drive.',
    icon: 'Gift'
  },
  {
    title: '3 Free Contact Unlock Credits',
    titleMl: '3 സൗജന്യ കോൺടാക്റ്റ് അൺലോക്കുകൾ',
    desc: 'Instant complimentary credits to view verified guardian phone & WhatsApp contacts.',
    icon: 'Coins'
  },
  {
    title: '3 Months Verified Active Listing',
    titleMl: '3 മാസത്തെ പരിശോധിച്ച ആക്ടീവ് ലിസ്റ്റിംഗ്',
    desc: 'Profile published in verified Islamic & Academic directory for 90 days.',
    icon: 'ShieldCheck'
  },
  {
    title: 'WhatsApp Broadcast Community',
    titleMl: 'വാട്സാപ്പ് കമ്മ്യൂണിറ്റി അലേർട്ടുകൾ',
    desc: 'Direct proposal matching alerts delivered to verified parents & candidates on WhatsApp.',
    icon: 'MessageSquare'
  }
];

/**
 * Calculates the expiry date 3 months from a creation date.
 */
export function calculateListingExpiry(createdDate = new Date(), months = LISTING_DURATION_MONTHS) {
  const d = new Date(createdDate);
  if (isNaN(d.getTime())) {
    const fallback = new Date();
    fallback.setMonth(fallback.getMonth() + months);
    return fallback;
  }
  const expiry = new Date(d);
  expiry.setMonth(expiry.getMonth() + months);
  return expiry;
}

/**
 * Evaluates profile validity and renewal status.
 */
export function getProfileValidity(profile) {
  if (!profile) {
    return {
      isValid: false,
      daysRemaining: 0,
      isExpired: false,
      isRenewalDue: false,
      expiryDateFormatted: 'N/A',
      status: 'unknown'
    };
  }

  const createdTime = profile.createdAt ? new Date(profile.createdAt).getTime() : Date.now();
  const expiryTime = profile.expiresAt 
    ? new Date(profile.expiresAt).getTime() 
    : createdTime + (LISTING_DURATION_DAYS * 24 * 60 * 60 * 1000);

  const now = Date.now();
  const msRemaining = expiryTime - now;
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
  const isExpired = daysRemaining <= 0;
  const isRenewalDue = daysRemaining > 0 && daysRemaining <= RENEWAL_WARNING_DAYS;

  const expiryDateObj = new Date(expiryTime);
  const expiryDateFormatted = expiryDateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  let status = 'active';
  let statusBadge = {
    label: `${daysRemaining}d left`,
    labelLong: `Active (${daysRemaining} days left)`,
    color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  };

  if (isExpired) {
    status = 'expired';
    statusBadge = {
      label: 'Renewal Due',
      labelLong: '3-Month Period Ended • Renewal Due',
      color: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
    };
  } else if (isRenewalDue) {
    status = 'renewal_due';
    statusBadge = {
      label: `${daysRemaining}d left`,
      labelLong: `Renewal Due in ${daysRemaining} days`,
      color: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    };
  }

  return {
    isValid: !isExpired,
    daysRemaining,
    isExpired,
    isRenewalDue,
    expiryDate: expiryDateObj,
    expiryDateFormatted,
    status,
    statusBadge
  };
}

/**
 * Generates formatted WhatsApp renewal reminder text.
 */
export function generateWhatsAppRenewalMessage(profile, pricing = {}) {
  const candidateName = profile.basicInfo?.fullName || (profile.gender === 'female' ? 'Bride Proposal' : 'Groom Proposal');
  const guardianName = profile.contactPreferences?.guardianName || 'Guardian';
  const profileId = profile.id || 'ALTB';
  const renewalFee = pricing.renewalFee || 199;
  const standardFee = pricing.profileSubmissionFee || 499;

  const msg = 
`*Al-ThayyiBoon Matrimonial Network* 🌿
_Direct Verified Islamic & Academic Matrimony_

السلام عليكم ورحمة الله وبركاته
Dear *${guardianName}* (Regarding Candidate: *${candidateName}* | ID: *${profileId}*),

Your matrimonial listing has completed its *3-Month Active Period* on Al-ThayyiBoon. 

To maintain 100% genuine, updated proposals and protect candidate privacy, our platform requires a 3-month validity renewal to verify if you are still searching for alliances.

📌 *Renewal Options:*
1️⃣ *Still searching?* Renew your verified listing for another 3 months for just *₹${renewalFee}* (Special Renewal Price, Regular ₹${standardFee}).
2️⃣ *Alliance fixed or married?* Reply to let us know so we can celebrate and archive your profile!
3️⃣ *Pause temporarily?* Reply "PAUSE" to hide your proposal.

Reply directly to this WhatsApp message to renew or update your listing.

Jazakumullahu Khairan,
*Al-ThayyiBoon Matrimony Admin Team*
🌐 althayyiboon.web.app`;

  return msg;
}

/**
 * Checks if current day of month falls on the 1-2 day monthly data collection campaign.
 */
export function isMonthlyCampaignActiveToday(campaignDays = [1, 2]) {
  const currentDayOfMonth = new Date().getDate();
  return Array.isArray(campaignDays) && campaignDays.includes(currentDayOfMonth);
}
