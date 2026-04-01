#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, symbol_short};

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
    pub average_rating: u32, // Stored as (sum * 100) / count
    pub last_updated: u64,
}

#[contract]
pub struct ReputationContract;

const ENDORSEMENTS: symbol_short = symbol_short!("ENDS");
const REPUTATION: symbol_short = symbol_short!("REPU");

#[contractimpl]
impl ReputationContract {
    pub fn submit_endorsement(
        env: Env,
        endorser: Address,
        worker: Address,
        rating: u32,
        job_type: String,
        feedback: String,
    ) {
        endorser.require_auth();

        let mut endorsements: Vec<Endorsement> = env
            .storage()
            .persistent()
            .get(&worker)
            .unwrap_or(Vec::new(&env));

        let new_endorsement = Endorsement {
            endorser_address: endorser,
            rating,
            job_type,
            feedback,
            timestamp: env.ledger().timestamp(),
        };

        endorsements.push_back(new_endorsement);
        env.storage().persistent().set(&worker, &endorsements);

        // Update Reputation Score
        let mut score: ReputationScore = env
            .storage()
            .persistent()
            .get(&worker)
            .unwrap_or(ReputationScore {
                total_endorsements: 0,
                average_rating: 0,
                last_updated: 0,
            });

        let total_rating_sum = (score.average_rating * score.total_endorsements) + (rating * 100);
        score.total_endorsements += 1;
        score.average_rating = total_rating_sum / score.total_endorsements;
        score.last_updated = env.ledger().timestamp();

        env.storage().persistent().set(&worker, &score);
    }

    pub fn get_reputation(env: Env, worker: Address) -> ReputationScore {
        env.storage().persistent().get(&worker).unwrap_or(ReputationScore {
            total_endorsements: 0,
            average_rating: 0,
            last_updated: 0,
        })
    }

    pub fn get_endorsements(env: Env, worker: Address) -> Vec<Endorsement> {
        env.storage().persistent().get(&worker).unwrap_or(Vec::new(&env))
    }
}
