import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Wallet, Menu, Check, LogOut } from 'lucide-react';
import { connectWallet } from '../lib/freighter';

const Navbar = () => {
  const location = useLocation();
  const [walletAddress, setWalletAddress] = useState(null);

  const handleConnect = async () => {
    const address = await connectWallet();
    if (address) {
      setWalletAddress(address);
    }
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
  };

  const truncate = (addr) =>
    addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : "";

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Worker Portal', path: '/worker' },
    { name: 'Endorse', path: '/endorse' },
    { name: 'Verify', path: '/verify' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-accent/40 group-hover:scale-110 transition-transform duration-500">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tight uppercase italic underline-offset-4 decoration-accent">Trust<span className="text-accent underline decoration-2">Chain</span></span>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40 mt-1">Verified Economy</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden lg:flex items-center gap-1.5 p-1.5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                location.pathname === link.path 
                  ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <button 
            onClick={walletAddress ? handleDisconnect : handleConnect}
            className="hidden sm:flex px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all items-center gap-2 group relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-accent/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
             
             {walletAddress ? (
               <>
                 {/* Show checkmark by default, logout on hover */}
                 <Check className="w-4 h-4 text-green-400 relative z-10 group-hover:hidden animate-in zoom-in duration-300" />
                 <LogOut className="w-4 h-4 text-red-400 relative z-10 hidden group-hover:block animate-in fade-in duration-300" />
                 <span className="relative z-10 group-hover:hidden">
                    {truncate(walletAddress)}
                 </span>
                 <span className="relative z-10 hidden group-hover:block text-red-100">
                    Disconnect
                 </span>
               </>
             ) : (
               <>
                 <Wallet className="w-4 h-4 text-accent relative z-10" />
                 <span className="relative z-10">Connect Wallet</span>
               </>
             )}
          </button>
          
          <button className="lg:hidden p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
