import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ChevronDown,
  Menu,
  X,
  Clock,
  Sparkles,
  Gift,
  HelpCircle,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ValidityPolicyModal from './ValidityPolicyModal';

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
  const { credits, currentUser, userGender, isAdmin, isParent, isBride, isGroom, switchUserPersona, logout, pricing } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showValidityModal, setShowValidityModal] = useState(false);
  const userMenuRef = useRef(null);

  // Close desktop user dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile hamburger drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Handle Escape key to close any open menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
        setShowValidityModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
      
      {/* Campaign, 3-Month Freshness & Verification Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/70 border-b border-emerald-800/40 py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs gap-2">
          <div className="flex items-center gap-2 text-slate-300 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="font-semibold text-emerald-300 shrink-0">Verified Matrimonial Network</span>
            <span className="text-slate-500 shrink-0">•</span>
            <button
              onClick={() => setShowValidityModal(true)}
              className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer truncate"
              title="Click to view 3-month profile validity and monthly campaign rules"
            >
              <span className="text-amber-300/90 font-medium hidden xs:inline">3-Month Valid Listings (WhatsApp Renewal)</span>
              {pricing?.campaignMode && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] ml-1 shrink-0 border border-emerald-500/30">
                  Free ₹0 Drive
                </span>
              )}
            </button>
          </div>

          {/* Gender View Lock & Admin Mode Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setShowValidityModal(true)}
              className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer mr-1"
            >
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>3-Month Policy &amp; Campaign Perks</span>
            </button>

            {currentUser && !isAdmin && userGender && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] sm:text-[11px] font-semibold text-amber-300 border border-amber-500/30">
                <Lock className="w-2.5 h-2.5" />
                <span>Viewing {userGender === 'male' ? 'Brides' : 'Grooms'}</span>
              </span>
            )}
            {currentUser && isAdmin && (
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
              <Link to="/" aria-label="Al-ThayyiBoon Matrimony Home" className="flex items-center gap-1.5 sm:gap-3 group">
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
              </Link>
            </div>

            {/* Action Buttons: Prioritized for mobile with hamburger for secondary items */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">

              {/* Only show secondary buttons (Credits, Saved, Poster Maker) when signed in */}
              {currentUser && (
                <>
                  {/* In-App Wallet / Credits Counter (Tablet & Desktop only) */}
                  <button
                    onClick={onOpenWalletModal}
                    className="hidden sm:inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 text-amber-300 border border-amber-500/30 transition-all touch-target shadow-sm shrink-0 cursor-pointer"
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
                </>
              )}

              {/* Add Proposal / Sign In: Primary CTA Button (Always visible on mobile) */}
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
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] touch-target whitespace-nowrap shrink-0 cursor-pointer"
                  aria-label="Sign In"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Desktop User Account / Profile Persona Dropdown Menu (Hidden on mobile) */}
              {currentUser && (
                <div className="relative shrink-0 hidden sm:block" ref={userMenuRef}>
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

                  {/* Floating Account Menu (Desktop) */}
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

              {/* Mobile Wallet Icon Badge for logged in users */}
              {currentUser && (
                <button
                  onClick={onOpenWalletModal}
                  className="sm:hidden inline-flex items-center gap-1 px-2 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black shadow-sm shrink-0 cursor-pointer"
                  title={`Credits: ${credits}`}
                  aria-label={`Wallet balance: ${credits} credits`}
                >
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>{credits}</span>
                </button>
              )}

              {/* Mobile Hamburger Button: ALWAYS available on mobile (both guests & members) */}
              <button
                id="mobile-hamburger-btn"
                onClick={() => setIsMobileMenuOpen(prev => !prev)}
                className="sm:hidden relative p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors touch-target shrink-0 cursor-pointer flex items-center justify-center"
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
                {/* Active indicator dot if bookmarks exist, admin mode, or campaign active */}
                {!isMobileMenuOpen && (bookmarkCount > 0 || isAdmin || pricing?.campaignMode) && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
                )}
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* ===== MOBILE SLIDE-OUT NAVIGATION DRAWER (FOR BOTH MEMBERS & GUESTS) ===== */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 sm:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity animate-fade-in"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-[320px] bg-slate-950 border-l border-slate-800/90 shadow-2xl flex flex-col z-50 animate-slide-left overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/60">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/favicon.svg" 
                  alt="Al-ThayyiBoon Logo" 
                  className="w-7 h-7 rounded-lg shadow-sm shrink-0" 
                />
                <div>
                  <span className="font-extrabold text-sm text-white block leading-tight">Al-ThayyiBoon</span>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" /> Matrimonial Network
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors touch-target cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Account / Profile Card */}
            {currentUser ? (
              <div className="p-4 border-b border-slate-800/80 bg-slate-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-sm font-black text-emerald-300 shrink-0">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-white truncate">{currentUser.name || 'Member'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleBadgeColor()}`}>
                        {getRoleLabel()}
                      </span>
                    </div>
                  </div>
                </div>
                {currentUser.email && (
                  <p className="text-[11px] text-slate-400 truncate mt-2">{currentUser.email}</p>
                )}
              </div>
            ) : (
              <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 space-y-2.5">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sign in as Groom or Bride to browse verified matrimonial proposals and unlock guardian contact details.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onOpenSignIn) onOpenSignIn('groom', 'signin');
                    }}
                    className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-emerald-500/30 text-center transition-all cursor-pointer"
                  >
                    Groom Sign In
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onOpenSignIn) onOpenSignIn('bride', 'signin');
                    }}
                    className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs border border-rose-500/30 text-center transition-all cursor-pointer"
                  >
                    Bride Sign In
                  </button>
                </div>
              </div>
            )}

            {/* In-App Wallet Balance Card (If Signed In) */}
            {currentUser && (
              <div className="mx-3.5 my-3 p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-amber-500/5 border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Credit Wallet</p>
                      <p className="text-base font-black text-amber-300 font-mono leading-tight">{credits} Credits</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onOpenWalletModal) onOpenWalletModal();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-sm flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Top Up</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3-Month Freshness & Monthly Campaign Highlight Card */}
            <div className="mx-3.5 my-2 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3-Month Valid Listings</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  WhatsApp Alert
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Every profile is valid for 3 months, then renewed via WhatsApp to ensure 100% active candidates.
              </p>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowValidityModal(true);
                }}
                className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline pt-0.5 cursor-pointer block"
              >
                Learn about 3M Policy &amp; Monthly Free Drive →
              </button>
            </div>

            {/* Navigation & Tools */}
            <div className="px-3 py-1 space-y-1">
              <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Directory Tools
              </p>

              {/* Add Proposal CTA */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAddModal();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-4 h-4 text-white" />
                  <span>Post Matrimonial Proposal</span>
                </div>
                {pricing?.campaignMode ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                    Free ₹0
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-200 font-semibold">
                    3-Month Active
                  </span>
                )}
              </button>

              {/* Saved Favorites */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onToggleShowFavorites) {
                    onToggleShowFavorites();
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  showFavoritesOnly 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                    : 'text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-rose-400 text-rose-400' : 'text-rose-400'}`} />
                  <span>Saved Favorites</span>
                </div>
                {bookmarkCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {bookmarkCount}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">0</span>
                )}
              </button>

              {/* Poster Generator */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenPosterGenerator) onOpenPosterGenerator();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>Social Poster Maker</span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                  WhatsApp / Insta
                </span>
              </button>

              {/* Filter Proposals */}
              {onToggleMobileFilter && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onToggleMobileFilter();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Filter className="w-4 h-4 text-emerald-400" />
                    <span>Filter Directory</span>
                  </div>
                  {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold">
                      {activeFilterCount} Active
                    </span>
                  )}
                </button>
              )}

              {/* Official WhatsApp Group */}
              {pricing?.whatsappGroupLink && (
                <a
                  href={pricing.whatsappGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-300 hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Matrimony Community</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Join
                  </span>
                </a>
              )}

              {/* Admin Portal Dashboard */}
              {isAdmin && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenAdminPortal) onOpenAdminPortal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-amber-300 hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Admin Portal Dashboard</span>
                </button>
              )}
            </div>

            {/* Sign Out (if logged in) */}
            {currentUser && (
              <div className="p-3.5 border-t border-slate-800/80 mt-auto">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 3-Month Validity & Monthly Campaign Policy Modal */}
      <ValidityPolicyModal
        isOpen={showValidityModal}
        onClose={() => setShowValidityModal(false)}
        onOpenAddModal={onOpenAddModal}
      />

    </header>
  );
}
