import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Heart, 
  Lock, 
  Mail, 
  Key, 
  Sparkles, 
  AlertCircle, 
  ArrowRight,
  UserPlus,
  LogIn,
  CheckCircle2,
  ShieldCheck,
  Gift
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignInModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onShowToast, 
  defaultRole = 'groom', 
  profiles = [],
  initialMode = 'signin' // 'signin' | 'register'
}) {
  const { loginWithGoogle, loginWithEmailPassword, loginWithLegacyCredentials, pricing } = useAuth();

  // Top level auth mode: 'register' (New Candidate) vs 'signin' (Already Registered)
  const [authMode, setAuthMode] = useState(initialMode);
  
  // Role selector
  const normalizedDefaultRole = defaultRole === 'bride' ? 'bride' : 'groom';
  const [selectedRole, setSelectedRole] = useState(normalizedDefaultRole);

  // Tabs within modes
  // In 'register': 'google' | 'email'
  // In 'signin': 'legacy' | 'google' | 'email'
  const [regTab, setRegTab] = useState('google');
  const [signInTab, setSignInTab] = useState('legacy');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Legacy credentials
  const [identifier, setIdentifier] = useState('');
  const [legacyPassword, setLegacyPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync mode if initialMode prop changes when modal opens
  useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode || 'signin');
      setErrorMsg('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const isCampaign = Boolean(pricing?.campaignMode);

  // Handle Google Auth (Works for both Register and Sign In)
  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg('');
    const res = await loginWithGoogle(selectedRole, profiles);
    setLoading(false);

    if (res.success) {
      if (res.isAlreadyRegistered) {
        const candidateName = res.matchedProfile?.basicInfo?.fullName || res.profile?.name || 'Candidate';
        const pId = res.matchedProfile?.id ? ` (${res.matchedProfile.id})` : '';
        if (onShowToast) onShowToast(`Welcome back, ${candidateName}${pId}!`);
        if (onSuccess) onSuccess({ isNewRegistration: false, profile: res.profile, matchedProfile: res.matchedProfile });
        else onClose();
      } else {
        if (onShowToast) onShowToast(`Welcome, ${res.profile?.name || 'Member'}! Please complete your proposal registration.`);
        if (onSuccess) onSuccess({ isNewRegistration: true, profile: res.profile });
        else onClose();
      }
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  // Handle Email Registration (Sign Up)
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter candidate or guardian full name.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter email address and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const res = await loginWithEmailPassword(email, password, true, selectedRole, profiles, fullName);
    setLoading(false);

    if (res.success) {
      if (onShowToast) onShowToast(`Account created! Welcome, ${res.profile?.name || 'Member'}. Now register proposal details.`);
      if (onSuccess) onSuccess({ isNewRegistration: true, profile: res.profile });
      else onClose();
    } else {
      setErrorMsg(res.error || 'Failed to create account. Please check details or try another email.');
    }
  };

  // Handle Email Sign In
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const res = await loginWithEmailPassword(email, password, false, selectedRole, profiles);
    setLoading(false);

    if (res.success) {
      if (res.isAlreadyRegistered) {
        const candidateName = res.matchedProfile?.basicInfo?.fullName || res.profile?.name || 'Candidate';
        const pId = res.matchedProfile?.id ? ` (${res.matchedProfile.id})` : '';
        if (onShowToast) onShowToast(`Welcome back, ${candidateName}${pId}!`);
        if (onSuccess) onSuccess({ isNewRegistration: false, profile: res.profile, matchedProfile: res.matchedProfile });
        else onClose();
      } else {
        if (onShowToast) onShowToast(`Signed in successfully! Please register proposal details to browse other candidates.`);
        if (onSuccess) onSuccess({ isNewRegistration: true, profile: res.profile });
        else onClose();
      }
    } else {
      setErrorMsg(res.error || 'Incorrect email or password. Please verify credentials.');
    }
  };

  // Handle Legacy / Pre-registered Proposal Sign In
  const handleLegacyLogin = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !legacyPassword.trim()) {
      setErrorMsg('Please enter your Profile ID / Guardian Phone and Access PIN / Password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const res = await loginWithLegacyCredentials(identifier, legacyPassword, profiles);
    setLoading(false);

    if (res.success) {
      const candidateName = res.matchedProfile?.basicInfo?.fullName || res.profile?.name || 'Candidate';
      const pId = res.profile?.profileId ? ` (${res.profile.profileId})` : '';
      if (onShowToast) onShowToast(`Welcome back, ${candidateName}${pId}! Proposal verified.`);
      if (onSuccess) onSuccess({ isNewRegistration: false, profile: res.profile, matchedProfile: res.matchedProfile });
      else onClose();
    } else {
      setErrorMsg(res.error || 'Could not verify proposal credentials. Please check Profile ID / Phone and PIN.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-100 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all ${
          authMode === 'register' ? 'bg-emerald-500/15' : 'bg-amber-500/10'
        }`}></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Al-ThayyiBoon Islamic Matrimony</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {authMode === 'register' ? 'Candidate Registration' : 'Candidate Sign In'}
          </h2>
          
          <p className="text-xs text-slate-300 mt-1.5 max-w-sm mx-auto leading-relaxed">
            {authMode === 'register' 
              ? 'Register your proposal details to join the network & browse verified matches.' 
              : 'Sign in with your registered account, Google, or Profile ID & Password.'}
          </p>
        </div>

        {/* Top Mode Switcher: [ New Candidate Registration ] vs [ Sign In (Already Registered) ] */}
        <div className="p-1 rounded-2xl bg-slate-950 border border-slate-800 flex gap-1 mb-5">
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              authMode === 'register'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>New Candidate</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              authMode === 'signin'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Already Registered</span>
          </button>
        </div>

        {/* Proposal Role Selector: Groom (Brother) or Bride (Sister) */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Proposal Category
            </label>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Modesty Locked
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedRole('groom')}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'groom'
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm ring-1 ring-emerald-500/40'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <User className="w-4 h-4 text-emerald-400" />
              <span>Groom (Brother)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('bride')}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'bride'
                  ? 'bg-rose-600/20 border-rose-500 text-rose-300 shadow-sm ring-1 ring-rose-500/40'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Bride (Sister)</span>
            </button>
          </div>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: NEW CANDIDATE REGISTRATION */}
        {/* ========================================================================= */}
        {authMode === 'register' && (
          <div className="space-y-4">
            
            {/* Free Campaign Banner */}
            {isCampaign && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/60 border border-emerald-500/30 text-[11px] text-slate-300 flex items-center gap-2.5">
                <Gift className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-300">Free Registration Campaign Active:</span>
                  <p className="text-slate-400 mt-0.5">₹0 Listing fee + 3 complimentary direct guardian contact unlocks.</p>
                </div>
              </div>
            )}

            {/* Method Tabs for Registration */}
            <div className="flex border-b border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setRegTab('google'); setErrorMsg(''); }}
                className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer ${
                  regTab === 'google'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                1-Click Google Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setRegTab('email'); setErrorMsg(''); }}
                className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer ${
                  regTab === 'email'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Register with Email
              </button>
            </div>

            {/* Reg Method 1: Google */}
            {regTab === 'google' && (
              <div className="py-2 space-y-3">
                <p className="text-xs text-slate-400 text-center leading-relaxed">
                  Fastest &amp; most secure. Use your verified Google account to sign up. Then immediately enter your candidate proposal details.
                </p>
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{loading ? 'Connecting Google...' : `Sign Up as ${selectedRole === 'bride' ? 'Bride' : 'Groom'} with Google`}</span>
                </button>
              </div>
            )}

            {/* Reg Method 2: Email & Password */}
            {regTab === 'email' && (
              <form onSubmit={handleEmailSignUp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name (Candidate or Guardian)</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Muhammed Shafi or Abdul Kareem"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer disabled:opacity-50 mt-1"
                >
                  <span>{loading ? 'Creating Account...' : 'Register & Enter Proposal Details'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Switch Helper */}
            <div className="text-center pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              >
                Already have a proposal registered? Sign In here →
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: SIGN IN FOR ALREADY REGISTERED CANDIDATES */}
        {/* ========================================================================= */}
        {authMode === 'signin' && (
          <div className="space-y-4">
            
            {/* Method Tabs for Sign In */}
            <div className="flex border-b border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setSignInTab('legacy'); setErrorMsg(''); }}
                className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer ${
                  signInTab === 'legacy'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Profile ID / Phone
              </button>
              <button
                type="button"
                onClick={() => { setSignInTab('google'); setErrorMsg(''); }}
                className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer ${
                  signInTab === 'google'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Google Sign In
              </button>
              <button
                type="button"
                onClick={() => { setSignInTab('email'); setErrorMsg(''); }}
                className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer ${
                  signInTab === 'email'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Email &amp; Password
              </button>
            </div>

            {/* Tab 1: Profile ID / Phone & PIN */}
            {signInTab === 'legacy' && (
              <form onSubmit={handleLegacyLogin} className="space-y-3.5">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  <span className="text-emerald-400 font-bold block mb-0.5">Direct Candidate Login:</span>
                  Enter the Profile ID (e.g. <strong>ALTB-201</strong>) or Guardian Phone Number, along with the secret PIN/Password provided upon registration.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Profile ID, Username or Phone</label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. ALTB-101 or 9846000001"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Secret PIN / Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={legacyPassword}
                      onChange={(e) => setLegacyPassword(e.target.value)}
                      placeholder="Enter 4-digit PIN or password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <span>{loading ? 'Verifying Proposal...' : 'Sign In with Profile Credentials'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Tab 2: Google Sign In */}
            {signInTab === 'google' && (
              <div className="py-2 space-y-3 text-center">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sign in with the Google Account linked to your candidate proposal.
                </p>
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{loading ? 'Signing In...' : 'Continue with Google'}</span>
                </button>
              </div>
            )}

            {/* Tab 3: Email & Password */}
            {signInTab === 'email' && (
              <form onSubmit={handleEmailSignIn} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <span>{loading ? 'Signing In...' : 'Sign In to Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Switch Helper */}
            <div className="text-center pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              >
                New candidate? Register your proposal here →
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
