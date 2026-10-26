import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  Check, 
  ShieldCheck, 
  User, 
  Lock, 
  ArrowRight,
  Zap,
  PhoneCall,
  Gift,
  History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function WalletRechargeModal({ isOpen, onClose, onShowToast, onOpenAdminPortal }) {
  const { 
    credits, 
    addCredits, 
    pendingUnlockProfile, 
    setPendingUnlockProfile, 
    unlockContact,
    currentUser,
    switchUserPersona,
    loginWithGoogle,
    logout,
    pricing,
    unlockedProfileIds = []
  } = useAuth();

  const [selectedPack, setSelectedPack] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('recharge'); // 'recharge' | 'history' | 'account'
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Close on Escape key press
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const feePerContact = pricing.contactUnlockFee || 15;

  const packages = [
    { credits: 1, price: feePerContact, tag: "Starter", desc: "Unlock 1 Guardian Contact" },
    { credits: 5, price: Math.round(feePerContact * 5 * 0.93), tag: "Most Popular", desc: "Unlock 5 Guardian Contacts (Save 7%)", featured: true },
    { credits: 10, price: Math.round(feePerContact * 10 * 0.8), tag: "Best Value", desc: "Unlock 10 Contacts (Save 20%)" }
  ];

  const handleSimulatePayment = (packCredits, packPrice) => {
    setIsProcessing(true);
    setTimeout(() => {
      addCredits(packCredits);
      setIsProcessing(false);
      
      if (onShowToast) {
        onShowToast(`Payment of ₹${packPrice} successful! Added ${packCredits} Credits.`);
      }

      // If user was trying to unlock a specific candidate
      if (pendingUnlockProfile) {
        unlockContact(pendingUnlockProfile);
        if (onShowToast) {
          setTimeout(() => {
            onShowToast(`Unlocked contact for ${pendingUnlockProfile.basicInfo?.fullName || 'Candidate'}!`);
          }, 800);
        }
        setPendingUnlockProfile(null);
      }

      onClose();
    }, 900);
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME' || code === 'ALIKHWAN' || code === 'BARAKAH' || code === 'NIKAH2026') {
      addCredits(2);
      setPromoApplied(true);
      setPromoCode('');
      if (onShowToast) onShowToast("Promo voucher applied! +2 Bonus Credits added.");
    } else {
      setPromoError("Invalid promo code. Try 'WELCOME' or 'ALIKHWAN'.");
    }
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-label="Recharge Wallet & Manage Credits"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
      ></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 animate-fade-in my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center font-bold shadow-lg">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Al-ThayyiBoon Wallet</span>
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Pay-Per-View
                </span>
              </h2>
              <p className="text-xs text-slate-400">Manage credits & verified contact access</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Bar */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Available Balance:</span>
            <span className="text-base font-extrabold text-amber-300 flex items-center gap-1 font-mono">
              <span>🪙</span>
              <span>{credits}</span>
              <span className="text-xs font-medium text-slate-400">Credits</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1 Credit = ₹{feePerContact}</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('recharge')}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'recharge'
                ? 'border-emerald-500 text-emerald-300 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Recharge Credits
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'history'
                ? 'border-emerald-500 text-emerald-300 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Unlocked ({unlockedProfileIds.length})
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'account'
                ? 'border-emerald-500 text-emerald-300 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Mode Switcher
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">

          {/* TAB 1: RECHARGE CREDITS */}
          {activeTab === 'recharge' && (
            <>
              {pendingUnlockProfile && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 text-amber-300 shrink-0" />
                  <div className="text-xs text-slate-200">
                    <span className="font-semibold text-white">Unlock Request:</span> Unlock guardian phone & WhatsApp for{' '}
                    <span className="text-amber-300 font-bold">
                      {pendingUnlockProfile.basicInfo?.fullName || pendingUnlockProfile.id}
                    </span>.
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Credit Package
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.credits}
                      onClick={() => setSelectedPack(pkg.credits)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-center justify-between ${
                        selectedPack === pkg.credits
                          ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          selectedPack === pkg.credits
                            ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                            : 'border-slate-600'
                        }`}>
                          {selectedPack === pkg.credits && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{pkg.credits} Credits</span>
                            {pkg.tag && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                pkg.featured
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}>
                                {pkg.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{pkg.desc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-emerald-400 font-mono">₹{pkg.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pay Button */}
              {(() => {
                const currentPkg = packages.find(p => p.credits === selectedPack) || packages[1];
                return (
                  <button
                    disabled={isProcessing}
                    onClick={() => handleSimulatePayment(currentPkg.credits, currentPkg.price)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {isProcessing ? (
                      <span>Processing Instant Payment...</span>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-slate-950" />
                        <span>Pay ₹{currentPkg.price} &amp; Add {currentPkg.credits} Credits</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                );
              })()}

              {/* Promo Voucher Box */}
              <form onSubmit={handleApplyPromo} className="pt-2 border-t border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span>Have a Promo Voucher?</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code (e.g. WELCOME)"
                    className="flex-1 px-3 py-2 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 uppercase font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Promo voucher applied successfully!</span>
                  </div>
                )}
                {promoError && (
                  <div className="text-[11px] text-rose-400">
                    {promoError}
                  </div>
                )}
              </form>

              <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5 pt-1">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>UPI, Google Pay, PhonePe, Cards &amp; NetBanking accepted</span>
              </p>
            </>
          )}

          {/* TAB 2: UNLOCKED CONTACTS HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-emerald-400" />
                  <span>Previously Unlocked Proposals ({unlockedProfileIds.length})</span>
                </span>
              </div>

              {unlockedProfileIds.length > 0 ? (
                <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                  {unlockedProfileIds.map((pid) => (
                    <div 
                      key={pid}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-emerald-300">{pid}</span>
                        <p className="text-[10px] text-slate-400">Permanent guardian contact access unlocked</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        Active Access
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <History className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-sm font-semibold text-white">No Unlocked Contacts Yet</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    When you unlock candidate contacts using your credits, they will be permanently accessible here.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AUTH & PERSONA MODE */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Active Persona &amp; View Lock
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{currentUser?.name || "Guest Visitor"}</h4>
                    <p className="text-xs text-slate-400 capitalize">
                      Role: <span className="text-emerald-400 font-medium">{currentUser?.role || 'Guest'}</span> • 
                      Gender: <span className="text-amber-300 font-medium">{currentUser?.gender || 'None'}</span>
                    </p>
                  </div>
                  {currentUser?.gender && currentUser.role !== 'admin' && (
                    <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      Viewing {currentUser.gender === 'male' ? 'Brides' : 'Grooms'} Only
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Switch Persona (Quick Test View Lock)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      switchUserPersona('groom');
                      if (onShowToast) onShowToast("Switched to Groom (View Locked to Brides)");
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      currentUser?.role === 'groom'
                        ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">Groom</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">Sees Brides</div>
                  </button>

                  <button
                    onClick={() => {
                      switchUserPersona('bride');
                      if (onShowToast) onShowToast("Switched to Bride (View Locked to Grooms)");
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      currentUser?.role === 'bride'
                        ? 'bg-rose-500/20 border-rose-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">Bride</div>
                    <div className="text-[10px] text-rose-300 mt-0.5">Sees Grooms</div>
                  </button>

                  <button
                    onClick={() => {
                      switchUserPersona('parent');
                      if (onShowToast) onShowToast("Switched to Parent / Guardian (Names & Numbers Masked)");
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      currentUser?.role === 'parent'
                        ? 'bg-teal-500/20 border-teal-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">Parent</div>
                    <div className="text-[10px] text-teal-300 mt-0.5">Masked Info</div>
                  </button>

                  <button
                    onClick={() => {
                      switchUserPersona('admin');
                      if (onShowToast) onShowToast("Switched to Admin User (Global View)");
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      currentUser?.role === 'admin'
                        ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">Admin</div>
                    <div className="text-[10px] text-amber-300 mt-0.5">Global View</div>
                  </button>
                </div>
              </div>

              {onOpenAdminPortal && (
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      onOpenAdminPortal();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Open Master Admin Portal</span>
                  </button>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={async () => {
                    await loginWithGoogle();
                    if (onShowToast) onShowToast("Logged in with Google!");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-2 border border-slate-700 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In with Google</span>
                </button>

                {currentUser && (
                  <button
                    onClick={() => {
                      logout();
                      if (onShowToast) onShowToast("Signed out successfully.");
                    }}
                    className="px-3 py-2 text-xs text-rose-400 hover:underline cursor-pointer"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
