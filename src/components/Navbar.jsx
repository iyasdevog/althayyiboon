import React from 'react';
import { 
  Heart, 
  UserPlus, 
  Filter, 
  ShieldCheck, 
  Image as ImageIcon,
  Coins,
  User,
  Plus,
  Lock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  onOpenAddModal, 
  totalProfiles, 
  onToggleMobileFilter, 
  activeFilterCount,
  onOpenAdminPortal,
  bookmarkCount = 0,
  showFavoritesOnly = false,
  onToggleShowFavorites,
  onOpenPosterGenerator,
  onOpenWalletModal
}) {
  const { credits, currentUser, userGender, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40">
      
      {/* Campaign / Verification Banner (Replacing 100% Free banner) */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/70 border-b border-emerald-800/40 py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 text-slate-300 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-emerald-300">Verified Matrimonial Network</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">
              Direct guardian contact access with protected pay-per-view credits
            </span>
          </div>

          {/* Gender View Lock Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            {!isAdmin && userGender && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] sm:text-[11px] font-semibold text-amber-300 border border-amber-500/30">
                <Lock className="w-2.5 h-2.5" />
                <span>Viewing {userGender === 'male' ? 'Brides' : 'Grooms'}</span>
              </span>
            )}
            {isAdmin && (
              <button 
                onClick={onOpenAdminPortal}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-[10px] sm:text-[11px] font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
              >
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Admin Mode</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== MAIN NAVBAR ===== */}
      <div className="glass-panel border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            
            {/* Logo & Branding */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <img 
                src="/favicon.svg" 
                alt="Al-ThayyiBoon Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-lg shadow-emerald-900/40 shrink-0 hover:scale-105 transition-transform"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-200 to-amber-300 bg-clip-text text-transparent truncate">
                    Al-ThayyiBoon
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                    <ShieldCheck className="w-3 h-3" /> Islamic &amp; Academic
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:block">
                  Kerala &amp; Gulf Matrimony • <span className="text-emerald-400 font-bold">Verified Direct Contacts</span>
                </p>
              </div>
            </div>

            {/* Action Buttons: Wallet, Account, Filter, Poster, Add Profile */}
            <div className="flex items-center gap-1.5 sm:gap-2">

              {/* In-App Wallet / Credits Counter */}
              <button
                onClick={onOpenWalletModal}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 text-amber-300 border border-amber-500/30 transition-all touch-target shadow-sm"
                title="Your Credit Wallet - Click to recharge or view details"
              >
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-extrabold">{credits}</span>
                <span className="text-[10px] sm:text-xs font-semibold text-amber-200/80 hidden xs:inline">Credits</span>
                <span className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center text-[10px] text-amber-300 font-bold ml-0.5">
                  <Plus className="w-2.5 h-2.5" />
                </span>
              </button>

              {/* Sign In / Profile Persona Switcher Button */}
              <button
                onClick={onOpenWalletModal}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors touch-target"
                title="Account & Persona"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
                </div>
                <span className="text-xs sm:text-sm font-medium hidden md:inline truncate max-w-[100px]">
                  {currentUser?.name?.split(' ')[0] || 'Sign In'}
                </span>
              </button>

              {/* Social Media Poster Generator Button */}
              <button
                onClick={onOpenPosterGenerator}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-bold rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all touch-target"
                title="Create Social Media Card for Facebook & Instagram"
              >
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span className="hidden lg:inline">Poster Maker</span>
              </button>

              {/* Filter Toggle Button */}
              <button
                id="mobile-filter-toggle"
                onClick={onToggleMobileFilter}
                className="relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors touch-target"
                aria-label="Open filters"
              >
                <Filter className="w-4 h-4 text-emerald-400" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center shadow-md">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Add Profile CTA Button */}
              <button
                id="add-profile-btn"
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] touch-target whitespace-nowrap"
                aria-label="Add matrimony profile"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden xs:inline">Add Proposal</span>
                <span className="xs:hidden">Add</span>
              </button>

            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
