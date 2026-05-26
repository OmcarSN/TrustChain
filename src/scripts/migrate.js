/**
 * TrustChain localStorage → Supabase Migration Script
 *
 * One-time migration that reads existing localStorage data and upserts
 * into the Supabase workers and endorsements tables.
 *
 * Usage:
 *   1. Open the TrustChain app in your browser
 *   2. Open the browser console (F12 → Console)
 *   3. Run: import('/src/scripts/migrate.js')
 *
 * Or import and call from any component:
 *   import { runMigration } from './scripts/migrate';
 *   await runMigration();
 *
 * This script is idempotent — safe to run multiple times.
 */

import { supabase } from '../lib/supabase';

/**
 * Migrates all localStorage worker and endorsement data to Supabase.
 * @returns {Promise<{workers: number, endorsements: number, errors: string[]}>}
 */
export async function runMigration() {
  const results = { workers: 0, endorsements: 0, errors: [] };

  console.log('🚀 TrustChain Migration: Starting localStorage → Supabase migration...');

  // ── 1. Migrate Worker Registry ──
  let registry = [];
  try {
    registry = JSON.parse(localStorage.getItem('trustchain_worker_registry') || '[]');
    console.log(`📋 Found ${registry.length} workers in registry`);
  } catch (err) {
    results.errors.push(`Failed to parse worker registry: ${err.message}`);
    console.error('❌ Failed to parse worker registry:', err);
  }

  // ── 2. Migrate each worker ──
  for (const walletAddress of registry) {
    try {
      const raw = localStorage.getItem(`trustchain_worker_${walletAddress}`);
      if (!raw) continue;

      const data = JSON.parse(raw);
      const row = {
        wallet_address: walletAddress,
        name: data.name || data.fullName || 'Worker',
        occupation: data.skill || data.skillCategory || '',
        skill: data.skill || data.skillCategory || '',
        experience: String(data.experience || ''),
        city: data.city || '',
        bio: data.bio || '',
        phone: data.phone || '',
      };

      const { error } = await supabase
        .from('workers')
        .upsert(row, { onConflict: 'wallet_address' });

      if (error) {
        results.errors.push(`Worker ${walletAddress}: ${error.message}`);
        console.error(`❌ Worker ${walletAddress}:`, error.message);
      } else {
        results.workers++;
        console.log(`✅ Worker migrated: ${walletAddress.slice(0, 8)}...`);
      }
    } catch (err) {
      results.errors.push(`Worker ${walletAddress}: ${err.message}`);
      console.error(`❌ Worker ${walletAddress}:`, err);
    }
  }

  // ── 3. Migrate endorsements ──
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('endorsements_')) continue;

    try {
      const endorsements = JSON.parse(localStorage.getItem(key) || '[]');

      for (const e of endorsements) {
        const row = {
          endorser_wallet: e.endorser,
          worker_wallet: e.worker,
          rating: e.rating,
          job_type: e.jobType || '',
          feedback: e.feedback || '',
          tx_hash: e.txHash || '',
        };

        const { error } = await supabase
          .from('endorsements')
          .upsert(row, {
            onConflict: 'endorser_wallet,worker_wallet,tx_hash',
            ignoreDuplicates: true,
          });

        if (error) {
          // If conflict resolution fails, try a simple insert
          const { error: insertErr } = await supabase
            .from('endorsements')
            .insert(row);

          if (insertErr && !insertErr.message.includes('duplicate')) {
            results.errors.push(`Endorsement ${e.endorser} → ${e.worker}: ${insertErr.message}`);
            console.error(`❌ Endorsement:`, insertErr.message);
          } else {
            results.endorsements++;
          }
        } else {
          results.endorsements++;
        }
      }
    } catch (err) {
      results.errors.push(`Endorsement key ${key}: ${err.message}`);
      console.error(`❌ Endorsement key ${key}:`, err);
    }
  }

  // ── Summary ──
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('🏁 TrustChain Migration Complete!');
  console.log(`   ✅ Workers migrated:      ${results.workers}`);
  console.log(`   ✅ Endorsements migrated:  ${results.endorsements}`);
  console.log(`   ❌ Errors:                ${results.errors.length}`);
  if (results.errors.length > 0) {
    console.log('   Errors:', results.errors);
  }
  console.log('═══════════════════════════════════════');

  return results;
}

// Auto-run when imported directly
runMigration();
