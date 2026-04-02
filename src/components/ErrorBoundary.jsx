import React from 'react';
import { ShieldAlert, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6 text-white text-center">
          <div className="max-w-md w-full p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
            
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
              <ShieldAlert className="w-10 h-10 text-red-500" />
            </div>

            <h1 className="text-3xl font-black mb-4 tracking-tight uppercase">System Fault</h1>
            <p className="text-white/40 text-sm leading-relaxed mb-10 font-bold uppercase tracking-widest leading-loose">
              An unhandled protocol error has occurred. The TrustChain remains secure, but the interface needs a manual reset.
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 group"
              >
                <RefreshCcw className="w-4 h-4 text-accent group-hover:rotate-180 transition-transform duration-500" />
                Reload Interface
              </button>
              
              <a
                href="/"
                className="w-full py-4 bg-accent hover:bg-accent-hover rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-2xl shadow-accent/20"
              >
                <Home className="w-4 h-4" />
                Return to Core
              </a>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/5 overflow-hidden">
              <p className="text-[9px] font-mono text-red-400 text-left truncate italic">
                {this.state.error && this.state.error.toString()}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
