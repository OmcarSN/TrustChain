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
}

// ─── Storage Keys ──────────────────────────────────────────────
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Endorsements(Address),   // Vec<Endorsement> — per-worker endorsements
    Reputation(Address),     // ReputationScore — per-worker reputation
    TotalEndorsements,       // u32 — global endorsement counter
}

// ─── Data Structures ───────────────────────────────────────────
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Endorsement {
    pub endorser_address: Address,
    pub rating: u32,
    pub job_type: String,
    pub feedback: String,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ReputationScore {
    pub total_endorsements: u32,
    pub average_rating: u32,  // Stored as (sum * 100) / count for precision
    pub last_updated: u64,
}

// ─── Contract ──────────────────────────────────────────────────
#[contract]
pub struct ReputationContract;

const TOPIC_ENDORSE: symbol_short = symbol_short!("endorse");
const TOPIC_REP: symbol_short = symbol_short!("repupd");

#[contractimpl]
impl ReputationContract {
    // ── 1. Submit Endorsement ──────────────────────────────────
    /// Submit an on-chain endorsement for a worker.
    /// Endorser must authenticate. Self-endorsement is blocked.
    pub fn submit_endorsement(
        env: Env,
        endorser: Address,
        worker: Address,
        rating: u32,
        job_type: String,
        feedback: String,
    ) -> Result<(), ReputationError> {
        endorser.require_auth();

        // Prevent self-endorsement
        if endorser == worker {
            return Err(ReputationError::SelfEndorsement);
        }

        // Validate rating range (1-5)
        if rating == 0 || rating > 5 {
            return Err(ReputationError::InvalidRating);
        }

        // Fetch existing endorsements
        let mut endorsements: Vec<Endorsement> = env
            .storage()
            .persistent()
            .get(&DataKey::Endorsements(worker.clone()))
            .unwrap_or(Vec::new(&env));

        let new_endorsement = Endorsement {
            endorser_address: endorser,
            rating,
            job_type,
            feedback,
            timestamp: env.ledger().timestamp(),
        };

        endorsements.push_back(new_endorsement);
        env.storage()
            .persistent()
            .set(&DataKey::Endorsements(worker.clone()), &endorsements);

        // Update reputation score
        let mut score: ReputationScore = env
            .storage()
            .persistent()
            .get(&DataKey::Reputation(worker.clone()))
            .unwrap_or(ReputationScore {
                total_endorsements: 0,
                average_rating: 0,
                last_updated: 0,
            });

        let total_rating_sum =
            (score.average_rating * score.total_endorsements) + (rating * 100);
        score.total_endorsements += 1;
        score.average_rating = total_rating_sum / score.total_endorsements;
        score.last_updated = env.ledger().timestamp();

        env.storage()
            .persistent()
            .set(&DataKey::Reputation(worker.clone()), &score);

        // Increment global endorsement counter
        let global: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::TotalEndorsements)
            .unwrap_or(0);
        env.storage()
            .persistent()
            .set(&DataKey::TotalEndorsements, &(global + 1));

        env.events().publish((TOPIC_ENDORSE,), worker);

        Ok(())
    }

    // ── 2. Get Reputation ──────────────────────────────────────
    /// Returns the reputation score for a worker.
    pub fn get_reputation(env: Env, worker: Address) -> ReputationScore {
        env.storage()
            .persistent()
            .get(&DataKey::Reputation(worker))
            .unwrap_or(ReputationScore {
                total_endorsements: 0,
                average_rating: 0,
                last_updated: 0,
            })
    }

    // ── 3. Get Endorsements ────────────────────────────────────
    /// Returns all endorsements for a worker.
    pub fn get_endorsements(env: Env, worker: Address) -> Vec<Endorsement> {
        env.storage()
            .persistent()
            .get(&DataKey::Endorsements(worker))
            .unwrap_or(Vec::new(&env))
    }

    // ── 4. Get Endorsement Count (per worker) ──────────────────
    /// Returns the number of endorsements a worker has received.
    pub fn get_endorsement_count(env: Env, worker: Address) -> u32 {
        let score: ReputationScore = env
            .storage()
            .persistent()
            .get(&DataKey::Reputation(worker))
            .unwrap_or(ReputationScore {
                total_endorsements: 0,
                average_rating: 0,
                last_updated: 0,
            });
        score.total_endorsements
    }

    // ── 5. Get Total Endorsements (global) ─────────────────────
    /// Returns the total number of endorsements across all workers.
    pub fn get_total_endorsements(env: Env) -> u32 {
        env.storage()
            .persistent()
            .get(&DataKey::TotalEndorsements)
            .unwrap_or(0)
    }

    // ── 6. Has Endorsements ────────────────────────────────────
    /// Returns true if the worker has at least one endorsement.
    pub fn has_endorsements(env: Env, worker: Address) -> bool {
        env.storage()
            .persistent()
            .has(&DataKey::Endorsements(worker))
    }
}
