import React, { useState, useRef } from 'react';
import { 
  X, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Upload, 
  Sparkles, 
  Phone, 
  User,
  Heart,
  BookOpen
} from 'lucide-react';
import { toPng } from 'html-to-image';

const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// SVG Artwork for Bride: Pure Black Abaya, Backside View, Left Positioned, 2x Zoom, Zero Gold
const BRIDE_BACKSIDE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGradB" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%2309101f"/>
      <stop offset="50%" stop-color="%23130c22"/>
      <stop offset="100%" stop-color="%23051610"/>
    </linearGradient>
    <linearGradient id="goldB" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="%23f59e0b"/>
      <stop offset="50%" stop-color="%23fef08a"/>
      <stop offset="100%" stop-color="%23d97706"/>
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(%23bgGradB)"/>
  <!-- Arch Frame -->
  <path d="M 20 600 L 20 180 A 180 180 0 0 1 380 180 L 380 600 Z" fill="none" stroke="url(%23goldB)" stroke-width="2" opacity="0.35"/>

  <!-- PURE BLACK ABAYA (BACKSIDE VIEW, LEFT ALIGNED, 2X ZOOMED CLOSE-UP) -->
  <g transform="translate(-30, -20) scale(1.35)">
    <!-- Deep Pure Black Abaya Base -->
    <path d="M 140 480 L -10 480 C -15 370 10 230 50 170 Q 110 140 170 170 C 210 230 230 370 220 480 Z" fill="%2304060a"/>
    <!-- Outer Layers / Pure Black Sheila Veil -->
    <path d="M 70 160 Q 110 130 150 160 Q 180 270 190 480 L 30 480 Q 40 270 70 160 Z" fill="%230a0e17"/>
    <!-- Head silhouette covered in pure jet-black Sheila/Hijab from rear -->
    <path d="M 80 160 Q 110 100 140 160 Q 145 200 75 200 Z" fill="%23020305"/>
  </g>

  <rect x="20" y="525" width="360" height="38" rx="12" fill="%2304060a" stroke="url(%23goldB)" stroke-width="1.5"/>
  <text x="200" y="549" font-family="sans-serif" font-size="13" fill="%23fef08a" text-anchor="middle" font-weight="bold">PURE BLACK ABAYA (BACKSIDE 2X ZOOM)</text>
</svg>`;

// SVG Artwork for Groom: Young Handsome Kerala Sunni Scholar / Young Usthad (Left Aligned, 2x Zoom)
const GROOM_KERALA_SCHOLAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGradG" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%23043829"/>
      <stop offset="50%" stop-color="%2302241a"/>
      <stop offset="100%" stop-color="%230a1628"/>
    </linearGradient>
    <linearGradient id="goldG" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="%23f59e0b"/>
      <stop offset="50%" stop-color="%23fef08a"/>
      <stop offset="100%" stop-color="%23d97706"/>
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(%23bgGradG)"/>
  <!-- Arch Frame -->
  <path d="M 20 600 L 20 180 A 180 180 0 0 1 380 180 L 380 600 Z" fill="none" stroke="url(%23goldG)" stroke-width="2" opacity="0.35"/>

  <!-- YOUNG HANDSOME KERALA USTHAD (LEFT ALIGNED, 2X ZOOMED) -->
  <g transform="translate(-40, -30) scale(1.35)">
    <!-- White Jubba Body -->
    <path d="M 30 480 L 40 280 Q 50 230 140 220 Q 230 230 240 280 L 250 480 Z" fill="%23ffffff"/>
    <!-- Collar & Neck -->
    <path d="M 110 220 L 170 220 L 160 260 L 120 260 Z" fill="%23f1f5f9"/>
    <!-- Young Handsome Face & Skin Tone -->
    <ellipse cx="140" cy="175" rx="30" ry="36" fill="%23f5d0b0"/>
    <!-- Neat Young Beard -->
    <path d="M 112 175 Q 140 230 168 175 Q 165 212 140 215 Q 115 212 112 175 Z" fill="%231e293b"/>
    <!-- Crisp White Kerala Turban (Rumal/ തലപ്പാവ്) -->
    <path d="M 102 155 Q 140 100 178 155 Q 188 125 140 105 Q 92 125 102 155 Z" fill="%23ffffff" stroke="url(%23goldG)" stroke-width="1.8"/>
    <path d="M 107 148 Q 140 120 173 148" fill="none" stroke="%23cbd5e1" stroke-width="1.5"/>
  </g>

  <rect x="20" y="525" width="360" height="38" rx="12" fill="%2306241a" stroke="url(%23goldG)" stroke-width="1.5"/>
  <text x="200" y="549" font-family="sans-serif" font-size="13" fill="%23fef08a" text-anchor="middle" font-weight="bold">YOUNG KERALA SCHOLAR (2X ZOOM)</text>
</svg>`;

export default function SharePosterModal({ profile = null, onClose, onShowToast }) {
  const cardRef = useRef(null);

  // Default initial profile state
  const initialGender = profile?.basicInfo?.gender === "Bride" ? "Bride" : "Groom";
  const [activeGender, setActiveGender] = useState(initialGender);
  const [lang, setLang] = useState("ml"); // 'ml' (Malayalam) or 'en' (English)
  const [aspectRatio, setAspectRatio] = useState("4:5"); // '4:5' or '9:16'
  const [customPhoto, setCustomPhoto] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Profile data extraction with defaults
  const basicInfo = profile?.basicInfo || {};
  const islamicBackground = profile?.islamicBackground || {};
  const locationFamily = profile?.locationFamily || {};
  const educationOccupation = profile?.educationOccupation || {};
  const contactPreferences = profile?.contactPreferences || {};

  const isBride = activeGender === "Bride";

  // Proposal ID
  const proposalId = profile?.id ? profile.id.slice(0, 7).toUpperCase() : (isBride ? "B12512" : "G12512");
  const phoneNo = contactPreferences.phone || contactPreferences.whatsapp || "9037429908";

  // Photo to display (User uploaded > SVG Fallback)
  const displayPhoto = customPhoto || (isBride ? BRIDE_BACKSIDE_SVG : GROOM_KERALA_SCHOLAR_SVG);

  // Handle custom image upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setCustomPhoto(uploadEvent.target.result);
        if (onShowToast) onShowToast("Custom photo loaded on poster!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate PNG image blob from element
  const generatePosterBlob = async () => {
    if (!cardRef.current) return null;
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High resolution
        quality: 0.98,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      return dataUrl;
    } catch (err) {
      console.error('Poster generation failed:', err);
      return null;
    }
  };

  // Download HD Image
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await generatePosterBlob();
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `Al-ThayyiBoon_${isBride ? 'Bride' : 'Groom'}_${proposalId}.png`;
        link.href = dataUrl;
        link.click();
        if (onShowToast) onShowToast("Poster image downloaded successfully!");
      }
    } catch (e) {
      alert("Download failed. Please try again or take a screenshot.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Image to Clipboard directly
  const handleCopyImage = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await generatePosterBlob();
      if (dataUrl) {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        if (onShowToast) onShowToast("Poster image copied to clipboard!");
      }
    } catch (err) {
      handleDownload();
    } finally {
      setIsGenerating(false);
    }
  };

  // Caption text formatted for Instagram & Facebook
  const getSocialCaption = () => {
    const shareUrl = `${window.location.origin}/?profile=${profile?.id || ''}`;
    return lang === 'ml' ? 
`💍 *Al-ThayyiBoon Matrimony Proposal (${proposalId})*
📍 *${isBride ? 'വധുവിന്റെ വിവരങ്ങൾ' : 'വരന്റെ വിവരങ്ങൾ (Young Kerala Scholar)'}:*
• പ്രായം: ${basicInfo.age || '28'} വയസ്സ് | ഉയരം: ${basicInfo.height || '168 cm'}
• സ്ഥലം: ${locationFamily.homeDistrict || 'Kozhikode'}, ${locationFamily.nativePlace || 'Kerala'}
• വിദ്യാഭ്യാസം: ${educationOccupation.education || 'Degree'}
• മത പഠനം: ${islamicBackground.qualification || 'Hadiya / Sunni'}
• തൊഴിൽ: ${educationOccupation.profession || 'Not Specified'}

✨ *പ്രതീക്ഷിക്കുന്നത്:*
• പ്രായം: ${isBride ? '30 - 35' : '20 - 27'} | സ്ഥലം: ${locationFamily.homeDistrict || 'Kerala'}
• ആദർശം: ${islamicBackground.sect || 'Sunni'}

📞 *ബന്ധപ്പെടാൻ:* ${phoneNo}
🔗 *പൂർണ്ണ വിവരങ്ങൾക്ക്:* ${shareUrl}

#niqabi #proposals #kerala #sunni #matrimony #althayyiboon #nikah #keralamatrimony` 
: 
`💍 *Al-ThayyiBoon Matrimony Proposal (${proposalId})*
📍 *${isBride ? 'Bride Details (Pure Black Abaya)' : 'Groom Details (Young Kerala Scholar)'}:*
• Age: ${basicInfo.age || '28'} Yrs | Height: ${basicInfo.height || '168 cm'}
• Location: ${locationFamily.homeDistrict || 'Kerala'}, ${locationFamily.nativePlace || 'Native'}
• Education: ${educationOccupation.education || 'Degree'}
• Islamic Qualification: ${islamicBackground.qualification || 'Sunni'}
• Profession: ${educationOccupation.profession || 'Not Specified'}

✨ *Expectations:*
• Preferred Age: ${isBride ? '30 - 35' : '20 - 27'} | District: ${locationFamily.homeDistrict || 'Kerala'}
• Ideology: ${islamicBackground.sect || 'Sunni'}

📞 *Contact:* ${phoneNo}
🔗 *Full Profile:* ${shareUrl}

#niqabi #proposals #kerala #sunni #matrimony #althayyiboon #nikah`;
  };

  // Share to Facebook Action
  const handleFacebookShare = async () => {
    const shareUrl = encodeURIComponent(`${window.location.origin}/?profile=${profile?.id || ''}`);
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${encodeURIComponent(getSocialCaption())}`;
    
    try {
      await navigator.clipboard.writeText(getSocialCaption());
      if (onShowToast) onShowToast("Post text copied! Opening Facebook...");
    } catch {}

    window.open(fbUrl, '_blank', 'width=600,height=500');
  };

  // Share to Instagram / Download & Copy Caption
  const handleInstagramShare = async () => {
    setIsGenerating(true);
    try {
      await navigator.clipboard.writeText(getSocialCaption());
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 3000);

      await handleDownload();

      if (onShowToast) {
        onShowToast("Poster image downloaded & caption copied! Upload to Instagram.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity"
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 my-4 max-h-[96vh] flex flex-col">
        
        {/* Modal Controls Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Social Media Poster Generator
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  FB & Instagram Ready
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Bride: Pure Black Abaya (Backside 2x Zoom) • Groom: Young Kerala Scholar (2x Zoom)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Toolbar */}
        <div className="p-3 bg-slate-900 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          
          {/* Gender Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveGender("Bride");
                setCustomPhoto(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                isBride ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              👰 Bride (Pure Black Abaya)
            </button>
            <button
              onClick={() => {
                setActiveGender("Groom");
                setCustomPhoto(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                !isBride ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              👳‍♂️ Groom (Young Kerala Usthad)
            </button>
          </div>

          {/* Language Switch */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setLang("ml")}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                lang === "ml" ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'
              }`}
            >
              മലയാളം (Malayalam)
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                lang === "en" ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'
              }`}
            >
              English
            </button>
          </div>

          {/* Ratio Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setAspectRatio("4:5")}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                aspectRatio === "4:5" ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'
              }`}
            >
              Instagram Post (4:5)
            </button>
            <button
              onClick={() => setAspectRatio("9:16")}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                aspectRatio === "9:16" ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'
              }`}
            >
              Story (9:16)
            </button>
          </div>

          {/* Custom Photo Upload */}
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors">
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>

        {/* Modal Scrollable Body with Card Canvas & Actions */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 bg-slate-950/60 custom-scrollbar">
          
          {/* POSTER CARD CANVAS ELEMENT TO CAPTURE */}
          <div className="w-full flex items-center justify-center p-2 sm:p-4">
            
            <div 
              ref={cardRef}
              id="matrimony-poster-canvas"
              className={`relative overflow-hidden shadow-2xl transition-all duration-300 ${
                aspectRatio === "9:16" 
                  ? 'w-[360px] sm:w-[420px] min-h-[740px] sm:min-h-[820px]' 
                  : 'w-[360px] sm:w-[440px] min-h-[600px] sm:min-h-[660px]'
              }`}
              style={{
                background: 'linear-gradient(135deg, #051610 0%, #0c2b20 40%, #03150d 100%)',
                borderRadius: '24px',
                border: '3px solid #d97706',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              
              {/* TOP HEADER: GOLD ISLAMIC DOME ARCH BANNER */}
              <div className="relative pt-4 px-4 pb-2 text-center border-b border-amber-500/30 bg-gradient-to-b from-amber-950/50 via-emerald-950/40 to-transparent">
                
                {/* Gold Arch Decorative SVG Header */}
                <div className="flex items-center justify-center gap-2 mb-1">
                  <svg className="w-8 h-8 text-amber-400" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 5 C30 25 20 45 20 70 L80 70 C80 45 70 25 50 5 Z" fill="none" stroke="#f59e0b" strokeWidth="4" />
                    <circle cx="50" cy="18" r="4" fill="#fde047" />
                    <path d="M50 25 L50 65" stroke="#f59e0b" strokeWidth="3" />
                  </svg>
                  <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide uppercase bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent drop-shadow-sm font-serif">
                      AL-THAYYIBOON
                    </h2>
                    <p className="text-[10px] text-amber-200/90 tracking-widest font-semibold uppercase">
                      PROPOSALS • RIGHTEOUS ALLIANCES
                    </p>
                  </div>
                  <svg className="w-8 h-8 text-amber-400" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 5 C30 25 20 45 20 70 L80 70 C80 45 70 25 50 5 Z" fill="none" stroke="#f59e0b" strokeWidth="4" />
                    <circle cx="50" cy="18" r="4" fill="#fde047" />
                    <path d="M50 25 L50 65" stroke="#f59e0b" strokeWidth="3" />
                  </svg>
                </div>

                {/* ID Pill Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-400/50 shadow-inner my-1">
                  <span className="text-xs font-black tracking-widest text-amber-200">
                    ID: {proposalId}
                  </span>
                </div>

                {/* Looking for Bride / Groom Malayalam Header Banner */}
                <div className="mt-1">
                  <span className="inline-block px-4 py-1 rounded-xl bg-gradient-to-r from-rose-900/80 via-rose-800 to-rose-900/80 border border-rose-400/40 text-rose-100 font-extrabold text-sm sm:text-base shadow-md">
                    ❁ {isBride ? (lang === 'ml' ? 'വരനെ തേടുന്നു' : 'Looking for Groom') : (lang === 'ml' ? 'വധുവിനെ തേടുന്നു' : 'Looking for Bride')} ❁
                  </span>
                </div>

              </div>

              {/* CARD SPLIT MAIN CONTENT */}
              <div className="flex p-3 sm:p-4 gap-3 items-stretch">
                
                {/* LEFT SIDE PHOTO CONTAINER (2X ZOOMED, LEFT-ALIGNED) */}
                <div className="w-[40%] shrink-0 flex flex-col justify-between items-center rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-950 relative shadow-lg">
                  
                  {/* Image Display with 2x Zoom and Left Positioning */}
                  <div className="w-full h-full overflow-hidden relative" style={{ minHeight: aspectRatio === "9:16" ? '440px' : '360px' }}>
                    <img 
                      src={displayPhoto} 
                      alt={isBride ? "Pure Black Abaya Bride Backside View" : "Young Kerala Scholar Groom Photo"}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = isBride ? BRIDE_BACKSIDE_SVG : GROOM_KERALA_SCHOLAR_SVG;
                      }}
                      className="w-full h-full object-cover rounded-2xl scale-[1.3] origin-left-center"
                    />
                  </div>

                  {/* Modest Overlay Label */}
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded-xl border border-amber-400/40 text-center z-10">
                    <p className="text-[10px] font-bold text-amber-300">
                      {isBride ? (lang === 'ml' ? 'സുന്നി വധു (Black Abaya)' : 'Pure Black Abaya Bride') : (lang === 'ml' ? 'യുവാവായ സുന്നി പണ്ഡിതൻ' : 'Young Kerala Usthad')}
                    </p>
                  </div>
                </div>

                {/* RIGHT SIDE: DETAILS PANELS (MALAYALAM & ENGLISH) */}
                <div className="flex-1 flex flex-col justify-between gap-2.5">
                  
                  {/* BOX 1: CANDIDATE INFORMATION */}
                  <div className="bg-slate-900/90 p-3 rounded-2xl border border-amber-500/30 shadow-md">
                    <div className="flex items-center gap-1.5 pb-1 mb-2 border-b border-amber-500/20 text-amber-300 font-bold text-xs sm:text-sm">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isBride ? (lang === 'ml' ? 'വധുവിന്റെ വിവരങ്ങൾ' : 'Bride Details') : (lang === 'ml' ? 'വരന്റെ വിവരങ്ങൾ' : 'Groom Details')}</span>
                    </div>

                    <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">☪</span>
                        <span>{islamicBackground.sect || 'സുന്നി'} {islamicBackground.subGroup ? `(${islamicBackground.subGroup})` : ''}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-rose-400 font-bold">💍</span>
                        <span>{basicInfo.maritalStatus || 'പുനർവിവാഹം / Unmarried'}</span>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">📍</span>
                        <span>{lang === 'ml' ? 'സ്ഥലം' : 'Place'} - {locationFamily.homeDistrict || 'Kozhikode'}, {locationFamily.nativePlace || 'Kerala'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-300 font-bold">🎂</span>
                        <span>{lang === 'ml' ? 'വയസ്സ്' : 'Age'} - {basicInfo.age || '28'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-300 font-bold">📏</span>
                        <span>{lang === 'ml' ? 'ഉയരം' : 'Height'} - {basicInfo.height || '168 cm'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-teal-300 font-bold">💰</span>
                        <span>{lang === 'ml' ? 'സാമ്പത്തികം' : 'Financial'} - {locationFamily.financialStatus || 'Upper Middle class'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-indigo-300 font-bold">👤</span>
                        <span>{lang === 'ml' ? 'ശരീരരൂപം' : 'Physique'} - {basicInfo.physicalStatus || 'Normal'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-rose-300 font-bold">🎓</span>
                        <span>{lang === 'ml' ? 'വിദ്യാഭ്യാസം' : 'Education'} - {educationOccupation.education || 'Degree'}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                        <BookOpen className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{lang === 'ml' ? 'മത പഠനം' : 'Islamic Ed.'} - {islamicBackground.qualification || 'Hadiya / Diploma'}</span>
                      </div>
                    </div>
                  </div>

                  {/* BOX 2: EXPECTATIONS */}
                  <div className="bg-slate-900/90 p-3 rounded-2xl border border-amber-500/30 shadow-md">
                    <div className="flex items-center gap-1.5 pb-1 mb-2 border-b border-amber-500/20 text-emerald-300 font-bold text-xs sm:text-sm">
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
                      <span>{isBride ? (lang === 'ml' ? 'വരനിൽ പ്രതീക്ഷിക്കുന്നത്' : 'Expected in Groom') : (lang === 'ml' ? 'വധുവിൽ പ്രതീക്ഷിക്കുന്നത്' : 'Expected in Bride')}</span>
                    </div>

                    <div className="space-y-1 text-[11px] sm:text-xs text-slate-200">
                      <div>
                        <span className="text-amber-300 font-semibold">{lang === 'ml' ? 'വയസ്സ്' : 'Age'}:</span> {isBride ? '30 - 35' : '20 - 27'}
                      </div>
                      <div>
                        <span className="text-amber-300 font-semibold">{lang === 'ml' ? 'ദൂരം / സ്ഥലം' : 'Location'}:</span> {locationFamily.homeDistrict || 'Kozhikode / Open'}
                      </div>
                      <div>
                        <span className="text-amber-300 font-semibold">{lang === 'ml' ? 'ആദർശം' : 'Ideology'}:</span> {islamicBackground.sect || 'AP Sunni'}
                      </div>
                      <div className="line-clamp-2">
                        <span className="text-amber-300 font-semibold">{lang === 'ml' ? 'മറ്റു ഡിമാൻഡ്‌സ്' : 'Demands'}:</span> {contactPreferences.expectations || (lang === 'ml' ? 'ദീനി ആയ അനുയോജ്യമായ കുടുംബത്തിൽ നിന്നുള്ളവർ.' : 'Religious suitable family.')}
                      </div>
                      <div className="text-[10px] text-emerald-300 font-bold mt-0.5">
                        ⭐ {lang === 'ml' ? 'ഉസ്താദുമാർക്ക് / ദീനീ യോഗ്യതക്ക് മുൻഗണന.' : 'Priority for Young Kerala Islamic Scholars / Usthad candidates.'}
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* WARNING BADGE */}
              <div className="mx-3 my-1">
                <div className="bg-rose-950/80 border border-rose-500/40 rounded-xl py-1.5 px-3 text-center">
                  <p className="text-rose-200 font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1.5">
                    <span>⚠️</span>
                    <span>{lang === 'ml' ? 'സുന്നികൾ മാത്രം കോൺടാക്ട് ചെയ്യുക' : 'Only Sunni Candidates Contact'}</span>
                  </p>
                </div>
              </div>

              {/* BOTTOM CONTACT BAR */}
              <div className="p-3 bg-gradient-to-r from-amber-500/20 via-emerald-950/80 to-amber-500/20 border-t border-amber-500/40 mt-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shadow-md">
                      <Phone className="w-4 h-4 fill-slate-950" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-200 block font-semibold">CONTACT / WHATSAPP:</span>
                      <span className="text-base sm:text-lg font-mono font-black text-amber-300 tracking-wider">
                        {phoneNo}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] text-emerald-300 font-semibold leading-tight max-w-[130px]">
                      {lang === 'ml' ? 'ബയോയിലെ ലിങ്കിലൂടെ നിങ്ങൾക്കും കൂട്ടായ്മയിൽ അംഗമാകാം' : 'Join via link in bio / website'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ACTION BUTTONS PANEL */}
          <div className="w-full lg:w-80 shrink-0 space-y-3.5 bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800">
            
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Share2 className="w-4 h-4" /> Share & Export Options
            </h3>

            {/* 1. SHARE TO FACEBOOK BUTTON */}
            <button
              onClick={handleFacebookShare}
              disabled={isGenerating}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] touch-target"
            >
              <FacebookIcon className="w-4 h-4 fill-white" />
              <span>Share to Facebook</span>
            </button>

            {/* 2. SHARE TO INSTAGRAM BUTTON */}
            <button
              onClick={handleInstagramShare}
              disabled={isGenerating}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] touch-target"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>{copiedCaption ? 'Caption Copied & Downloading!' : 'Share to Instagram'}</span>
            </button>

            {/* 3. DOWNLOAD HD IMAGE */}
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all touch-target"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating HD Poster...' : 'Download HD Image (PNG)'}</span>
            </button>

            {/* 4. COPY IMAGE TO CLIPBOARD */}
            <button
              onClick={handleCopyImage}
              disabled={isGenerating}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
            >
              <Copy className="w-4 h-4 text-emerald-400" />
              <span>Copy Image to Clipboard</span>
            </button>

            {/* 5. COPY CAPTION TEXT ONLY */}
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(getSocialCaption());
                setCopiedLink(true);
                if (onShowToast) onShowToast("Social media text caption copied!");
                setTimeout(() => setCopiedLink(false), 2500);
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 font-medium text-xs border border-slate-700/70 transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copiedLink ? 'Text Caption Copied!' : 'Copy Text Caption Only'}</span>
            </button>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p className="font-bold text-amber-300">💡 Customization Applied:</p>
              <p>• <strong>Bride:</strong> Pure black abaya (backside view, 2x zoom on left).</p>
              <p>• <strong>Groom:</strong> Young handsome Kerala Usthad (2x zoom on left).</p>
              <p>• <strong>Facebook Share:</strong> Opens FB share dialog & copies formatted Malayalam text.</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
