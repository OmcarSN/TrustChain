import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Star, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  Share2, 
  ShieldAlert, 
  Award, 
  ChevronRight,
  User,
  History,
  CheckCircle2,
  Calendar,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getReputation, getEndorsements } from '../lib/stellar';
import { useToast } from '../context/ToastContext';

const Verify = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [workerSearch, setWorkerSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [profile, setProfile] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!workerSearch) return;
    setIsSearching(true);
    try {
      // In a real app, we'd fetch the WorkerCredential metadata from the contract too
      const score = await getReputation(workerSearch);
      const endorsements = await getEndorsements(workerSearch);
      
      setProfile({
        name: "Verified Worker", // Placeholder as WorkerCredential name fetch is a separate call
        address: workerSearch,
        skill: "Technical Specialist",
        city: "Global Protocol",
        bio: "Identity and reputation verified via the TrustChain Soroban protocol. This worker has been endorsed by verified employers on the Stellar network.",
        score: score.average_rating / 100, // Normalized from scaled u32
        totalJobs: score.total_endorsements,
        memberSince: "March 2025",
        endorsements: endorsements
      });
      
      toast.success('Reputation Data Synchronized');
    } catch (error) {
      console.error(error);
      toast.error('Failed to retrieve on-chain data');
    } finally {
      setIsSearching(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Profile Link Copied to Clipboard');
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto">
        {/* Search Header */}
        <section className="mb-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-10 tracking-tighter"
          >
            Verify a <span className="text-accent underline decoration-4 decoration-accent/20 underline-offset-8">Worker's Reputation</span>
          </motion.h1>
          
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="relative max-w-3xl mx-auto group"
          >
            <div className="absolute left-7 top-1/2 -translate-y-1/2 text-white/20">
              <Search className="w-6 h-6" />
            </div>
            <input 
              type="text" 
              placeholder="Enter Soroban Identity (G...)" 
              value={workerSearch}
              onChange={(e) => setWorkerSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-7 pl-16 pr-36 text-white font-black tracking-tight transition-all focus:border-accent/40 focus:outline-none focus:bg-white-[0.08] shadow-2xl text-lg placeholder:text-white/20"
            />
            <button 
              type="submit"
              disabled={isSearching || !workerSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 px-8 py-4 bg-accent text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20 disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Audit Profile'}
            </button>
          </motion.form>
        </section>

        <AnimatePresence mode="wait">
          {profile && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
              {/* Left Side: Reputation Metrics */}
              <div className="lg:col-span-1 space-y-10">
                {/* Reputation Badge Card */}
                <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-transparent" />
                   
                   <div className="text-center mb-10">
                      <div className="w-40 h-40 rounded-full border-[10px] border-accent/10 border-t-accent mx-auto flex items-center justify-center relative mb-8 shadow-[0_0_40px_rgba(124,58,237,0.1)]">
                         <div className="text-center">
                            <div className="text-5xl font-black tracking-tighter">{profile.score > 0 ? profile.score.toFixed(1) : '0.0'}</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mt-1">Status</div>
                         </div>
                      </div>
                      <div className="flex justify-center gap-1.5 mb-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                           <Star key={s} className={`w-5 h-5 ${s <= Math.floor(profile.score) ? 'text-amber-400 fill-amber-400 drop-shadow-sm' : 'text-white/5'}`} />
                        ))}
                      </div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Global Trust Level</p>
                   </div>

                   {/* Stats Grid Snapshot */}
                   <div className="space-y-4 pt-10 border-t border-white/5">
                      <div className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                         <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Total Endorsements</span>
                         <span className="text-sm font-black text-accent">{profile.totalJobs}</span>
                      </div>
                      <div className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                         <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Active Since</span>
                         <span className="text-xs font-bold">{profile.memberSince}</span>
                      </div>
                   </div>
                </div>

                {/* Network Verification Badge */}
                <div className="p-8 rounded-[2.5rem] bg-green-500/5 border border-green-500/10">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                         <ShieldCheck className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                         <h4 className="text-xs font-black uppercase tracking-widest text-white/80">Secured by Soroban</h4>
                         <p className="text-[9px] font-bold text-green-500/60 tracking-widest uppercase">Immutable Ledger Verified</p>
                      </div>
                   </div>
                   <p className="text-xs text-white/40 font-medium leading-relaxed mb-6">
                      Reputation data is permanently stored on the Stellar Network as a persistent NFT-like state.
                   </p>
                   <a href={`https://stellar.expert/explorer/testnet/address/${profile.address}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Audit Ledger</span>
                      <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white transition-all" />
                   </a>
                </div>
              </div>

              {/* Right Side: Professional Summary & Timeline */}
              <div className="lg:col-span-2 space-y-10">
                {/* Profile Summary Card */}
                <div className="p-12 rounded-[3.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                      <Award className="w-32 h-32 text-accent" />
                   </div>
                   <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10 pb-10 border-b border-white/10">
                      <div className="w-24 h-24 rounded-[2rem] bg-accent/20 flex items-center justify-center border border-accent/20 shadow-2xl shadow-accent/20">
                         <User className="w-12 h-12 text-accent" />
                      </div>
                      <div>
                         <h2 className="text-4xl font-black mb-2 tracking-tight">{profile.name}</h2>
                         <div className="flex flex-wrap gap-6 items-center">
                            <div className="flex items-center gap-2 text-white/60 text-xs font-black uppercase tracking-widest">
                               <Briefcase className="w-4 h-4 text-accent" /> {profile.skill}
                            </div>
                            <div className="flex items-center gap-2 text-white/60 text-xs font-black uppercase tracking-widest">
                               <MapPin className="w-4 h-4 text-accent" /> {profile.city}
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   <p className="text-xl text-white/70 leading-relaxed font-medium mb-12 max-w-2xl italic">
                      "{profile.bio}"
                   </p>

                   <div className="flex flex-wrap gap-5">
                      <button 
                        onClick={handleShare}
                        className="flex-1 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 active:scale-95 group"
                      >
                         <Share2 className="w-4 h-4 text-accent group-hover:rotate-12 transition-transform" /> Share Profile
                      </button>
                      <button 
                        onClick={() => navigate('/endorse')}
                        className="flex-1 py-5 bg-accent hover:bg-primary-hover text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-accent/20 border border-accent active:scale-95 hover:bg-accent-hover group"
                      >
                         <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Subside Endorsement
                      </button>
                   </div>
                </div>

                {/* Endorsement History Timeline */}
                <div className="space-y-8">
                   <h3 className="text-2xl font-black flex items-center gap-4 ml-4 tracking-tighter">
                       <div className="w-2 h-8 bg-accent rounded-full" /> Verified History
                   </h3>
                   
                   <div className="space-y-6">
                      {profile.endorsements.length > 0 ? profile.endorsements.map((endorsement, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 relative group overflow-hidden"
                        >
                           <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-3xl -z-10" />
                           
                           <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                                    <ShieldCheck className="w-5 h-5 text-accent" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-0.5">Employer Identity</span>
                                    <span className="text-sm font-mono font-bold text-white/70">{endorsement.endorser}</span>
                                 </div>
                              </div>
                              <div className="flex gap-1.5 p-2 bg-white/5 rounded-xl">
                                 {[1, 2, 3, 4, 5].map((s) => (
                                   <Star key={s} className={`w-3.5 h-3.5 ${s <= endorsement.rating ? 'text-amber-400 fill-amber-400' : 'text-white/5'}`} />
                                 ))}
                              </div>
                           </div>

                           <div className="mb-8">
                              <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-[9px] font-black uppercase tracking-widest text-accent mb-4">
                                 {endorsement.jobType}
                              </div>
                              <p className="text-lg text-white/60 leading-relaxed font-medium italic">
                                 "{endorsement.feedback}"
                              </p>
                           </div>

                           <div className="flex items-center justify-between pt-6 border-t border-white/5">
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                                 <Calendar className="w-3.5 h-3.5" /> {endorsement.date}
                              </div>
                              <a href="#" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors group/link bg-white/5 px-5 py-2 rounded-xl">
                                 Ledger Receipt <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-all" />
                              </a>
                           </div>
                        </motion.div>
                      )) : (
                        <div className="p-10 text-center rounded-[2.5rem] border border-dashed border-white/10 bg-white/5">
                           <History className="w-12 h-12 text-white/10 mx-auto mb-4" />
                           <p className="text-xs font-black uppercase tracking-widest text-white/20">Protocol History Empty</p>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Verify;
