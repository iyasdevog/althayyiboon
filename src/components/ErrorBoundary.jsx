import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-rose-500/30 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20 mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              An unexpected error occurred while rendering this page. You can reload or return to the home page.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>Reload</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
