#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype,
    Address, Env, String, Vec, symbol_short,
};

// ─── Error Types ───────────────────────────────────────────────
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ReputationError {
    NotFound = 1,
    Unauthorized = 2,
    SelfEndorsement = 3,
    InvalidRating = 4,
    DuplicateEndorsement = 5,
    DisputeAlreadyExists = 6,
    DisputeNotFound = 7,
    InvalidInput = 8,
    AlreadyInitialized = 9,
    EndorsementNotFound = 10,
    ContractPaused = 11, // NEW: Circuit breaker pattern
}

// ─── Storage Keys ──────────────────────────────────────────────
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,                           // Address — contract administrator
    Initialized,                     // bool — initialization guard
    Endorsements(Address),           // Vec<Endorsement> — per-worker endorsements
    Reputation(Address),             // ReputationScore — per-worker reputation
    EndorsementPair(Address, Address, String), // bool — duplicate check (endorser, worker, job_type)
    TotalEndorsements,               // u32 — global endorsement counter
    TrustTier(Address),              // u32 — computed trust tier
    Disputes(Address),               // Vec<Dispute> — per-worker disputes
    ActiveDisputeCount,              // u32 — global pending disputes
    Paused,                          // bool — global emergency pause (circuit breaker)
}

// ─── Trust Tier Constants ──────────────────────────────────────
const TIER_BRONZE: u32 = 0;
const TIER_SILVER: u32 = 1;
const TIER_GOLD: u32 = 2;
const TIER_PLATINUM: u32 = 3;

// ─── Constants ─────────────────────────────────────────────────
const MAX_FEEDBACK_LEN: u32 = 512;
const MAX_JOB_TYPE_LEN: u32 = 64;
const DECAY_HALF_LIFE_SECS: u64 = 180 * 24 * 60 * 60; // 180 days
const TTL_EXTEND_AMOUNT: u32 = 518_400;

// ─── Data Structures ───────────────────────────────────────────
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Endorsement {
    pub endorser_address: Address,
    pub rating: u32,
    pub job_type: String,
    pub feedback: String,
    pub timestamp: u64,
    pub weight: u32,     // NEW: computed weight (100 = full, decays over time)
    pub is_disputed: bool, // NEW: dispute flag
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ReputationScore {
    pub total_endorsements: u32,
    pub average_rating: u32,    // Stored as rating * 100 for precision (e.g., 450 = 4.50)
    pub weighted_score: u32,    // NEW: time-weighted score (* 100)
    pub last_updated: u64,
    pub trust_tier: u32,        // NEW: 0=Bronze, 1=Silver, 2=Gold, 3=Platinum
    pub disputed_count: u32,    // NEW: number of disputed endorsements
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Dispute {
    pub endorsement_index: u32,
    pub reason: String,
    pub filed_by: Address,
    pub filed_at: u64,
    pub resolved: bool,
    pub resolution: String,     // admin resolution note
}

// ─── Contract ──────────────────────────────────────────────────
#[contract]
pub struct ReputationContract;

const TOPIC_INIT: symbol_short = symbol_short!("init");
const TOPIC_ENDORSE: symbol_short = symbol_short!("endorse");
const TOPIC_REP: symbol_short = symbol_short!("repupd");
const TOPIC_TIER: symbol_short = symbol_short!("tier");
const TOPIC_DISPUTE: symbol_short = symbol_short!("dispute");
const TOPIC_RESOLVE: symbol_short = symbol_short!("resolve");

#[contractimpl]
impl ReputationContract {
    // ══════════════════════════════════════════════════════════════
    // 1. INITIALIZATION
    // ══════════════════════════════════════════════════════════════

    /// Initialize the reputation contract with an admin.
    pub fn initialize(env: Env, admin: Address) -> Result<(), ReputationError> {
        if env.storage().persistent().has(&DataKey::Initialized) {
            return Err(ReputationError::AlreadyInitialized);
        }

        admin.require_auth();

        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::Initialized, &true);
        env.storage().persistent().set(&DataKey::TotalEndorsements, &0u32);
        env.storage().persistent().set(&DataKey::ActiveDisputeCount, &0u32);
        env.storage().persistent().set(&DataKey::Paused, &false); // Starts unpaused

        env.events().publish((TOPIC_INIT,), admin);

        Ok(())
    }

    // ══════════════════════════════════════════════════════════════
    // 2. SUBMIT ENDORSEMENT
    // ══════════════════════════════════════════════════════════════

    /// Submit an on-chain endorsement for a worker.
    /// Prevents self-endorsement and duplicate endorsements for the same job type.
    pub fn submit_endorsement(
        env: Env,
        endorser: Address,
        worker: Address,
        rating: u32,
        job_type: String,
        feedback: String,
    ) -> Result<(), ReputationError> {
        // Enforce Circuit Breaker (Contract Pause)
        if env.storage().persistent().get(&DataKey::Paused).unwrap_or(false) {
            return Err(ReputationError::ContractPaused);
        }

        endorser.require_auth();

        // ── Validation ──
        if endorser == worker {
            return Err(ReputationError::SelfEndorsement);
        }
        if rating == 0 || rating > 5 {
            return Err(ReputationError::InvalidRating);
        }
        if feedback.len() > MAX_FEEDBACK_LEN {
            return Err(ReputationError::InvalidInput);
        }
        if job_type.len() > MAX_JOB_TYPE_LEN {
            return Err(ReputationError::InvalidInput);
        }

        // ── Duplicate prevention ──
        let pair_key = DataKey::EndorsementPair(
            endorser.clone(),
            worker.clone(),
            job_type.clone(),
        );
        if env.storage().persistent().has(&pair_key) {
            return Err(ReputationError::DuplicateEndorsement);
        }

        // ── Create endorsement ──
        let now = env.ledger().timestamp();
        let new_endorsement = Endorsement {
            endorser_address: endorser.clone(),
            rating,
            job_type,
            feedback,
            timestamp: now,
            weight: 100, // Full weight when new
            is_disputed: false,
        };

        // ── Store endorsement ──
        let mut endorsements: Vec<Endorsement> = env
            .storage()
            .persistent()
            .get(&DataKey::Endorsements(worker.clone()))
            .unwrap_or(Vec::new(&env));

        endorsements.push_back(new_endorsement);
        env.storage()
            .persistent()
            .set(&DataKey::Endorsements(worker.clone()), &endorsements);

        // ── Mark pair as used (duplicate prevention) ──
        env.storage().persistent().set(&pair_key, &true);

        // ── Update reputation score with time-decay weighting ──
        Self::recalculate_reputation(&env, &worker, &endorsements);

        // ── Increment global counter ──
        let global: u32 = env.storage().persistent()
            .get(&DataKey::TotalEndorsements).unwrap_or(0);
        env.storage().persistent()
            .set(&DataKey::TotalEndorsements, &(global + 1));

        env.events().publish((TOPIC_ENDORSE,), (endorser, worker));

        Ok(())
    }

    // ══════════════════════════════════════════════════════════════
    // 3. REPUTATION RECALCULATION (TIME-DECAY WEIGHTED)
    // ══════════════════════════════════════════════════════════════

    /// Internal: recalculate reputation with time-decay weighting.
    /// Recent endorsements count more than old ones.
    fn recalculate_reputation(
        env: &Env,
        worker: &Address,
        endorsements: &Vec<Endorsement>,
    ) {
        let now = env.ledger().timestamp();
        let mut total_weight: u64 = 0;
        let mut weighted_rating_sum: u64 = 0;
        let mut simple_rating_sum: u64 = 0;
        let mut valid_count: u32 = 0;
        let mut disputed_count: u32 = 0;

        for i in 0..endorsements.len() {
            let e = endorsements.get(i).unwrap();

            if e.is_disputed {
                disputed_count += 1;
                continue; // Skip disputed endorsements from score
            }

            valid_count += 1;
            simple_rating_sum += e.rating as u64;

            // Calculate decay weight: halves every DECAY_HALF_LIFE_SECS
            let age = if now > e.timestamp { now - e.timestamp } else { 0 };
            let decay_factor = if age < DECAY_HALF_LIFE_SECS {
                100u64 // Full weight if recent
            } else if age < DECAY_HALF_LIFE_SECS * 2 {
                75u64  // 75% weight
            } else if age < DECAY_HALF_LIFE_SECS * 4 {
                50u64  // 50% weight
            } else {
                25u64  // 25% minimum weight
            };

            weighted_rating_sum += (e.rating as u64) * decay_factor;
            total_weight += decay_factor;
        }

        let average_rating = if valid_count > 0 {
            ((simple_rating_sum * 100) / valid_count as u64) as u32
        } else {
            0
        };

        let weighted_score = if total_weight > 0 {
            ((weighted_rating_sum * 100) / total_weight) as u32
        } else {
            0
        };

        // Calculate trust tier
        let trust_tier = Self::compute_trust_tier(valid_count, average_rating);

        let score = ReputationScore {
            total_endorsements: endorsements.len(),
            average_rating,
            weighted_score,
            last_updated: now,
            trust_tier,
            disputed_count,
        };

        env.storage().persistent()
            .set(&DataKey::Reputation(worker.clone()), &score);
        env.storage().persistent()
            .set(&DataKey::TrustTier(worker.clone()), &trust_tier);

        env.events().publish((TOPIC_TIER,), (worker.clone(), trust_tier));
    }

    /// Compute trust tier based on endorsement count and average rating.
    fn compute_trust_tier(endorsement_count: u32, avg_rating: u32) -> u32 {
        if endorsement_count >= 20 && avg_rating >= 400 {
            TIER_PLATINUM
        } else if endorsement_count >= 10 && avg_rating >= 350 {
            TIER_GOLD
        } else if endorsement_count >= 5 && avg_rating >= 300 {
            TIER_SILVER
        } else {
            TIER_BRONZE
        }
    }

    // ══════════════════════════════════════════════════════════════
    // 4. DISPUTE SYSTEM
    // ══════════════════════════════════════════════════════════════

    /// File a dispute against a specific endorsement.
    /// The worker or admin can dispute a fraudulent endorsement.
    pub fn file_dispute(
        env: Env,
        filed_by: Address,
        worker: Address,
        endorsement_index: u32,
        reason: String,
    ) -> Result<(), ReputationError> {
        // Enforce Circuit Breaker
        if env.storage().persistent().get(&DataKey::Paused).unwrap_or(false) {
            return Err(ReputationError::ContractPaused);
        }

        filed_by.require_auth();

        // Verify endorsement exists
        let endorsements: Vec<Endorsement> = env.storage().persistent()
            .get(&DataKey::Endorsements(worker.clone()))
            .ok_or(ReputationError::NotFound)?;

        if endorsement_index >= endorsements.len() {
            return Err(ReputationError::EndorsementNotFound);
        }

        let now = env.ledger().timestamp();

        let dispute = Dispute {
            endorsement_index,
            reason,
            filed_by: filed_by.clone(),
            filed_at: now,
            resolved: false,
            resolution: String::from_str(&env, ""),
        };

        let mut disputes: Vec<Dispute> = env.storage().persistent()
            .get(&DataKey::Disputes(worker.clone()))
            .unwrap_or(Vec::new(&env));

        disputes.push_back(dispute);
        env.storage().persistent()
            .set(&DataKey::Disputes(worker.clone()), &disputes);

        // Increment active dispute count
        let count: u32 = env.storage().persistent()
            .get(&DataKey::ActiveDisputeCount).unwrap_or(0);
        env.storage().persistent()
            .set(&DataKey::ActiveDisputeCount, &(count + 1));

        env.events().publish((TOPIC_DISPUTE,), (worker, endorsement_index));

        Ok(())
    }

    /// Admin-only: resolve a dispute by marking the endorsement as disputed.
    /// This removes the endorsement from the reputation calculation.
    pub fn resolve_dispute(
        env: Env,
        worker: Address,
        dispute_index: u32,
        remove_endorsement: bool,
        resolution_note: String,
    ) -> Result<(), ReputationError> {
        let admin: Address = env.storage().persistent()
            .get(&DataKey::Admin)
            .ok_or(ReputationError::Unauthorized)?;
        admin.require_auth();

        // Update dispute status
        let mut disputes: Vec<Dispute> = env.storage().persistent()
            .get(&DataKey::Disputes(worker.clone()))
            .ok_or(ReputationError::DisputeNotFound)?;

        if dispute_index >= disputes.len() {
            return Err(ReputationError::DisputeNotFound);
        }

        let mut dispute = disputes.get(dispute_index).unwrap();
        dispute.resolved = true;
        dispute.resolution = resolution_note;

        let endorsement_idx = dispute.endorsement_index;
        disputes.set(dispute_index, dispute);
        env.storage().persistent()
            .set(&DataKey::Disputes(worker.clone()), &disputes);

        // If removing the endorsement, mark it as disputed
        if remove_endorsement {
            let mut endorsements: Vec<Endorsement> = env.storage().persistent()
                .get(&DataKey::Endorsements(worker.clone()))
                .ok_or(ReputationError::NotFound)?;

            if endorsement_idx < endorsements.len() {
                let mut e = endorsements.get(endorsement_idx).unwrap();
                e.is_disputed = true;
                endorsements.set(endorsement_idx, e);
                env.storage().persistent()
                    .set(&DataKey::Endorsements(worker.clone()), &endorsements);

                // Recalculate reputation without disputed endorsement
                Self::recalculate_reputation(&env, &worker, &endorsements);
            }
        }

        // Decrement active dispute count
        let count: u32 = env.storage().persistent()
            .get(&DataKey::ActiveDisputeCount).unwrap_or(1);
        if count > 0 {
            env.storage().persistent()
                .set(&DataKey::ActiveDisputeCount, &(count - 1));
        }

        env.events().publish((TOPIC_RESOLVE,), (worker, dispute_index));

        Ok(())
    }

    // ══════════════════════════════════════════════════════════════
    // 5. CIRCUIT BREAKER (EMERGENCY PAUSE)
    // ══════════════════════════════════════════════════════════════

    /// Emergency pause for the entire contract system in case of active attack.
    pub fn pause_contract(env: Env) -> Result<(), ReputationError> {
        let admin: Address = env.storage().persistent()
            .get(&DataKey::Admin)
            .ok_or(ReputationError::Unauthorized)?;
        admin.require_auth();

        env.storage().persistent().set(&DataKey::Paused, &true);
        Ok(())
    }

    /// Resume the contract after an emergency.
    pub fn resume_contract(env: Env) -> Result<(), ReputationError> {
        let admin: Address = env.storage().persistent()
            .get(&DataKey::Admin)
            .ok_or(ReputationError::Unauthorized)?;
        admin.require_auth();

        env.storage().persistent().set(&DataKey::Paused, &false);
        Ok(())
    }

    /// Check if contract is currently paused
    pub fn is_paused(env: Env) -> bool {
        env.storage().persistent().get(&DataKey::Paused).unwrap_or(false)
    }

    // ══════════════════════════════════════════════════════════════
    // 6. TTL MANAGEMENT
    // ══════════════════════════════════════════════════════════════

    /// Extend TTL of a worker's endorsement data.
    pub fn extend_worker_ttl(env: Env, worker: Address) {
        if env.storage().persistent().has(&DataKey::Endorsements(worker.clone())) {
            env.storage().persistent().extend_ttl(
                &DataKey::Endorsements(worker.clone()),
                TTL_EXTEND_AMOUNT,
                TTL_EXTEND_AMOUNT,
            );
        }
        if env.storage().persistent().has(&DataKey::Reputation(worker.clone())) {
            env.storage().persistent().extend_ttl(
                &DataKey::Reputation(worker),
                TTL_EXTEND_AMOUNT,
                TTL_EXTEND_AMOUNT,
            );
        }
    }

    /// Extend TTL of contract instance storage.
    pub fn extend_instance_ttl(env: Env) {
        env.storage().instance().extend_ttl(TTL_EXTEND_AMOUNT, TTL_EXTEND_AMOUNT);
    }

    // ══════════════════════════════════════════════════════════════
    // 6. READ FUNCTIONS
    // ══════════════════════════════════════════════════════════════

    /// Returns the full reputation score for a worker.
    pub fn get_reputation(env: Env, worker: Address) -> ReputationScore {
        env.storage().persistent()
            .get(&DataKey::Reputation(worker))
            .unwrap_or(ReputationScore {
                total_endorsements: 0,
                average_rating: 0,
                weighted_score: 0,
                last_updated: 0,
                trust_tier: TIER_BRONZE,
                disputed_count: 0,
            })
    }

    /// Returns all endorsements for a worker.
    pub fn get_endorsements(env: Env, worker: Address) -> Vec<Endorsement> {
        env.storage().persistent()
            .get(&DataKey::Endorsements(worker))
            .unwrap_or(Vec::new(&env))
    }

    /// Returns the trust tier (0-3) for a worker.
    pub fn get_trust_tier(env: Env, worker: Address) -> u32 {
        env.storage().persistent()
            .get(&DataKey::TrustTier(worker))
            .unwrap_or(TIER_BRONZE)
    }

    /// Returns trust tier name as a string.
    pub fn get_trust_tier_name(env: Env, worker: Address) -> String {
        let tier = Self::get_trust_tier(env.clone(), worker);
        match tier {
            TIER_PLATINUM => String::from_str(&env, "Platinum"),
            TIER_GOLD => String::from_str(&env, "Gold"),
            TIER_SILVER => String::from_str(&env, "Silver"),
            _ => String::from_str(&env, "Bronze"),
        }
    }

    /// Returns the endorsement count for a worker.
    pub fn get_endorsement_count(env: Env, worker: Address) -> u32 {
        let score = Self::get_reputation(env, worker);
        score.total_endorsements
    }

    /// Returns the total endorsements across all workers.
    pub fn get_total_endorsements(env: Env) -> u32 {
        env.storage().persistent()
            .get(&DataKey::TotalEndorsements)
            .unwrap_or(0)
    }

    /// Returns true if the worker has at least one endorsement.
    pub fn has_endorsements(env: Env, worker: Address) -> bool {
        env.storage().persistent()
            .has(&DataKey::Endorsements(worker))
    }

    /// Returns disputes for a worker.
    pub fn get_disputes(env: Env, worker: Address) -> Vec<Dispute> {
        env.storage().persistent()
            .get(&DataKey::Disputes(worker))
            .unwrap_or(Vec::new(&env))
    }

    /// Returns the number of active (unresolved) disputes globally.
    pub fn get_active_dispute_count(env: Env) -> u32 {
        env.storage().persistent()
            .get(&DataKey::ActiveDisputeCount)
            .unwrap_or(0)
    }

    /// Returns the admin address.
    pub fn get_admin(env: Env) -> Option<Address> {
        env.storage().persistent().get(&DataKey::Admin)
    }
}

// ═══════════════════════════════════════════════════════════════
// UNIT TESTS
// ═══════════════════════════════════════════════════════════════
#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Ledger};
    use soroban_sdk::Env;

    fn setup() -> (Env, ReputationContractClient<'static>, Address) {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(ReputationContract, ());
        let client = ReputationContractClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        client.initialize(&admin);
        (env, client, admin)
    }

    #[test]
    fn test_initialize() {
        let (_, client, _) = setup();
        assert!(client.get_admin().is_some());
        assert_eq!(client.get_total_endorsements(), 0);
    }

    #[test]
    fn test_submit_endorsement() {
        let (env, client, _) = setup();
        let endorser = Address::generate(&env);
        let worker = Address::generate(&env);
        let job = String::from_str(&env, "Plumbing");
        let feedback = String::from_str(&env, "Great work!");

        client.submit_endorsement(&endorser, &worker, &4, &job, &feedback);

        assert!(client.has_endorsements(&worker));
        assert_eq!(client.get_endorsement_count(&worker), 1);
        assert_eq!(client.get_total_endorsements(), 1);

        let rep = client.get_reputation(&worker);
        assert_eq!(rep.total_endorsements, 1);
        assert_eq!(rep.average_rating, 400); // 4.00 * 100
    }

    #[test]
    fn test_self_endorsement_blocked() {
        let (env, client, _) = setup();
        let worker = Address::generate(&env);
        let job = String::from_str(&env, "Plumbing");
        let feedback = String::from_str(&env, "Self review");

        let result = client.try_submit_endorsement(&worker, &worker, &5, &job, &feedback);
        assert!(result.is_err());
    }

    #[test]
    fn test_invalid_rating_blocked() {
        let (env, client, _) = setup();
        let endorser = Address::generate(&env);
        let worker = Address::generate(&env);
        let job = String::from_str(&env, "Plumbing");
        let feedback = String::from_str(&env, "Test");

        // Rating 0
        let result = client.try_submit_endorsement(&endorser, &worker, &0, &job, &feedback);
        assert!(result.is_err());

        // Rating 6
        let result = client.try_submit_endorsement(&endorser, &worker, &6, &job, &feedback);
        assert!(result.is_err());
    }

    #[test]
    fn test_duplicate_endorsement_blocked() {
        let (env, client, _) = setup();
        let endorser = Address::generate(&env);
        let worker = Address::generate(&env);
        let job = String::from_str(&env, "Plumbing");
        let feedback = String::from_str(&env, "Good!");

        client.submit_endorsement(&endorser, &worker, &4, &job, &feedback);

        // Same endorser, same worker, same job type → blocked
        let result = client.try_submit_endorsement(&endorser, &worker, &5, &job, &feedback);
        assert!(result.is_err());
    }

    #[test]
    fn test_same_endorser_different_job_allowed() {
        let (env, client, _) = setup();
        let endorser = Address::generate(&env);
        let worker = Address::generate(&env);
        let job1 = String::from_str(&env, "Plumbing");
        let job2 = String::from_str(&env, "Electrical");
        let feedback = String::from_str(&env, "Good!");

        client.submit_endorsement(&endorser, &worker, &4, &job1, &feedback);
        client.submit_endorsement(&endorser, &worker, &5, &job2, &feedback);

        assert_eq!(client.get_endorsement_count(&worker), 2);
    }

    #[test]
    fn test_trust_tiers() {
        let (env, client, _) = setup();
        let worker = Address::generate(&env);
        let feedback = String::from_str(&env, "Excellent!");

        // Submit 5 endorsements with rating 4 → Silver
        for i in 0..5u32 {
            let endorser = Address::generate(&env);
            let job = String::from_str(&env, "Job");
            // Use different job types by creating unique strings
            client.submit_endorsement(&endorser, &worker, &4, &job, &feedback);
        }

        let rep = client.get_reputation(&worker);
        assert_eq!(rep.trust_tier, TIER_SILVER);
    }

    #[test]
    fn test_trust_tier_platinum() {
        let (env, client, _) = setup();
        let worker = Address::generate(&env);
        let feedback = String::from_str(&env, "Perfect!");

        // Submit 20 endorsements with rating 5 → Platinum
        for _ in 0..20u32 {
            let endorser = Address::generate(&env);
            let job = String::from_str(&env, "Job");
            client.submit_endorsement(&endorser, &worker, &5, &job, &feedback);
        }

        assert_eq!(client.get_trust_tier(&worker), TIER_PLATINUM);
    }

    #[test]
    fn test_trust_tier_name() {
        let (env, client, _) = setup();
        let worker = Address::generate(&env);

        let tier_name = client.get_trust_tier_name(&worker);
        assert_eq!(tier_name, String::from_str(&env, "Bronze"));
    }

    #[test]
    fn test_file_dispute() {
        let (env, client, _) = setup();
        let endorser = Address::generate(&env);
        let worker = Address::generate(&env);
        let job = String::from_str(&env, "Plumbing");
        let feedback = String::from_str(&env, "Good!");

        client.submit_endorsement(&endorser, &worker, &4, &job, &feedback);

        let reason = String::from_str(&env, "Fraudulent review");
        client.file_dispute(&worker, &worker, &0, &reason);

        let disputes = client.get_disputes(&worker);
        assert_eq!(disputes.len(), 1);
        assert_eq!(client.get_active_dispute_count(), 1);
    }

    #[test]
    fn test_resolve_dispute_removes_endorsement() {
        let (env, client, _) = setup();
        let endorser = Address::generate(&env);
        let worker = Address::generate(&env);
        let job = String::from_str(&env, "Plumbing");
        let feedback = String::from_str(&env, "Fake review");

        client.submit_endorsement(&endorser, &worker, &5, &job, &feedback);
        assert_eq!(client.get_reputation(&worker).average_rating, 500);

        // File and resolve dispute, removing the endorsement
        let reason = String::from_str(&env, "Fraudulent");
        client.file_dispute(&worker, &worker, &0, &reason);

        let note = String::from_str(&env, "Confirmed fraudulent");
        client.resolve_dispute(&worker, &0, &true, &note);

        // Reputation should reflect removal
        let rep = client.get_reputation(&worker);
        assert_eq!(rep.disputed_count, 1);
        assert_eq!(client.get_active_dispute_count(), 0);
    }

    #[test]
    fn test_time_decay_weighting() {
        let (env, client, _) = setup();
        let worker = Address::generate(&env);
        let feedback = String::from_str(&env, "Good work");

        // Submit an old endorsement
        let endorser1 = Address::generate(&env);
        let job1 = String::from_str(&env, "Old Job");
        client.submit_endorsement(&endorser1, &worker, &3, &job1, &feedback);

        // Advance time by 1 year
        env.ledger().with_mut(|li| {
            li.timestamp += 365 * 24 * 60 * 60;
        });

        // Submit a recent endorsement with higher rating
        let endorser2 = Address::generate(&env);
        let job2 = String::from_str(&env, "New Job");
        client.submit_endorsement(&endorser2, &worker, &5, &job2, &feedback);

        let rep = client.get_reputation(&worker);
        // Weighted score should favor the recent 5-star over old 3-star
        assert!(rep.weighted_score > rep.average_rating);
    }

    #[test]
    fn test_multiple_workers_independent() {
        let (env, client, _) = setup();
        let worker1 = Address::generate(&env);
        let worker2 = Address::generate(&env);
        let endorser = Address::generate(&env);
        let job = String::from_str(&env, "Plumbing");
        let feedback = String::from_str(&env, "Good!");

        client.submit_endorsement(&endorser, &worker1, &5, &job, &feedback);
        client.submit_endorsement(&endorser, &worker2, &2, &job, &feedback);

        assert_eq!(client.get_reputation(&worker1).average_rating, 500);
        assert_eq!(client.get_reputation(&worker2).average_rating, 200);
        assert_eq!(client.get_total_endorsements(), 2);
    }

    #[test]
    fn test_dispute_invalid_index() {
        let (env, client, _) = setup();
        let worker = Address::generate(&env);
        let endorser = Address::generate(&env);
        let job = String::from_str(&env, "Plumbing");
        let feedback = String::from_str(&env, "Good!");

        client.submit_endorsement(&endorser, &worker, &4, &job, &feedback);

        // Try to dispute index 5 (doesn't exist)
        let reason = String::from_str(&env, "Fake");
        let result = client.try_file_dispute(&worker, &worker, &5, &reason);
        assert!(result.is_err());
    }
}
