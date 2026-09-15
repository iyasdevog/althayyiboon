import React, { useEffect, useRef } from 'react';

/**
 * AdUnit — Google AdSense display unit
 *
 * Props:
 *   slot      — AdSense ad slot ID (from your AdSense dashboard)
 *   format    — "auto" | "rectangle" | "horizontal" | "vertical"  (default "auto")
 *   className — wrapper className for sizing/spacing
 *   label     — show "Advertisement" label above the ad (default true)
 *
 * Usage:
 *   <AdUnit slot="1234567890" format="horizontal" />
 *
 * Requirements:
 *   1. Replace YOUR_ADSENSE_PUB_ID in index.html with your real ca-pub-XXXXXXXX
 *   2. Set VITE_ADSENSE_PUB_ID in your .env file (or Vercel env vars)
 *   3. Remove the disabled check below once AdSense is approved
 */

// ──────────────────────────────────────────────
// 🔧  SET YOUR PUBLISHER ID HERE  (or via env)
const PUB_ID = import.meta.env.VITE_ADSENSE_PUB_ID || 'ca-pub-XXXXXXXXXXXXXXXX';
const ADS_ENABLED = PUB_ID !== 'ca-pub-XXXXXXXXXXXXXXXX';
// ──────────────────────────────────────────────

export default function AdUnit({
  slot,
  format = 'auto',
  className = '',
  label = true,
  responsive = true,
}) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADS_ENABLED || pushed.current) return;
    try {
      // Push ad after mount
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      // AdSense not loaded yet (dev mode / ad blocker)
    }
  }, []);

  // Dev / unapproved mode — render a subtle placeholder so layout is intact
  if (!ADS_ENABLED) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        {label && (
          <p className="text-[9px] font-semibold text-slate-600 uppercase tracking-widest mb-1">
            Advertisement
          </p>
        )}
        <div className="w-full h-full min-h-[90px] rounded-xl border border-dashed border-slate-800 bg-slate-900/40 flex items-center justify-center">
          <span className="text-[10px] text-slate-700 font-medium">Ad placeholder — add your publisher ID</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {label && (
        <p className="text-[9px] font-semibold text-slate-600 uppercase tracking-widest mb-1">
          Advertisement
        </p>
      )}
      <ins
        ref={adRef}
        className="adsbygoogle block w-full"
        style={{ display: 'block' }}
        data-ad-client={PUB_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
