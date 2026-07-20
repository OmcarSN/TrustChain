import React from 'react';
import PropTypes from 'prop-types';
import { ShieldAlert, RefreshCcw, Home } from 'lucide-react';

/**
 * ErrorBoundary — React class component error boundary.
 * Catches unhandled errors in the component tree and renders a
 * branded fallback UI with reload and home navigation actions.
 * Logs caught errors to the console for debugging.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, isReloading: false };
  }

  static getDerivedStateFromError(error) {
    const isChunkLoadError = error.name === 'ChunkLoadError' || 
      (error.message && (error.message.includes('Failed to fetch dynamically imported module') || error.message.includes('Importing a module script failed')));
      
    if (isChunkLoadError && !sessionStorage.getItem('trustchain_chunk_reloaded')) {
       return { hasError: true, error, isReloading: true };
    }
    return { hasError: true, error, isReloading: false };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    
    // Detect Vite dynamic import failure (usually means a new deployment happened)
    const isChunkLoadError = error.name === 'ChunkLoadError' || 
      (error.message && (error.message.includes('Failed to fetch dynamically imported module') || error.message.includes('Importing a module script failed')));
      
    if (isChunkLoadError) {
      // Prevent infinite reload loop if the new chunk is actually broken
      if (!sessionStorage.getItem('trustchain_chunk_reloaded')) {
        sessionStorage.setItem('trustchain_chunk_reloaded', 'true');
        window.location.reload();
      }
    } else {
      // Reset the flag on successful navigation/catch of normal errors
      sessionStorage.removeItem('trustchain_chunk_reloaded');
    }
  }

  render() {
    if (this.state.isReloading) {
      return <div className="min-h-screen bg-[#05060A]" />;
    }

    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#05060A] flex items-center justify-center p-6 text-white text-center">
          <div className="max-w-md w-full p-10 rounded-[2px] bg-white/[0.02] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-red-400" />
            <div className="w-16 h-16 rounded-[2px] bg-red-400/10 flex items-center justify-center mx-auto mb-8 border border-red-400/20">
              <ShieldAlert className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="font-clash text-3xl font-bold mb-4 tracking-tighter">System Fault</h1>
            <p className="text-white/30 text-sm leading-relaxed mb-10 font-inter">
              An unhandled error has occurred. The TrustChain remains secure, but the interface needs a reset.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.reload()}
                className="w-full py-4 border border-white/10 rounded-[2px] font-bold uppercase tracking-[0.15em] text-[10px] hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                <RefreshCcw className="w-4 h-4 text-white/40" /> Reload Interface
              </button>
              <a href="/" className="w-full py-4 bg-white text-black rounded-[2px] font-bold uppercase tracking-[0.15em] text-[10px] hover:opacity-85 transition-all flex items-center justify-center gap-2">
                <Home className="w-4 h-4" /> Return to Core
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-white/5 overflow-hidden">
              <p className="text-[9px] font-mono text-red-400/60 text-left truncate italic">
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

ErrorBoundary.propTypes = {
  /** Child component tree to wrap with error boundary protection. */
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
