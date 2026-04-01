import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Star, 
  MapPin, 
  Briefcase, 
  Wallet, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft,
  ChevronDown,
  User,
  Hash,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { connectFreighter, submitEndorsement, getReputation } from '../lib/stellar';
import { useToast } from '../context/ToastContext';

const Endorse = () => {
  const toast = useToast();
  const [employerAddress, setEmployerAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [workerSearch, setWorkerSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundWorker, setFoundWorker] = useState(null);

  const [rating, setRating] = useState(0);
  const [jobType, setJobType] = useState('');
  const [feedback, setFeedback] = useState('');
  
  const [isSigning, setIsSigning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleConnectEmployer = async () => {
    setIsConnecting(true);
    try {
      const publicKey = await connectFreighter();
      setEmployerAddress(publicKey);
      toast.success('Employer Identity Verified');
    } catch (error) {
      toast.error(error.message || 'Connection Failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const findWorker = () => {
    if (!workerSearch) return;
    setIsSearching(true);
    // In a real app, we'd fetch the WorkerCredential from the contract here
    setTimeout(() => {
      setFoundWorker({
        name: "Raju Sharma",
        skill: "Construction",
        city: "Pune",
        rating: 4.2,
        totalEndorsements: 7,
        address: workerSearch
      });
      setIsSearching(false);
      toast.success('Verified Identity Found');
    }, 800);
  };

  const handleEndorse = async () => {
    setIsSigning(true);
    try {
      const hash = await submitEndorsement({
        workerAddress: foundWorker.address,
        rating,
        jobType,
        feedback
      }, employerAddress);
      
      setTxHash(hash);
      setIsSuccess(true);
      toast.success('Endorsement Sealed on Stellar');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Transaction Failed');
    } finally {
      setIsSigning(false);
    }
  };

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const canEndorse = employerAddress && foundWorker && rating > 0 && jobType && feedback.trim();

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-accent transition-colors font-bold text-sm group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        {/* Top Section: Employer Connection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl font-black mb-1">Endorse a Pro</h1>
            <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[9px]">Decentralized Trust Network</p>
          </div>

          <div>
            {employerAddress ? (
              <div className="flex items-center gap-3 bg-accent/10 border border-accent/20 px-6 py-3.5 rounded-2xl">
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent mb-0.5 leading-none">Employer Identity</span>
                    <span className="text-sm font-mono font-bold text-white/80">{truncateAddress(employerAddress)}</span>
                 </div>
                 <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                    <ShieldCheck className="w-5 h-5 text-white" />
                 </div>
              </div>
            ) : (
              <button
                onClick={handleConnectEmployer}
                disabled={isConnecting}
                className="px-8 py-4 bg-accent hover:bg-accent-hover text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shadow-2xl shadow-accent/40 active:scale-95 disabled:opacity-50"
              >
                {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                Connect Employer ID
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Search & Worker Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl">
               <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-4 ml-1">Search Worker Identity</label>
               <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="text" 
                      placeholder="G..." 
                      value={workerSearch}
                      onChange={(e) => setWorkerSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-accent/40 transition-all font-medium"
                    />
                  </div>
                  <button 
                    onClick={findWorker}
                    disabled={isSearching || !workerSearch}
                    className="p-3.5 bg-accent text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
                  >
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  </button>
               </div>
            </div>

            <AnimatePresence>
               {foundWorker && (
                 <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="p-8 rounded-[2.5rem] bg-gradient-to-br from-accent/5 to-transparent border border-white/10 relative overflow-hidden group"
                 >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                       <User className="w-24 h-24" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                          <User className="w-8 h-8 text-accent" />
                       </div>
                       <div>
                          <h3 className="text-xl font-black mb-0.5">{foundWorker.name}</h3>
                          <div className="flex items-center gap-1.5 text-white/40 text-xs font-bold uppercase tracking-widest">
                             <MapPin className="w-3 h-3" /> {foundWorker.city}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Primary Skill</span>
                          <span className="text-sm font-bold text-accent">{foundWorker.skill}</span>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 bg-white/5 rounded-xl border border-white/5 text-center">
                             <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
                                <Star className="w-4 h-4 fill-amber-400" />
                                <span className="text-sm font-black">{foundWorker.rating}</span>
                             </div>
                             <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Reputation</span>
                          </div>
                          <div className="p-5 bg-white/5 rounded-xl border border-white/5 text-center">
                             <div className="text-sm font-black mb-1">{foundWorker.totalEndorsements}</div>
                             <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Endorsements</span>
                          </div>
                       </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5">
                       <span className="text-[9px] font-mono text-white/20 block truncate">{foundWorker.address}</span>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </div>

          {/* Right Column: Endorsement Form */}
          <div className="lg:col-span-3">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="p-10 md:p-12 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl relative"
             >
                {!foundWorker && (
                   <div className="absolute inset-0 bg-background/40 backdrop-blur-md z-10 flex items-center justify-center rounded-[3rem]">
                      <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">Registry Search Required</p>
                   </div>
                )}

                <h2 className="text-3xl font-black mb-10 border-b border-white/5 pb-8 tracking-tight">New Endorsement</h2>

                <div className="space-y-8">
                   {/* Star Rating */}
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-accent block ml-1">Reliability & Proficiency</label>
                      <div className="flex gap-4">
                         {[1, 2, 3, 4, 5].map((s) => (
                           <button
                             key={s}
                             onClick={() => setRating(s)}
                             className="group transition-transform active:scale-90"
                           >
                              <Star className={`w-9 h-9 transition-colors ${rating >= s ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]' : 'text-white/5'}`} />
                           </button>
                         ))}
                      </div>
                   </div>

                   {/* Job Type Dropdown */}
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block ml-1">Job Specification</label>
                      <div className="relative">
                         <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                         <select 
                           value={jobType}
                           onChange={(e) => setJobType(e.target.value)}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-10 text-white appearance-none focus:outline-none focus:border-accent/40 transition-all font-medium"
                         >
                            <option value="" disabled className="bg-[#0f1016]">Context of Work</option>
                            <option value="One-time Job" className="bg-[#0f1016]">One-time Job</option>
                            <option value="Recurring" className="bg-[#0f1016]">Recurring</option>
                            <option value="Contract" className="bg-[#0f1016]">Contract</option>
                         </select>
                         <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      </div>
                   </div>

                   {/* Feedback Textarea */}
                   <div className="space-y-4">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Verified Review</label>
                        <span className="text-[9px] font-black text-white/20 tracking-widest">{feedback.length} / 300</span>
                      </div>
                      <textarea 
                         value={feedback}
                         onChange={(e) => e.target.value.length <= 300 && setFeedback(e.target.value)}
                         placeholder="Describe the professionalism and quality of work..."
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:outline-none focus:border-accent/40 transition-all font-medium min-h-[140px] resize-none"
                      />
                   </div>

                   {/* Action Button */}
                   <div className="pt-4">
                      <AnimatePresence mode="wait">
                         {isSuccess ? (
                           <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="w-full p-8 bg-green-500/10 border border-green-500/20 rounded-3xl"
                           >
                              <div className="flex items-center gap-3 mb-6">
                                 <CheckCircle2 className="w-6 h-6 text-green-400" />
                                 <h4 className="text-md font-black text-white uppercase tracking-tight">Endorsement Recorded on Stellar</h4>
                              </div>
                              <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col gap-4">
                                 <div className="flex items-center gap-3">
                                    <Hash className="w-3.5 h-3.5 text-white/20" />
                                    <span className="text-[10px] font-mono text-white/40 truncate">{txHash}</span>
                                 </div>
                                 <a 
                                    href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-accent hover:text-white transition-colors"
                                 >
                                    <ExternalLink className="w-3 h-3" /> View Transaction
                                 </a>
                              </div>
                           </motion.div>
                         ) : (
                           <button 
                             onClick={handleEndorse}
                             disabled={!canEndorse || isSigning}
                             className="w-full py-7 bg-accent hover:bg-accent-hover disabled:bg-white/5 disabled:text-white/10 text-white rounded-3xl font-black uppercase tracking-[0.4em] text-[11px] transition-all shadow-2xl shadow-accent/30 flex items-center justify-center gap-3 relative group active:scale-[0.98]"
                           >
                              {isSigning ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  Waiting for Freighter Signature...
                                </>
                              ) : (
                                <>
                                  Sign & Seal Endorsement
                                  <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </>
                              )}
                              {!employerAddress && (
                                <div className="absolute inset-0 bg-black/70 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none px-6 text-center">
                                   <span className="text-[9px] font-black tracking-widest">Employer Authentication Required</span>
                                </div>
                              )}
                           </button>
                         )}
                      </AnimatePresence>
                   </div>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Endorse;
