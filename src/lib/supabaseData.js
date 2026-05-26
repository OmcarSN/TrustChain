import { supabase } from './supabase';

// ═══════════════════════════════════════════════════════════════
// WORKERS
// ═══════════════════════════════════════════════════════════════

/**
 * Fetches a single worker by wallet address.
 * @param {string} walletAddress - Stellar wallet address (G...)
 * @returns {Promise<Object|null>} Worker data or null if not found
 */
export async function getWorker(walletAddress) {
  try {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('wallet_address', walletAddress)
      .maybeSingle();

    if (error) {
      console.error('[supabaseData] getWorker error:', error.message);
      return null;
    }
    if (!data) return null;

    // Map DB columns → app-expected shape
    return {
      name: data.name || 'Worker',
      fullName: data.name || 'Worker',
      skill: data.skill || data.occupation || 'Unknown',
      skillCategory: data.skill || data.occupation || 'Unknown',
      experience: data.experience || 'Unknown',
      city: data.city || 'Unknown',
      bio: data.bio || '',
      phone: data.phone || '',
      photo_url: data.photo_url || '',
      timestamp: data.created_at || null,
    };
  } catch (err) {
    console.error('[supabaseData] getWorker exception:', err);
    return null;
  }
}

/**
 * Upserts a worker record. If the wallet_address exists, updates it.
 * @param {string} walletAddress
 * @param {Object} workerData - { name, skill, experience, city, bio, ... }
 * @returns {Promise<boolean>} true on success
 */
export async function upsertWorker(walletAddress, workerData) {
  try {
    const row = {
      wallet_address: walletAddress,
      name: workerData.name || workerData.fullName || 'Worker',
      occupation: workerData.skill || workerData.skillCategory || '',
      skill: workerData.skill || workerData.skillCategory || '',
      experience: String(workerData.experience || ''),
      city: workerData.city || '',
      bio: workerData.bio || '',
      phone: workerData.phone || '',
    };

    const { error } = await supabase
      .from('workers')
      .upsert(row, { onConflict: 'wallet_address' });

    if (error) {
      console.error('[supabaseData] upsertWorker error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[supabaseData] upsertWorker exception:', err);
    return false;
  }
}

/**
 * Returns all registered worker wallet addresses.
 * Replaces localStorage 'trustchain_worker_registry'.
 * @returns {Promise<string[]>} Array of wallet addresses
 */
export async function getWorkerRegistry() {
  try {
    const { data, error } = await supabase
      .from('workers')
      .select('wallet_address');

    if (error) {
      console.error('[supabaseData] getWorkerRegistry error:', error.message);
      return [];
    }
    return (data || []).map(r => r.wallet_address);
  } catch (err) {
    console.error('[supabaseData] getWorkerRegistry exception:', err);
    return [];
  }
}

/**
 * Returns all workers with their endorsement data pre-joined.
 * Optimized single-query alternative to getAllWorkers() in DiscoverWorkers.
 * @returns {Promise<Array>} Workers with computed reputation data
 */
export async function getAllWorkersWithEndorsements() {
  try {
    // Fetch all workers
    const { data: workers, error: wErr } = await supabase
      .from('workers')
      .select('*');

    if (wErr) {
      console.error('[supabaseData] getAllWorkersWithEndorsements workers error:', wErr.message);
      return [];
    }

    // Fetch all endorsements in one query
    const { data: allEndorsements, error: eErr } = await supabase
      .from('endorsements')
      .select('*');

    if (eErr) {
      console.error('[supabaseData] getAllWorkersWithEndorsements endorsements error:', eErr.message);
      // Continue with empty endorsements
    }

    // Group endorsements by worker_wallet
    const endorsementMap = {};
    (allEndorsements || []).forEach(e => {
      if (!endorsementMap[e.worker_wallet]) endorsementMap[e.worker_wallet] = [];
      endorsementMap[e.worker_wallet].push(e);
    });

    return (workers || []).map(w => ({
      address: w.wallet_address,
      name: w.name || 'Unknown',
      skill: w.skill || w.occupation || 'General',
      city: w.city || 'Unknown',
      experience: w.experience || 0,
      bio: w.bio || '',
      phone: w.phone || '',
      timestamp: w.created_at,
      endorsements: (endorsementMap[w.wallet_address] || []).map(e => ({
        endorser: e.endorser_wallet,
        worker: e.worker_wallet,
        rating: e.rating,
        jobType: e.job_type,
        feedback: e.feedback,
        txHash: e.tx_hash,
        timestamp: e.created_at,
      })),
    }));
  } catch (err) {
    console.error('[supabaseData] getAllWorkersWithEndorsements exception:', err);
    return [];
  }
}


// ═══════════════════════════════════════════════════════════════
// ENDORSEMENTS
// ═══════════════════════════════════════════════════════════════

/**
 * Fetches all endorsements received by a worker.
 * Replaces localStorage 'endorsements_{address}'.
 * @param {string} workerWallet
 * @returns {Promise<Array>} Endorsement objects in app shape
 */
export async function getEndorsements(workerWallet) {
  try {
    const { data, error } = await supabase
      .from('endorsements')
      .select('*')
      .eq('worker_wallet', workerWallet)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[supabaseData] getEndorsements error:', error.message);
      return [];
    }

    return (data || []).map(e => ({
      endorser: e.endorser_wallet,
      worker: e.worker_wallet,
      rating: e.rating,
      jobType: e.job_type,
      feedback: e.feedback,
      txHash: e.tx_hash,
      timestamp: e.created_at,
    }));
  } catch (err) {
    console.error('[supabaseData] getEndorsements exception:', err);
    return [];
  }
}

/**
 * Fetches all endorsements given BY a specific endorser.
 * Replaces the localStorage iteration pattern for "endorsements given".
 * @param {string} endorserWallet
 * @returns {Promise<Array>} Endorsement objects
 */
export async function getEndorsementsGiven(endorserWallet) {
  try {
    const { data, error } = await supabase
      .from('endorsements')
      .select('*')
      .eq('endorser_wallet', endorserWallet)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[supabaseData] getEndorsementsGiven error:', error.message);
      return [];
    }

    return (data || []).map(e => ({
      endorser: e.endorser_wallet,
      worker: e.worker_wallet,
      rating: e.rating,
      jobType: e.job_type,
      feedback: e.feedback,
      txHash: e.tx_hash,
      timestamp: e.created_at,
    }));
  } catch (err) {
    console.error('[supabaseData] getEndorsementsGiven exception:', err);
    return [];
  }
}

/**
 * Adds a new endorsement.
 * Replaces localStorage push to 'endorsements_{address}'.
 * @param {Object} endorsement - { endorser, worker, rating, jobType, feedback, txHash }
 * @returns {Promise<boolean>} true on success
 */
export async function addEndorsement(endorsement) {
  try {
    const { error } = await supabase
      .from('endorsements')
      .insert({
        endorser_wallet: endorsement.endorser,
        worker_wallet: endorsement.worker,
        rating: endorsement.rating,
        job_type: endorsement.jobType,
        feedback: endorsement.feedback,
        tx_hash: endorsement.txHash,
      });

    if (error) {
      console.error('[supabaseData] addEndorsement error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[supabaseData] addEndorsement exception:', err);
    return false;
  }
}


// ═══════════════════════════════════════════════════════════════
// MONITOR LOGS
// ═══════════════════════════════════════════════════════════════

/**
 * Logs an error to the monitor_logs table.
 * @param {Error|string} error
 * @param {string} context
 */
export async function logMonitorError(error, context) {
  try {
    await supabase
      .from('monitor_logs')
      .insert({
        log_type: 'error',
        data: {
          message: error.message || String(error),
          stack: error.stack || null,
          context,
          timestamp: new Date().toISOString(),
        },
      });
  } catch (err) {
    console.error('[supabaseData] logMonitorError failed:', err);
  }
}

/**
 * Logs a successful transaction to the monitor_logs table.
 * @param {string} txHash
 * @param {string} type
 * @param {string} wallet
 */
export async function logMonitorTransaction(txHash, type, wallet) {
  try {
    await supabase
      .from('monitor_logs')
      .insert({
        log_type: 'transaction',
        data: {
          txHash,
          type,
          wallet,
          timestamp: new Date().toISOString(),
        },
      });
  } catch (err) {
    console.error('[supabaseData] logMonitorTransaction failed:', err);
  }
}

/**
 * Retrieves error logs.
 * @returns {Promise<Array>} Error log entries, newest first
 */
export async function getMonitorErrorLog() {
  try {
    const { data, error } = await supabase
      .from('monitor_logs')
      .select('*')
      .eq('log_type', 'error')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('[supabaseData] getMonitorErrorLog error:', error.message);
      return [];
    }
    return (data || []).map(r => r.data);
  } catch (err) {
    console.error('[supabaseData] getMonitorErrorLog exception:', err);
    return [];
  }
}

/**
 * Retrieves transaction logs.
 * @returns {Promise<Array>} Transaction log entries, newest first
 */
export async function getMonitorTxLog() {
  try {
    const { data, error } = await supabase
      .from('monitor_logs')
      .select('*')
      .eq('log_type', 'transaction')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('[supabaseData] getMonitorTxLog error:', error.message);
      return [];
    }
    return (data || []).map(r => r.data);
  } catch (err) {
    console.error('[supabaseData] getMonitorTxLog exception:', err);
    return [];
  }
}

/**
 * Clears all monitor logs.
 */
export async function clearMonitorLogs() {
  try {
    await supabase.from('monitor_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  } catch (err) {
    console.error('[supabaseData] clearMonitorLogs failed:', err);
  }
}


// ═══════════════════════════════════════════════════════════════
// ACTIVITY LOG
// ═══════════════════════════════════════════════════════════════

/**
 * Logs an activity event to the activity_log table.
 * @param {string} walletAddress
 * @param {string} action - e.g. "mint_credential", "endorse_worker"
 */
export async function logActivity(walletAddress, action) {
  try {
    await supabase
      .from('activity_log')
      .insert({
        wallet_address: walletAddress,
        action,
      });
  } catch (err) {
    console.error('[supabaseData] logActivity failed:', err);
  }
}
