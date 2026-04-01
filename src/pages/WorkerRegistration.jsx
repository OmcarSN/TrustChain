import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Briefcase, 
  Calendar, 
  FileText, 
  Wallet, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { isConnected } from '@stellar/freighter-api';
import { connectFreighter, issueCredential } from '../lib/stellar';
import { useToast } from '../context/ToastContext';

const WorkerRegistration = () => {
  const toast = useToast();
  const [address, setAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    skillCategory: '',
    experience: '',
    city: '',
    bio: ''
  });

  const skillCategories = [
    'Construction',
    'Domestic Work',
    'Transport',
    'Agriculture',
    'Other'
  ];

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const publicKey = await connectFreighter();
      setAddress(publicKey);
      toast.success('Stellar Identity Synchronized');
    } catch (error) {
      toast.error(error.message || 'Authentication Failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'bio' && value.length > 200) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMintCredential = async () => {
    setIsMinting(true);
    try {
      const hash = await issueCredential({
        fullName: formData.fullName,
        skillCategory: formData.skillCategory,
        city: formData.city,
        yearsExperience: formData.experience,
        bio: formData.bio
      }, address);
      
      setTxHash(hash);
      setIsSuccess(true);
      toast.success('Skill Credential Minted on Soroban');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Transaction Failed');
    } finally {
      setIsMinting(false);
    }
  };

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const isFormValid = formData.fullName && formData.skillCategory && formData.experience && formData.city && formData.bio && address;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-3xl mx-auto">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 md:p-12 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Worker Registration</h1>
              <p className="text-white/40 font-medium font-inter uppercase tracking-widest text-[9px]">Sovereign Identity Protocol</p>
            </div>

            {/* Wallet Status */}
            <div>
              {address ? (
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 leading-none mb-1">Authenticated</span>
                    <span className="text-sm font-mono font-bold text-white/80">{truncateAddress(address)}</span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shadow-xl group active:scale-95 disabled:opacity-50"
                >
                  {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4 text-accent group-hover:rotate-12 transition-transform" />}
                  Connect Freighter Wallet
                </button>
              )}
            </div>
          </div>

          {/* Registration Form */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Skill Category */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Skill Category</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <select
                    name="skillCategory"
                    value={formData.skillCategory}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-10 text-white appearance-none focus:outline-none focus:border-accent/40 transition-all font-medium"
                  >
                    <option value="" disabled className="bg-[#0f1016]">Select Category</option>
                    {skillCategories.map(cat => (
                      <option key={cat} value={cat} className="bg-[#0f1016]">{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Years of Experience</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g. 5"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 transition-all font-medium"
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Pune, India"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Short Bio</label>
                <span className="text-[10px] font-black text-white/20">{formData.bio.length}/200</span>
              </div>
              <div className="relative">
                <FileText className="absolute left-4 top-5 w-4 h-4 text-white/20" />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about your work..."
                  rows="4"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 transition-all font-medium resize-none"
                />
              </div>
            </div>

            {/* Submit Section */}
            <div className="pt-8">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full flex-col flex items-center justify-center p-10 bg-green-500/10 border border-green-500/20 rounded-[2.5rem]"
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-400 mb-6" />
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">On-Chain Identity Issued</h3>
                    <p className="text-green-400/60 font-bold text-[10px] uppercase tracking-[0.3em] mb-8">Verified on Soroban Smart Contract</p>
                    
                    <a 
                      href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors font-black uppercase tracking-widest text-[9px] bg-white/5 px-6 py-3 rounded-xl border border-white/10 group"
                    >
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      View on Stellar Expert
                    </a>
                  </motion.div>
                ) : (
                  <button
                    onClick={handleMintCredential}
                    disabled={!isFormValid || isMinting}
                    className="w-full py-7 bg-accent hover:bg-accent-hover disabled:bg-white/5 disabled:text-white/10 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all shadow-2xl shadow-accent/20 flex items-center justify-center gap-3 relative overflow-hidden group active:scale-[0.98]"
                  >
                    {isMinting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Signing Credential...
                      </>
                    ) : (
                      <>
                        Mint Sovereign Credential
                        <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                    {!isFormValid && !address && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="text-[10px] font-black text-white/80">Connect Wallet to Begin Registration</span>
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
  );
};

export default WorkerRegistration;
