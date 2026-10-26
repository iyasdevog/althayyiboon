import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProfiles } from '../context/ProfilesContext';
import { Home, Compass, UserPlus, ShieldAlert } from 'lucide-react';

export default function NotFoundPage() {
  const { totalCount, activeFilterCount, bookmarks } = useProfiles();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        totalProfiles={totalCount}
        activeFilterCount={activeFilterCount}
        bookmarkCount={bookmarks.length}
      />

      <main className="max-w-2xl mx-auto px-4 py-24 text-center flex-1 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 shadow-xl">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 mb-2">404 - Page Not Found</span>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
          This Page Does Not Exist
        </h1>
        <p className="text-sm text-slate-400 mb-8 max-w-md leading-relaxed">
          The requested page URL was not found or may have moved. You can return home or browse the active proposals directory.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-all"
          >
            <Home className="w-4 h-4 text-emerald-400" />
            <span>Go Home</span>
          </Link>
          <Link
            to="/profiles"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Browse Proposals</span>
          </Link>
          <Link
            to="/add"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 font-semibold text-xs sm:text-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Proposal</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
