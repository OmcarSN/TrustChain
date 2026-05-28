#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype,
    Address, Env, String, Symbol, Vec,
};

// ─── Error Types ───────────────────────────────────────────────
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum GovernanceError {
    AlreadyInitialized = 1,
    NotFound = 2,
    Unauthorized = 3,
    InvalidInput = 4,
    ProposalExpired = 5,
    AlreadyVoted = 6,
    ProposalNotActive = 7,
    QuorumNotReached = 8,
    AlreadyExecuted = 9,
    ProposalStillActive = 10,
    MaxCouncilReached = 11,
    NotCouncilMember = 12,
    ContractPaused = 13,
}

// ─── Proposal Status ───────────────────────────────────────────
const STATUS_ACTIVE: u32 = 0;
const STATUS_PASSED: u32 = 1;
const STATUS_REJECTED: u32 = 2;
const STATUS_EXECUTED: u32 = 3;
const STATUS_EXPIRED: u32 = 4;

// ─── Proposal Types ────────────────────────────────────────────
const PROPOSAL_ADMIN_TRANSFER: u32 = 0;
const PROPOSAL_PAUSE_CONTRACT: u32 = 1;
const PROPOSAL_RESUME_CONTRACT: u32 = 2;
const PROPOSAL_ADD_COUNCIL: u32 = 3;
const PROPOSAL_REMOVE_COUNCIL: u32 = 4;
const PROPOSAL_UPDATE_QUORUM: u32 = 5;
const PROPOSAL_GENERAL: u32 = 6;

// ─── Constants ─────────────────────────────────────────────────
const PROPOSAL_DURATION_SECS: u64 = 7 * 24 * 60 * 60; // 7 days
const MAX_COUNCIL_SIZE: u32 = 21;
const MAX_TITLE_LEN: u32 = 128;
const MAX_DESC_LEN: u32 = 1024;
const TTL_EXTEND_AMOUNT: u32 = 518_400; // ~60 days in ledgers

// ─── Storage Keys ──────────────────────────────────────────────
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,                       // Address — contract administrator
    Initialized,                 // bool — one-time init guard
    Council,                     // Vec<Address> — governance council
    Proposal(u32),               // Proposal — by ID
    ProposalCount,               // u32 — total proposals
    Vote(u32, Address),          // bool — vote record (proposal_id, voter)
    VoteCount(u32),              // VoteTally — per-proposal tally
    QuorumPercent,               // u32 — required quorum (30-100)
    ExecutedCount,               // u32 — total executed proposals
    Paused,                      // bool — circuit breaker
}

// ─── Data Structures ───────────────────────────────────────────
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Proposal {
    pub id: u32,
    pub proposer: Address,
    pub title: String,
    pub description: String,
    pub proposal_type: u32,
    pub target_address: Address,  // target for admin/council actions
    pub created_at: u64,
    pub expires_at: u64,
    pub status: u32,
    pub executed_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct VoteTally {
    pub yes_votes: u32,
    pub no_votes: u32,
    pub total_eligible: u32,
}

// ─── Contract ──────────────────────────────────────────────────
#[contract]
pub struct GovernanceContract;

#[contractimpl]
impl GovernanceContract {
    // ══════════════════════════════════════════════════════════════
    // 1. INITIALIZATION
    // ══════════════════════════════════════════════════════════════

    /// Initialize governance with admin and initial council members.
    pub fn initialize(
        env: Env,
        admin: Address,
        initial_council: Vec<Address>,
    ) -> Result<(), GovernanceError> {
        if env.storage().persistent().has(&DataKey::Initialized) {
            return Err(GovernanceError::AlreadyInitialized);
        }

        admin.require_auth();

        if initial_council.len() > MAX_COUNCIL_SIZE {
            return Err(GovernanceError::MaxCouncilReached);
        }

        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::Council, &initial_council);
        env.storage().persistent().set(&DataKey::Initialized, &true);
        env.storage().persistent().set(&DataKey::ProposalCount, &0u32);
        env.storage().persistent().set(&DataKey::ExecutedCount, &0u32);
        env.storage().persistent().set(&DataKey::QuorumPercent, &51u32);
        env.storage().persistent().set(&DataKey::Paused, &false);

        env.events().publish(
            (Symbol::new(&env, "init"),), admin
        );

        Ok(())
    }

    // ══════════════════════════════════════════════════════════════
    // 2. PROPOSAL CREATION
    // ══════════════════════════════════════════════════════════════

    /// Create a new governance proposal. Only council members can propose.
    pub fn create_proposal(
        env: Env,
        proposer: Address,
        title: String,
        description: String,
        proposal_type: u32,
        target_address: Address,
    ) -> Result<u32, GovernanceError> {
        if env.storage().persistent().get(&DataKey::Paused).unwrap_or(false) {
            return Err(GovernanceError::ContractPaused);
        }

        proposer.require_auth();

        let council: Vec<Address> = env.storage().persistent()
            .get(&DataKey::Council)
            .ok_or(GovernanceError::NotFound)?;

        if !Self::is_in_council(&council, &proposer) {
            return Err(GovernanceError::NotCouncilMember);
        }

        if title.len() > MAX_TITLE_LEN || description.len() > MAX_DESC_LEN {
            return Err(GovernanceError::InvalidInput);
        }
        if proposal_type > PROPOSAL_GENERAL {
            return Err(GovernanceError::InvalidInput);
        }

        let now = env.ledger().timestamp();
        let proposal_id: u32 = env.storage().persistent()
            .get(&DataKey::ProposalCount).unwrap_or(0);

        let proposal = Proposal {
            id: proposal_id,
            proposer: proposer.clone(),
            title,
            description,
            proposal_type,
            target_address,
            created_at: now,
            expires_at: now + PROPOSAL_DURATION_SECS,
            status: STATUS_ACTIVE,
            executed_at: 0,
        };

        env.storage().persistent().set(&DataKey::Proposal(proposal_id), &proposal);
        env.storage().persistent().set(&DataKey::ProposalCount, &(proposal_id + 1));

        let tally = VoteTally {
            yes_votes: 0,
            no_votes: 0,
            total_eligible: council.len(),
        };
        env.storage().persistent().set(&DataKey::VoteCount(proposal_id), &tally);

        env.events().publish(
            (Symbol::new(&env, "propose"),), (proposer, proposal_id)
        );

        Ok(proposal_id)
    }

    // ══════════════════════════════════════════════════════════════
    // 3. VOTING
    // ══════════════════════════════════════════════════════════════

    /// Cast a vote on an active proposal. Council members only.
    pub fn vote(
        env: Env,
        voter: Address,
        proposal_id: u32,
        approve: bool,
    ) -> Result<(), GovernanceError> {
        if env.storage().persistent().get(&DataKey::Paused).unwrap_or(false) {
            return Err(GovernanceError::ContractPaused);
        }

        voter.require_auth();

        let council: Vec<Address> = env.storage().persistent()
            .get(&DataKey::Council)
            .ok_or(GovernanceError::NotFound)?;

        if !Self::is_in_council(&council, &voter) {
            return Err(GovernanceError::NotCouncilMember);
        }

        let proposal: Proposal = env.storage().persistent()
            .get(&DataKey::Proposal(proposal_id))
            .ok_or(GovernanceError::NotFound)?;

        if proposal.status != STATUS_ACTIVE {
            return Err(GovernanceError::ProposalNotActive);
        }

        let now = env.ledger().timestamp();
        if now > proposal.expires_at {
            return Err(GovernanceError::ProposalExpired);
        }

        if env.storage().persistent().has(&DataKey::Vote(proposal_id, voter.clone())) {
            return Err(GovernanceError::AlreadyVoted);
        }

        env.storage().persistent().set(&DataKey::Vote(proposal_id, voter.clone()), &approve);

        let mut tally: VoteTally = env.storage().persistent()
            .get(&DataKey::VoteCount(proposal_id))
            .ok_or(GovernanceError::NotFound)?;

        if approve {
            tally.yes_votes += 1;
        } else {
            tally.no_votes += 1;
        }

        env.storage().persistent().set(&DataKey::VoteCount(proposal_id), &tally);

        env.events().publish(
            (Symbol::new(&env, "vote"),), (voter, proposal_id, approve)
        );

        Ok(())
    }

    // ══════════════════════════════════════════════════════════════
    // 4. PROPOSAL FINALIZATION
    // ══════════════════════════════════════════════════════════════

    /// Finalize a proposal after voting period ends.
    pub fn finalize_proposal(
        env: Env,
        proposal_id: u32,
    ) -> Result<u32, GovernanceError> {
        let mut proposal: Proposal = env.storage().persistent()
            .get(&DataKey::Proposal(proposal_id))
            .ok_or(GovernanceError::NotFound)?;

        if proposal.status != STATUS_ACTIVE {
            return Err(GovernanceError::ProposalNotActive);
        }

        let now = env.ledger().timestamp();
        let tally: VoteTally = env.storage().persistent()
            .get(&DataKey::VoteCount(proposal_id))
            .ok_or(GovernanceError::NotFound)?;

        let quorum_percent: u32 = env.storage().persistent()
            .get(&DataKey::QuorumPercent).unwrap_or(51);

        let total_votes = tally.yes_votes + tally.no_votes;
        let participation = if tally.total_eligible > 0 {
            (total_votes * 100) / tally.total_eligible
        } else {
            0
        };

        if now > proposal.expires_at {
            if participation < quorum_percent {
                proposal.status = STATUS_EXPIRED;
                env.storage().persistent().set(&DataKey::Proposal(proposal_id), &proposal);
                return Ok(STATUS_EXPIRED);
            }
        }

        if now <= proposal.expires_at && total_votes < tally.total_eligible {
            return Err(GovernanceError::ProposalStillActive);
        }

        if participation < quorum_percent {
            proposal.status = STATUS_EXPIRED;
            env.storage().persistent().set(&DataKey::Proposal(proposal_id), &proposal);
            return Ok(STATUS_EXPIRED);
        }

        if tally.yes_votes > tally.no_votes {
            proposal.status = STATUS_PASSED;
        } else {
            proposal.status = STATUS_REJECTED;
        }

        env.storage().persistent().set(&DataKey::Proposal(proposal_id), &proposal);

        Ok(proposal.status)
    }

    // ══════════════════════════════════════════════════════════════
    // 5. PROPOSAL EXECUTION
    // ══════════════════════════════════════════════════════════════

    /// Execute a passed proposal. Admin-only for safety.
    pub fn execute_proposal(
        env: Env,
        proposal_id: u32,
    ) -> Result<(), GovernanceError> {
        let admin: Address = env.storage().persistent()
            .get(&DataKey::Admin)
            .ok_or(GovernanceError::Unauthorized)?;
        admin.require_auth();

        let mut proposal: Proposal = env.storage().persistent()
            .get(&DataKey::Proposal(proposal_id))
            .ok_or(GovernanceError::NotFound)?;

        if proposal.status != STATUS_PASSED {
            return Err(GovernanceError::ProposalNotActive);
        }

        let now = env.ledger().timestamp();

        match proposal.proposal_type {
            PROPOSAL_ADMIN_TRANSFER => {
                env.storage().persistent().set(&DataKey::Admin, &proposal.target_address);
            },
            PROPOSAL_PAUSE_CONTRACT => {
                env.storage().persistent().set(&DataKey::Paused, &true);
            },
            PROPOSAL_RESUME_CONTRACT => {
                env.storage().persistent().set(&DataKey::Paused, &false);
            },
            PROPOSAL_ADD_COUNCIL => {
                let mut council: Vec<Address> = env.storage().persistent()
                    .get(&DataKey::Council).unwrap_or(Vec::new(&env));
                if council.len() >= MAX_COUNCIL_SIZE {
                    return Err(GovernanceError::MaxCouncilReached);
                }
                council.push_back(proposal.target_address.clone());
                env.storage().persistent().set(&DataKey::Council, &council);
            },
            PROPOSAL_REMOVE_COUNCIL => {
                let council: Vec<Address> = env.storage().persistent()
                    .get(&DataKey::Council).unwrap_or(Vec::new(&env));
                let mut new_council = Vec::new(&env);
                for i in 0..council.len() {
                    let member = council.get(i).unwrap();
                    if member != proposal.target_address {
                        new_council.push_back(member);
                    }
                }
                env.storage().persistent().set(&DataKey::Council, &new_council);
            },
            PROPOSAL_UPDATE_QUORUM => {
                env.storage().persistent().set(&DataKey::QuorumPercent, &60u32);
            },
            _ => {
                // General proposals — no on-chain action, just recorded
            }
        }

        proposal.status = STATUS_EXECUTED;
        proposal.executed_at = now;
        env.storage().persistent().set(&DataKey::Proposal(proposal_id), &proposal);

        let executed: u32 = env.storage().persistent()
            .get(&DataKey::ExecutedCount).unwrap_or(0);
        env.storage().persistent().set(&DataKey::ExecutedCount, &(executed + 1));

        env.events().publish(
            (Symbol::new(&env, "execute"),), proposal_id
        );

        Ok(())
    }

    // ══════════════════════════════════════════════════════════════
    // 6. COUNCIL MANAGEMENT
    // ══════════════════════════════════════════════════════════════

    /// Admin-only: directly add a council member (bypass governance for bootstrap)
    pub fn add_council_member(env: Env, member: Address) -> Result<(), GovernanceError> {
        let admin: Address = env.storage().persistent()
            .get(&DataKey::Admin)
            .ok_or(GovernanceError::Unauthorized)?;
        admin.require_auth();

        let mut council: Vec<Address> = env.storage().persistent()
            .get(&DataKey::Council).unwrap_or(Vec::new(&env));

        if council.len() >= MAX_COUNCIL_SIZE {
            return Err(GovernanceError::MaxCouncilReached);
        }

        council.push_back(member.clone());
        env.storage().persistent().set(&DataKey::Council, &council);

        env.events().publish(
            (Symbol::new(&env, "council"),), member
        );

        Ok(())
    }

    // ══════════════════════════════════════════════════════════════
    // 7. CIRCUIT BREAKER
    // ══════════════════════════════════════════════════════════════

    pub fn pause_contract(env: Env) -> Result<(), GovernanceError> {
        let admin: Address = env.storage().persistent()
            .get(&DataKey::Admin)
            .ok_or(GovernanceError::Unauthorized)?;
        admin.require_auth();
        env.storage().persistent().set(&DataKey::Paused, &true);
        Ok(())
    }

    pub fn resume_contract(env: Env) -> Result<(), GovernanceError> {
        let admin: Address = env.storage().persistent()
            .get(&DataKey::Admin)
            .ok_or(GovernanceError::Unauthorized)?;
        admin.require_auth();
        env.storage().persistent().set(&DataKey::Paused, &false);
        Ok(())
    }

    pub fn is_paused(env: Env) -> bool {
        env.storage().persistent().get(&DataKey::Paused).unwrap_or(false)
    }

    // ══════════════════════════════════════════════════════════════
    // 8. TTL MANAGEMENT
    // ══════════════════════════════════════════════════════════════

    pub fn extend_instance_ttl(env: Env) {
        env.storage().instance().extend_ttl(TTL_EXTEND_AMOUNT, TTL_EXTEND_AMOUNT);
    }

    // ══════════════════════════════════════════════════════════════
    // 9. READ FUNCTIONS
    // ══════════════════════════════════════════════════════════════

    pub fn get_proposal(env: Env, proposal_id: u32) -> Option<Proposal> {
        env.storage().persistent().get(&DataKey::Proposal(proposal_id))
    }

    pub fn get_proposal_count(env: Env) -> u32 {
        env.storage().persistent().get(&DataKey::ProposalCount).unwrap_or(0)
    }

    pub fn get_vote_tally(env: Env, proposal_id: u32) -> Option<VoteTally> {
        env.storage().persistent().get(&DataKey::VoteCount(proposal_id))
    }

    pub fn get_council(env: Env) -> Vec<Address> {
        env.storage().persistent()
            .get(&DataKey::Council)
            .unwrap_or(Vec::new(&env))
    }

    pub fn get_council_size(env: Env) -> u32 {
        Self::get_council(env).len()
    }

    pub fn is_council_member(env: Env, member: Address) -> bool {
        let council = Self::get_council(env);
        Self::is_in_council(&council, &member)
    }

    pub fn get_quorum_percent(env: Env) -> u32 {
        env.storage().persistent()
            .get(&DataKey::QuorumPercent).unwrap_or(51)
    }

    pub fn get_executed_count(env: Env) -> u32 {
        env.storage().persistent()
            .get(&DataKey::ExecutedCount).unwrap_or(0)
    }

    pub fn get_admin(env: Env) -> Option<Address> {
        env.storage().persistent().get(&DataKey::Admin)
    }

    pub fn has_voted(env: Env, proposal_id: u32, voter: Address) -> bool {
        env.storage().persistent().has(&DataKey::Vote(proposal_id, voter))
    }

    // ── Helper ──
    fn is_in_council(council: &Vec<Address>, member: &Address) -> bool {
        for i in 0..council.len() {
            if council.get(i).unwrap() == *member {
                return true;
            }
        }
        false
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

    fn setup() -> (Env, GovernanceContractClient<'static>, Address, Vec<Address>) {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(GovernanceContract, ());
        let client = GovernanceContractClient::new(&env, &contract_id);
        let admin = Address::generate(&env);

        let mut council = Vec::new(&env);
        for _ in 0..3 {
            council.push_back(Address::generate(&env));
        }

        client.initialize(&admin, &council);
        (env, client, admin, council)
    }

    #[test]
    fn test_initialize() {
        let (_, client, _, _) = setup();
        assert!(client.get_admin().is_some());
        assert_eq!(client.get_proposal_count(), 0);
        assert_eq!(client.get_council_size(), 3);
        assert_eq!(client.get_quorum_percent(), 51);
    }

    #[test]
    fn test_double_initialize_fails() {
        let (env, client, _, _) = setup();
        let admin2 = Address::generate(&env);
        let council2 = Vec::new(&env);
        let result = client.try_initialize(&admin2, &council2);
        assert!(result.is_err());
    }

    #[test]
    fn test_create_proposal() {
        let (env, client, _, council) = setup();
        let proposer = council.get(0).unwrap();
        let target = Address::generate(&env);
        let title = String::from_str(&env, "Test Proposal");
        let desc = String::from_str(&env, "A test governance proposal");

        let id = client.create_proposal(
            &proposer, &title, &desc, &PROPOSAL_GENERAL, &target
        );
        assert_eq!(id, 0);
        assert_eq!(client.get_proposal_count(), 1);

        let proposal = client.get_proposal(&0).unwrap();
        assert_eq!(proposal.status, STATUS_ACTIVE);
    }

    #[test]
    fn test_non_council_cannot_propose() {
        let (env, client, _, _) = setup();
        let outsider = Address::generate(&env);
        let target = Address::generate(&env);
        let title = String::from_str(&env, "Bad Proposal");
        let desc = String::from_str(&env, "Should fail");

        let result = client.try_create_proposal(
            &outsider, &title, &desc, &PROPOSAL_GENERAL, &target
        );
        assert!(result.is_err());
    }

    #[test]
    fn test_vote_on_proposal() {
        let (env, client, _, council) = setup();
        let proposer = council.get(0).unwrap();
        let target = Address::generate(&env);
        let title = String::from_str(&env, "Vote Test");
        let desc = String::from_str(&env, "Testing voting");

        client.create_proposal(&proposer, &title, &desc, &PROPOSAL_GENERAL, &target);

        client.vote(&council.get(0).unwrap(), &0, &true);
        client.vote(&council.get(1).unwrap(), &0, &true);
        client.vote(&council.get(2).unwrap(), &0, &false);

        let tally = client.get_vote_tally(&0).unwrap();
        assert_eq!(tally.yes_votes, 2);
        assert_eq!(tally.no_votes, 1);
    }

    #[test]
    fn test_duplicate_vote_fails() {
        let (env, client, _, council) = setup();
        let proposer = council.get(0).unwrap();
        let target = Address::generate(&env);
        let title = String::from_str(&env, "Dup Vote");
        let desc = String::from_str(&env, "Test");

        client.create_proposal(&proposer, &title, &desc, &PROPOSAL_GENERAL, &target);
        client.vote(&council.get(0).unwrap(), &0, &true);

        let result = client.try_vote(&council.get(0).unwrap(), &0, &false);
        assert!(result.is_err());
    }

    #[test]
    fn test_finalize_passed_proposal() {
        let (env, client, _, council) = setup();
        let proposer = council.get(0).unwrap();
        let target = Address::generate(&env);
        let title = String::from_str(&env, "Pass Test");
        let desc = String::from_str(&env, "Should pass");

        client.create_proposal(&proposer, &title, &desc, &PROPOSAL_GENERAL, &target);

        client.vote(&council.get(0).unwrap(), &0, &true);
        client.vote(&council.get(1).unwrap(), &0, &true);
        client.vote(&council.get(2).unwrap(), &0, &true);

        let status = client.finalize_proposal(&0);
        assert_eq!(status, STATUS_PASSED);
    }

    #[test]
    fn test_finalize_rejected_proposal() {
        let (env, client, _, council) = setup();
        let proposer = council.get(0).unwrap();
        let target = Address::generate(&env);
        let title = String::from_str(&env, "Reject Test");
        let desc = String::from_str(&env, "Should reject");

        client.create_proposal(&proposer, &title, &desc, &PROPOSAL_GENERAL, &target);

        client.vote(&council.get(0).unwrap(), &0, &true);
        client.vote(&council.get(1).unwrap(), &0, &false);
        client.vote(&council.get(2).unwrap(), &0, &false);

        let status = client.finalize_proposal(&0);
        assert_eq!(status, STATUS_REJECTED);
    }

    #[test]
    fn test_execute_admin_transfer() {
        let (env, client, _, council) = setup();
        let proposer = council.get(0).unwrap();
        let new_admin = Address::generate(&env);
        let title = String::from_str(&env, "Transfer Admin");
        let desc = String::from_str(&env, "Transfer to new admin");

        client.create_proposal(
            &proposer, &title, &desc, &PROPOSAL_ADMIN_TRANSFER, &new_admin
        );

        for i in 0..3 {
            client.vote(&council.get(i).unwrap(), &0, &true);
        }

        client.finalize_proposal(&0);
        client.execute_proposal(&0);

        let current_admin = client.get_admin().unwrap();
        assert_eq!(current_admin, new_admin);
        assert_eq!(client.get_executed_count(), 1);
    }

    #[test]
    fn test_execute_add_council_member() {
        let (env, client, _, council) = setup();
        let proposer = council.get(0).unwrap();
        let new_member = Address::generate(&env);
        let title = String::from_str(&env, "Add Council");
        let desc = String::from_str(&env, "Add new member");

        client.create_proposal(
            &proposer, &title, &desc, &PROPOSAL_ADD_COUNCIL, &new_member
        );

        for i in 0..3 {
            client.vote(&council.get(i).unwrap(), &0, &true);
        }

        client.finalize_proposal(&0);
        client.execute_proposal(&0);

        assert_eq!(client.get_council_size(), 4);
        assert!(client.is_council_member(&new_member));
    }

    #[test]
    fn test_execute_remove_council_member() {
        let (env, client, _, council) = setup();
        let proposer = council.get(0).unwrap();
        let to_remove = council.get(2).unwrap();
        let title = String::from_str(&env, "Remove Council");
        let desc = String::from_str(&env, "Remove member");

        client.create_proposal(
            &proposer, &title, &desc, &PROPOSAL_REMOVE_COUNCIL, &to_remove
        );

        for i in 0..3 {
            client.vote(&council.get(i).unwrap(), &0, &true);
        }

        client.finalize_proposal(&0);
        client.execute_proposal(&0);

        assert_eq!(client.get_council_size(), 2);
        assert!(!client.is_council_member(&to_remove));
    }

    #[test]
    fn test_proposal_expired() {
        let (env, client, _, council) = setup();
        let proposer = council.get(0).unwrap();
        let target = Address::generate(&env);
        let title = String::from_str(&env, "Expire Test");
        let desc = String::from_str(&env, "Let it expire");

        client.create_proposal(&proposer, &title, &desc, &PROPOSAL_GENERAL, &target);

        env.ledger().with_mut(|li| {
            li.timestamp += PROPOSAL_DURATION_SECS + 1;
        });

        let status = client.finalize_proposal(&0);
        assert_eq!(status, STATUS_EXPIRED);
    }

    #[test]
    fn test_circuit_breaker() {
        let (env, client, _, council) = setup();
        client.pause_contract();
        assert!(client.is_paused());

        let proposer = council.get(0).unwrap();
        let target = Address::generate(&env);
        let title = String::from_str(&env, "Paused");
        let desc = String::from_str(&env, "Should fail");

        let result = client.try_create_proposal(
            &proposer, &title, &desc, &PROPOSAL_GENERAL, &target
        );
        assert!(result.is_err());

        client.resume_contract();
        assert!(!client.is_paused());
    }

    #[test]
    fn test_has_voted_check() {
        let (env, client, _, council) = setup();
        let proposer = council.get(0).unwrap();
        let voter = council.get(1).unwrap();
        let target = Address::generate(&env);
        let title = String::from_str(&env, "Vote Check");
        let desc = String::from_str(&env, "Test has_voted");

        client.create_proposal(&proposer, &title, &desc, &PROPOSAL_GENERAL, &target);

        assert!(!client.has_voted(&0, &voter));
        client.vote(&voter, &0, &true);
        assert!(client.has_voted(&0, &voter));
    }

    #[test]
    fn test_add_council_directly() {
        let (env, client, _, _) = setup();
        let new_member = Address::generate(&env);

        client.add_council_member(&new_member);
        assert_eq!(client.get_council_size(), 4);
        assert!(client.is_council_member(&new_member));
    }
}
