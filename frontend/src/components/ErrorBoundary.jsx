import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorId: null };
  }

  static getDerivedStateFromError(error) {
    const errorId = 'HC-ERR-' + Math.random().toString(36).substring(2, 11).toUpperCase();
    return { hasError: true, error, errorId };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/dashboard';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F6F8FC] dark:bg-[#030712] flex items-center justify-center p-6 text-slate-900 dark:text-slate-100 transition-colors duration-300">
          <div className="max-w-md w-full bg-white dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center border border-slate-200 dark:border-white/5">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h1 className="text-2xl font-black mb-2 tracking-tight">Something went wrong</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              We've encountered an unexpected error. The application state has been protected.
            </p>

            <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-4 py-2.5 rounded-xl text-xs font-mono mb-8 inline-block select-all">
              <span className="text-slate-400 dark:text-slate-500 mr-2 font-semibold">Error ID:</span>
              <span className="font-bold text-indigo-500 dark:text-indigo-400">{this.state.errorId}</span>
            </div>

            <div className="space-y-3">
              <button 
                onClick={this.handleReload}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/20 active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Try Refreshing Page
              </button>

              <button 
                onClick={this.handleGoBack}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-xl border border-slate-200 dark:border-white/5 transition duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Go Back
              </button>
            </div>
            
            {process.env.NODE_ENV !== 'production' && (
              <div className="mt-8 text-left bg-slate-950 text-red-400 p-4 rounded-xl text-xs font-mono overflow-auto max-h-48 border border-white/5">
                {this.state.error?.stack || this.state.error?.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
