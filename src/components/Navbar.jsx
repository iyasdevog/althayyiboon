import React, { useState, useRef, useEffect } from 'react';
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
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  onOpenAddModal, 
  _totalProfiles, 
  onToggleMobileFilter, 
  activeFilterCount,
  onOpenAdminPortal,
  bookmarkCount = 0,
  showFavoritesOnly = false,
  onToggleShowFavorites,
  onOpenPosterGenerator,
  onOpenWalletModal,
  onOpenSignIn
}) {
  const { credits, currentUser, userGender, isAdmin, isParent, isBride, isGroom, switchUserPersona, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleLabel = () => {
    if (isAdmin) return 'Administrator';
    if (isParent) return 'Parent / Wali';
    if (isBride) return 'Bride View';
    if (isGroom) return 'Groom View';
    return 'Member';
  };

  const getRoleBadgeColor = () => {
    if (isAdmin) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    if (isParent) return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
    if (isBride) return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  };

  return (
    <header className="sticky top-0 z-40">
      
      {/* Campaign & Verification Banner */}
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

          {/* Gender View Lock & Admin Mode Badges */}
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
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-[10px] sm:text-[11px] font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors cursor-pointer"
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
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20 gap-1.5 sm:gap-4">
            
            {/* Logo & Branding */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
              <a href="/" aria-label="Al-ThayyiBoon Matrimony Home" className="flex items-center gap-1.5 sm:gap-3 group">
                <img 
                  src="/favicon.svg" 
                  alt="Al-ThayyiBoon Logo" 
                  className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl shadow-md shadow-emerald-950/50 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-sm xs:text-base sm:text-2xl font-black bg-gradient-to-r from-emerald-400 via-emerald-200 to-amber-300 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
                      Al-ThayyiBoon
                    </span>
                    <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                      <ShieldCheck className="w-3 h-3" /> Islamic &amp; Academic
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:block">
                    Kerala &amp; Gulf Matrimony • <span className="text-emerald-400 font-bold">Verified Direct Contacts</span>
                  </p>
                </div>
              </a>
            </div>

            {/* Action Buttons: Responsive & prioritized for mobile */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">

              {/* In-App Wallet / Credits Counter */}
              <button
                onClick={onOpenWalletModal}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 text-amber-300 border border-amber-500/30 transition-all touch-target shadow-sm shrink-0 cursor-pointer"
                title={`Credit Wallet: ${credits} Credits available. Tap to recharge.`}
                aria-label={`Credit wallet balance: ${credits} credits. Tap to manage.`}
              >
                <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm font-extrabold">{credits}</span>
                <span className="text-[11px] sm:text-xs font-semibold text-amber-200/80 hidden sm:inline">Credits</span>
                <span className="w-4 h-4 rounded-full bg-amber-400/20 hidden sm:inline-flex items-center justify-center text-[10px] text-amber-300 font-bold ml-0.5" aria-hidden="true">
                  <Plus className="w-2.5 h-2.5" />
                </span>
              </button>

              {/* Favorites / Saved Filter Button (Tablet & Desktop) */}
              {onToggleShowFavorites && (
                <button
                  onClick={onToggleShowFavorites}
                  className={`hidden sm:inline-flex relative items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all touch-target shrink-0 cursor-pointer ${
                    showFavoritesOnly 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm' 
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title="View Saved Favorite Proposals"
                  aria-label={showFavoritesOnly ? "Show all proposals" : "Show saved favorite proposals"}
                >
                  <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-rose-400 text-rose-400' : 'text-rose-400'}`} />
                  <span className="hidden xl:inline">Saved</span>
                  {bookmarkCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {bookmarkCount}
                    </span>
                  )}
                </button>
              )}

              {/* Social Media Poster Generator Button (Desktop) */}
              <button
                onClick={onOpenPosterGenerator}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-bold rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all touch-target shrink-0 cursor-pointer"
                title="Create Social Media Card for WhatsApp & Instagram"
                aria-label="Create Social Media Card for WhatsApp and Instagram"
              >
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Poster Maker</span>
              </button>

              {/* Filter Drawer Toggle Button */}
              <button
                id="mobile-filter-toggle"
                onClick={onToggleMobileFilter}
                className="relative inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors touch-target shrink-0 cursor-pointer"
                aria-label={`Toggle filters. ${activeFilterCount} active filters`}
              >
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="hidden xs:inline">Filter</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold inline-flex items-center justify-center shadow-md ml-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Add Proposal Button */}
              {currentUser ? (
                <button
                  id="add-profile-btn"
                  onClick={onOpenAddModal}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] touch-target whitespace-nowrap shrink-0 cursor-pointer"
                  aria-label="Add a new matrimonial proposal"
                >
                  <Plus className="w-3.5 h-3.5 sm:hidden" />
                  <UserPlus className="hidden sm:inline w-4 h-4" />
                  <span>Add</span>
                  <span className="hidden sm:inline">&nbsp;Proposal</span>
                </button>
              ) : (
                <button
                  id="sign-in-btn"
                  onClick={onOpenSignIn || onOpenWalletModal}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] touch-target whitespace-nowrap shrink-0 cursor-pointer"
                  aria-label="Sign In with Google to Add Profiles"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Account / Profile Persona Dropdown Menu */}
              {currentUser && (
                <div className="relative shrink-0" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(prev => !prev)}
                    className="inline-flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors touch-target cursor-pointer"
                    aria-label="User account and persona settings menu"
                    aria-expanded={isUserMenuOpen}
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-300">
                      {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                    </div>
                    <span className="hidden md:inline text-xs font-medium max-w-[90px] truncate">
                      {currentUser?.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                  </button>

                  {/* Floating Account Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 animate-fade-in text-left">
                      
                      {/* User Header */}
                      <div className="pb-3 border-b border-slate-800">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm text-white truncate">{currentUser.name || 'Member'}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleBadgeColor()}`}>
                            {getRoleLabel()}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{currentUser.email || 'Registered Member'}</p>
                      </div>

                      {/* Quick Balance */}
                      <div className="py-2.5 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Wallet Credits:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-extrabold text-amber-300">{credits} Credits</span>
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              onOpenWalletModal();
                            }}
                            className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 ml-1 underline cursor-pointer"
                          >
                            + Add
                          </button>
                        </div>
                      </div>

                      {/* Shortcuts */}
                      <div className="space-y-1 pt-1 border-t border-slate-800 text-xs">
                        {onToggleShowFavorites && (
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              onToggleShowFavorites();
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <Heart className="w-3.5 h-3.5 text-rose-400" />
                            <span>Saved Favorites ({bookmarkCount})</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenPosterGenerator();
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span>Generate Social Poster</span>
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              onOpenAdminPortal();
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-amber-300 hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                            <span>Admin Portal Dashboard</span>
                          </button>
                        )}
                      </div>

                      {/* Persona Switcher Quick Shortcuts */}
                      <div className="pt-2 mt-2 border-t border-slate-800">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Quick Mode Switch:
                        </span>
                        <div className="grid grid-cols-3 gap-1 text-[10px] font-semibold">
                          <button
                            onClick={() => {
                              switchUserPersona('groom');
                              setIsUserMenuOpen(false);
                            }}
                            className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-center cursor-pointer"
                          >
                            Groom
                          </button>
                          <button
                            onClick={() => {
                              switchUserPersona('bride');
                              setIsUserMenuOpen(false);
                            }}
                            className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-center cursor-pointer"
                          >
                            Bride
                          </button>
                          <button
                            onClick={() => {
                              switchUserPersona('parent');
                              setIsUserMenuOpen(false);
                            }}
                            className="p-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-center cursor-pointer"
                          >
                            Parent
                          </button>
                        </div>
                      </div>

                      {/* Sign Out */}
                      <div className="pt-2 mt-2 border-t border-slate-800">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-semibold cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
