import React, { useState } from 'react';
import { 
  X, 
  User, 
  Heart, 
  Users, 
  Lock, 
  Mail, 
  Key, 
  Sparkles, 
  AlertCircle, 
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignInModal({ isOpen, onClose, onShowToast, defaultRole = 'groom', profiles = [] }) {
  const { loginWithGoogle, loginWithEmailPassword, loginWithLegacyCredentials } = useAuth();

  const [activeTab, setActiveTab] = useState('google'); // 'google' | 'email' | 'legacy'
  const [selectedRole, setSelectedRole] = useState(defaultRole);
  
  // Email Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Legacy Credential Auth State
  const [identifier, setIdentifier] = useState('');
  const [legacyPassword, setLegacyPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    const res = await loginWithGoogle(selectedRole);
    setLoading(false);
    if (res.success) {
      if (onShowToast) onShowToast(`Welcome back, ${res.profile?.name || 'Member'}!`);
      onClose();
    } else if (res.error) {
      // Silently ignore cancelled-popup-request (already handled in AuthContext)
      setErrorMsg(res.error);
    }
    // If res.error is null, it was a silent cancellation — do nothing
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const res = await loginWithEmailPassword(email, password, isSignUp, selectedRole);
    setLoading(false);
    if (res.success) {
      if (onShowToast) onShowToast(`Signed in successfully as ${res.profile?.name || 'Member'}!`);
      onClose();
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleLegacyLogin = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !legacyPassword.trim()) {
      setErrorMsg('Please enter your Profile ID / Username and Password.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const res = await loginWithLegacyCredentials(identifier, legacyPassword, profiles);
    setLoading(false);
    if (res.success) {
      if (onShowToast) onShowToast(`Welcome, ${res.profile?.name || 'Candidate'}! Logged in with proposal credentials.`);
      onClose();
    } else {
      setErrorMsg(res.error || 'Could not verify credentials. Please verify with the administrator.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-300 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Al-ThayyiBoon Authentication</span>
          </div>
          <h2 className="text-2xl font-black text-white">Sign In to Your Account</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Access verified real candidate proposals with sacred modesty and guardian protection.
          </p>
        </div>

        {/* Role Selector */}
        <div className="mb-5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Your Role / Persona
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole('groom')}
              className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                selectedRole === 'groom'
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/30'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Groom (Brother)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('bride')}
              className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                selectedRole === 'bride'
                  ? 'bg-rose-600/20 border-rose-500 text-rose-300 shadow-md shadow-rose-950/30'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Bride (Sister)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('parent')}
              className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                selectedRole === 'parent'
                  ? 'bg-teal-600/20 border-teal-500 text-teal-300 shadow-md shadow-teal-950/30'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Parent / Wali</span>
            </button>
          </div>
        </div>

        {/* Auth Method Navigation Tabs */}
        <div className="flex border-b border-slate-800 mb-5">
          <button
            onClick={() => { setActiveTab('google'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'google'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Google Sign In
          </button>
          <button
            onClick={() => { setActiveTab('email'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'email'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Email &amp; Password
          </button>
          <button
            onClick={() => { setActiveTab('legacy'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'legacy'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Profile ID &amp; Password
          </button>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab 1: Google Sign In */}
        {activeTab === 'google' && (
          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-400 leading-relaxed text-center">
              Quick and secure access. All new users can sign in instantly using their verified Google Account.
            </p>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Signing In...' : `Continue with Google as ${selectedRole === 'bride' ? 'Bride' : selectedRole === 'parent' ? 'Parent' : 'Groom'}`}</span>
            </button>
          </div>
        )}

        {/* Tab 2: Email & Password */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Processing...' : (isSignUp ? 'Create New Account' : 'Sign In with Password')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              >
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Register with Email'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Legacy Profile ID & Password */}
        {activeTab === 'legacy' && (
          <form onSubmit={handleLegacyLogin} className="space-y-4">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <span className="text-emerald-400 font-semibold block mb-0.5">ℹ️ Legacy &amp; Pre-Registered Proposals:</span>
              If your proposal was created previously or added directly by administration, enter the Profile ID (e.g. ALTB-201) or Guardian Phone along with the Password/PIN provided by Admin.
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Access Password / PIN</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={legacyPassword}
                  onChange={(e) => setLegacyPassword(e.target.value)}
                  placeholder="Enter password shared by admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Verifying...' : 'Sign In with Profile Credentials'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
