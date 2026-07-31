import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Clock, CheckCircle2, XCircle, AlertCircle, Plus, ChevronDown, ExternalLink, Vote, Loader2, Pause, Play, Hash } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import {
  getAllProposals, getVoteTally, getCouncil, isCouncilMember,
  hasVoted, getAdmin, getProposalCount, getQuorumPercent,
  isGovernancePaused, createProposal, voteOnProposal,
  finalizeProposal, executeProposal, isGovernanceContractAvailable,
  STATUS_LABELS, TYPE_LABELS
} from '../lib/governanceContract';
import PageBackground from '../components/PageBackground';

/**
 * Governance — DAO-style governance dashboard for TrustChain.
 * Public read, council-member write. Shows proposals, voting, council members.
 */
const Governance = () => {
  const { walletAddress, isConnected } = useWallet();
  const toast = useToast();

  // ── State ──
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [council, setCouncil] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [quorum, setQuorum] = useState(51);
  const [paused, setPaused] = useState(false);
  const [proposalCount, setProposalCount] = useState(0);
  const [isUserCouncil, setIsUserCouncil] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [tallies, setTallies] = useState({});
  const [votedMap, setVotedMap] = useState({});

  // Create proposal form
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState(6);
  const [formTarget, setFormTarget] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [votingId, setVotingId] = useState(null);

  // ── Load data ──
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [props, councilList, adminAddr, count, quorumPct, isPaused] = await Promise.all([
        getAllProposals(),
        getCouncil(),
        getAdmin(),
        getProposalCount(),
        getQuorumPercent(),
        isGovernancePaused(),
      ]);

      setProposals(props.reverse());
      setCouncil(councilList);
      setAdmin(adminAddr);
      setProposalCount(count);
      setQuorum(quorumPct);
      setPaused(isPaused);

      // Load tallies for each proposal
      const tallyMap = {};
      for (const p of props) {
        const t = await getVoteTally(p.id);
        if (t) tallyMap[p.id] = t;
      }
      setTallies(tallyMap);

      // Check if connected user is council / admin
      if (walletAddress) {
        const isMember = await isCouncilMember(walletAddress);
        setIsUserCouncil(isMember);
        setIsUserAdmin(adminAddr === walletAddress);

        // Check vote status for each active proposal
        const vMap = {};
        for (const p of props) {
          if (p.status === 0) {
            vMap[p.id] = await hasVoted(p.id, walletAddress);
          }
        }
        setVotedMap(vMap);
      }
    } catch (err) {
      console.error('[Governance] Load error:', err);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (isGovernanceContractAvailable()) loadData();
    else setLoading(false);
  }, [loadData]);

  // ── Handlers ──
  const handleCreateProposal = async () => {
    if (!formTitle.trim() || !formDesc.trim()) {
      toast.error('Title and description are required');
      return;
    }
    if ([0, 3, 4].includes(formType) && !formTarget.trim()) {
      toast.error('Target address is required for this proposal type');
      return;
    }
    setSubmitting(true);
    try {
      const target = formTarget.trim() || walletAddress;
      await createProposal(walletAddress, formTitle, formDesc, formType, target);
      toast.success('Proposal created on-chain!');
      setShowForm(false);
      setFormTitle(''); setFormDesc(''); setFormType(6); setFormTarget('');
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to create proposal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (proposalId, approve) => {
    setVotingId(proposalId);
    try {
      await voteOnProposal(walletAddress, proposalId, approve);
      toast.success(`Vote ${approve ? 'YES' : 'NO'} recorded on-chain!`);
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Vote failed');
    } finally {
      setVotingId(null);
    }
  };

  const handleFinalize = async (proposalId) => {
    setVotingId(proposalId);
    try {
      await finalizeProposal(walletAddress, proposalId);
      toast.success('Proposal finalized!');
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Finalization failed');
    } finally {
      setVotingId(null);
    }
  };

  const handleExecute = async (proposalId) => {
    setVotingId(proposalId);
    try {
      await executeProposal(walletAddress, proposalId);
      toast.success('Proposal executed on-chain!');
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Execution failed');
    } finally {
      setVotingId(null);
    }
  };

  // ── Helpers ──
  const trunc = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '—';

  const statusColor = (status) => {
    const colors = { 0: '#4F6BED', 1: '#7C93F2', 2: '#ef4444', 3: '#3D56C9', 4: '#6b7280' };
    return colors[status] || '#6b7280';
  };

  const statusBg = (status) => {
    const colors = { 0: 'rgba(79,107,237,0.12)', 1: 'rgba(124,147,242,0.12)', 2: 'rgba(239,68,68,0.12)', 3: 'rgba(61,86,201,0.12)', 4: 'rgba(107,114,128,0.12)' };
    return colors[status] || 'rgba(107,114,128,0.12)';
  };

  // ── Not Available ──
  if (!isGovernanceContractAvailable()) {
    return (
      <div className="min-h-screen bg-[#05060A] relative overflow-hidden text-white">
        <PageBackground />
        <div style={{ paddingTop: '120px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <Shield style={{ width: 48, height: 48, color: 'rgba(255,255,255,0.15)', margin: '0 auto 20px' }} />
          <h1 className="font-clash" style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Governance</h1>
          <p className="font-inter" style={{ color: '#666', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
            The governance contract has not been deployed yet. Deploy the contract and set the <code style={{ color: '#7C93F2' }}>VITE_GOVERNANCE_CONTRACT_ID</code> environment variable to enable this page.
          </p>
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#05060A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F6BED]" />
      </div>
    );
  }

  const activeCount = proposals.filter(p => p.status === 0).length;

  return (
    <div className="min-h-screen bg-[#05060A] relative overflow-hidden text-white">
      <PageBackground />

      <div style={{ paddingTop: '90px', paddingBottom: '64px', paddingLeft: '60px', paddingRight: '60px', position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p className="font-inter" style={{ color: '#7C93F2', fontSize: '11px', letterSpacing: '0.2em', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>
                <Shield style={{ width: 12, height: 12, display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                ON-CHAIN GOVERNANCE
              </p>
              <h1 className="font-clash" style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: 1.1 }}><span className="text-gradient">Governance Dashboard</span></h1>
              <p className="font-inter" style={{ color: '#666', fontSize: '13px', marginTop: '6px' }}>Decentralized proposals, voting, and contract management</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {paused && (
                <span style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '4px', letterSpacing: '0.1em' }}>
                  ⏸ CONTRACT PAUSED
                </span>
              )}
              {isUserCouncil && (
                <span style={{ background: 'rgba(79,107,237,0.12)', color: '#7C93F2', fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '4px', letterSpacing: '0.1em' }}>
                  ✓ COUNCIL MEMBER
                </span>
              )}
              {isUserAdmin && (
                <span style={{ background: 'rgba(61,86,201,0.12)', color: '#7C93F2', fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '4px', letterSpacing: '0.1em' }}>
                  ★ ADMIN
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Proposals', value: proposalCount, icon: <Hash style={{ width: 16, height: 16 }} />, color: '#4F6BED' },
            { label: 'Active', value: activeCount, icon: <Clock style={{ width: 16, height: 16 }} />, color: '#f5a623' },
            { label: 'Council Members', value: council.length, icon: <Users style={{ width: 16, height: 16 }} />, color: '#7C93F2' },
            { label: 'Quorum Required', value: `${quorum}%`, icon: <Vote style={{ width: 16, height: 16 }} />, color: '#3D56C9' },
          ].map((stat, i) => (
            <div key={i} className="stat-card-premium">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ color: stat.color, opacity: 0.7 }}>{stat.icon}</div>
                <span className="font-inter" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', fontWeight: '600', textTransform: 'uppercase' }}>{stat.label}</span>
              </div>
              <span className="font-clash counter-glow" style={{ fontSize: '28px', fontWeight: '800', color: stat.color }}>{stat.value}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Council Panel ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span className="font-inter" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', fontWeight: '600', textTransform: 'uppercase' }}>
              <Users style={{ width: 12, height: 12, display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              GOVERNANCE COUNCIL
            </span>
            {admin && (
              <span className="font-inter" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>
                Admin: <span style={{ color: '#7C93F2' }}>{trunc(admin)}</span>
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {council.length === 0 ? (
              <span className="font-inter" style={{ color: '#444', fontSize: '13px' }}>No council members yet</span>
            ) : council.map((addr, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontFamily: 'monospace', color: addr === walletAddress ? '#7C93F2' : 'rgba(255,255,255,0.5)' }}>
                {trunc(addr)} {addr === walletAddress && <span style={{ fontSize: '9px', color: '#7C93F2' }}>(you)</span>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Create Proposal Button ── */}
        {isUserCouncil && isConnected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ marginBottom: '24px' }}>
            <button onClick={() => setShowForm(!showForm)}
              className={showForm ? 'btn-outline-glow' : 'btn-glow'}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus style={{ width: 16, height: 16 }} /> {showForm ? 'Cancel' : 'Create Proposal'}
            </button>
          </motion.div>
        )}

        {/* ── Create Proposal Form ── */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="glass-card" style={{ marginBottom: '32px', overflow: 'hidden' }}>
              <h3 className="font-clash" style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>New Proposal</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label className="font-inter" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Title</label>
                  <input value={formTitle} onChange={e => setFormTitle(e.target.value)} maxLength={128} placeholder="Proposal title..."
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: 'white', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label className="font-inter" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Description</label>
                  <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} maxLength={1024} rows={4} placeholder="Describe your proposal..."
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: 'white', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="font-inter" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Proposal Type</label>
                    <select value={formType} onChange={e => setFormType(Number(e.target.value))}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: 'white', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none' }}>
                      {TYPE_LABELS.map((label, i) => <option key={i} value={i} style={{ background: '#111' }}>{label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-inter" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Target Address {[0,3,4].includes(formType) ? '(Required)' : '(Optional)'}</label>
                    <input value={formTarget} onChange={e => setFormTarget(e.target.value)} placeholder="G..."
                      style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: 'white', fontSize: '13px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <button onClick={handleCreateProposal} disabled={submitting}
                  className="btn-glow" style={{ width: '100%', opacity: submitting ? 0.6 : 1, cursor: submitting ? 'wait' : 'pointer' }}>
                  {submitting ? 'Submitting to blockchain...' : 'Submit Proposal On-Chain'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Proposals List ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span className="font-inter" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', fontWeight: '600', textTransform: 'uppercase' }}>
              ALL PROPOSALS ({proposals.length})
            </span>
          </div>

          {proposals.length === 0 ? (
            <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <Vote style={{ width: 32, height: 32, color: 'rgba(255,255,255,0.1)', margin: '0 auto 12px' }} />
              <p className="font-inter" style={{ color: '#444', fontSize: '14px' }}>No proposals yet</p>
              <p className="font-inter" style={{ color: '#333', fontSize: '12px', marginTop: '4px' }}>Council members can create the first proposal</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {proposals.map((p, i) => {
                const tally = tallies[p.id];
                const totalVotes = tally ? tally.yesVotes + tally.noVotes : 0;
                const yesPercent = totalVotes > 0 ? (tally.yesVotes / totalVotes) * 100 : 0;
                const userVoted = votedMap[p.id];
                const isActive = p.status === 0;
                const isPassed = p.status === 1;

                return (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                    className="glass-card" style={{ borderLeft: isActive ? '3px solid #4F6BED' : isPassed ? '3px solid #7C93F2' : 'none' }}>

                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span style={{ background: statusBg(p.status), color: statusColor(p.status), fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            {STATUS_LABELS[p.status] || 'Unknown'}
                          </span>
                          <span style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: '600', padding: '3px 8px', borderRadius: '4px' }}>
                            {p.proposalTypeName}
                          </span>
                          <span className="font-inter" style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px' }}>
                            #{p.id}
                          </span>
                        </div>
                        <h3 className="font-clash" style={{ fontSize: '16px', fontWeight: '700', lineHeight: 1.3 }}>{p.title}</h3>
                        <p className="font-inter" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px', lineHeight: 1.5 }}>
                          {p.description?.length > 200 ? p.description.slice(0, 200) + '...' : p.description}
                        </p>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="font-inter" style={{ display: 'flex', gap: '16px', fontSize: '10px', color: 'rgba(255,255,255,0.2)', marginBottom: '14px', flexWrap: 'wrap' }}>
                      <span>Proposer: <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{trunc(p.proposer)}</span></span>
                      {p.targetAddress && <span>Target: <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{trunc(p.targetAddress)}</span></span>}
                      <span>Created: {p.createdAt ? new Date(p.createdAt * 1000).toLocaleDateString() : '—'}</span>
                    </div>

                    {/* Vote Tally Bar */}
                    {tally && (
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '6px' }}>
                          <span className="font-inter" style={{ color: '#7C93F2', fontWeight: '700' }}>YES {tally.yesVotes}</span>
                          <span className="font-inter" style={{ color: 'rgba(255,255,255,0.2)' }}>{totalVotes}/{tally.totalEligible} voted</span>
                          <span className="font-inter" style={{ color: '#ef4444', fontWeight: '700' }}>NO {tally.noVotes}</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
                          <div style={{ width: `${yesPercent}%`, background: 'linear-gradient(90deg, #4F6BED, #3D56C9)', borderRadius: '3px 0 0 3px', transition: 'width 0.5s ease' }} />
                          <div style={{ flex: 1, background: totalVotes > 0 ? 'rgba(239,68,68,0.3)' : 'transparent', borderRadius: '0 3px 3px 0' }} />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {isConnected && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {/* Vote buttons */}
                        {isActive && isUserCouncil && !userVoted && (
                          <>
                            <button onClick={() => handleVote(p.id, true)} disabled={votingId === p.id}
                              style={{ background: 'rgba(79,107,237,0.12)', color: '#7C93F2', border: '1px solid rgba(79,107,237,0.2)', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {votingId === p.id ? <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 style={{ width: 12, height: 12 }} />} Vote YES
                            </button>
                            <button onClick={() => handleVote(p.id, false)} disabled={votingId === p.id}
                              style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {votingId === p.id ? <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} /> : <XCircle style={{ width: 12, height: 12 }} />} Vote NO
                            </button>
                          </>
                        )}
                        {isActive && userVoted && (
                          <span className="font-inter" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', padding: '6px 0' }}>✓ You have voted</span>
                        )}
                        {/* Finalize */}
                        {isActive && (
                          <button onClick={() => handleFinalize(p.id)} disabled={votingId === p.id}
                            style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                            Finalize
                          </button>
                        )}
                        {/* Execute */}
                        {isPassed && isUserAdmin && (
                          <button onClick={() => handleExecute(p.id)} disabled={votingId === p.id}
                            style={{ background: 'linear-gradient(135deg, #4F6BED, #3D56C9)', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {votingId === p.id ? <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} /> : <Shield style={{ width: 12, height: 12 }} />} Execute
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Governance;
