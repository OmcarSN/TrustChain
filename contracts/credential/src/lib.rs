#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype,
    Address, Env, String, Vec, symbol_short,
};

// ─── Error Types ───────────────────────────────────────────────
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ContractError {
    AlreadyInitialized = 1,
    NotFound = 2,
    Unauthorized = 3,
    AlreadyRevoked = 4,
    AlreadyExists = 5,
    InvalidInput = 6,
    CredentialExpired = 7,
    NoProposedAdmin = 8,
    NotProposedAdmin = 9,
    CredentialRevoked = 10,
}

// ─── Storage Keys ──────────────────────────────────────────────
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,                       // Address — contract administrator
    ProposedAdmin,               // Address — pending admin transfer
    Credential(Address),         // WorkerData — per-worker credential
    Revoked(Address),            // bool — revocation flag
    CredentialCount,             // u32 — total credentials issued
    ActiveCount,                 // u32 — current active (non-revoked, non-expired)
    Initialized,                 // bool — initialization guard
    VerificationLevel(Address),  // u32 — verification tier (0-3)
}

// ─── Verification Levels ───────────────────────────────────────
/// 0 = Unverified (just minted)
/// 1 = Peer-Verified (≥3 endorsements)
/// 2 = Community-Verified (≥10 endorsements, avg rating ≥ 3.5)
/// 3 = Admin-Verified (manually promoted by admin)
const VERIFICATION_UNVERIFIED: u32 = 0;
const VERIFICATION_PEER: u32 = 1;
const VERIFICATION_COMMUNITY: u32 = 2;
const VERIFICATION_ADMIN: u32 = 3;

// ─── Constants ─────────────────────────────────────────────────
const CREDENTIAL_VALIDITY_SECS: u64 = 365 * 24 * 60 * 60; // 1 year
const MAX_NAME_LEN: u32 = 64;
const MAX_SKILL_LEN: u32 = 32;
const MAX_CITY_LEN: u32 = 32;
const MAX_BIO_LEN: u32 = 256;
const MAX_BATCH_SIZE: u32 = 10;
const TTL_EXTEND_AMOUNT: u32 = 518_400; // ~60 days in ledgers

// ─── Data Structures ───────────────────────────────────────────
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct WorkerData {
    pub name: String,
    pub skill: String,
    pub city: String,
    pub exp: u32,
    pub bio: String,
    pub issued_at: u64,
    pub updated_at: u64,
    pub expires_at: u64,         // NEW: expiry timestamp
    pub renewal_count: u32,      // NEW: how many times renewed
}

// ─── Contract ──────────────────────────────────────────────────
#[contract]
pub struct CredentialContract;

// ─── Event topic symbols ───────────────────────────────────────
const TOPIC_INIT: symbol_short = symbol_short!("init");
const TOPIC_ISSUE: symbol_short = symbol_short!("issue");
const TOPIC_REVOKE: symbol_short = symbol_short!("revoke");
const TOPIC_UPDATE: symbol_short = symbol_short!("update");
const TOPIC_RENEW: symbol_short = symbol_short!("renew");
const TOPIC_ADMIN: symbol_short = symbol_short!("admin");
const TOPIC_VERIFY: symbol_short = symbol_short!("verify");
const TOPIC_BATCH: symbol_short = symbol_short!("batch");

#[contractimpl]
impl CredentialContract {
    // ══════════════════════════════════════════════════════════════
    // 1. INITIALIZATION
    // ══════════════════════════════════════════════════════════════

    /// Initialize the contract with an admin address. Can only be called once.
    pub fn initialize(env: Env, admin: Address) -> Result<(), ContractError> {
        if env.storage().persistent().has(&DataKey::Initialized) {
            return Err(ContractError::AlreadyInitialized);
        }

        admin.require_auth();

        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::Initialized, &true);
        env.storage().persistent().set(&DataKey::CredentialCount, &0u32);
        env.storage().persistent().set(&DataKey::ActiveCount, &0u32);

        env.events().publish((TOPIC_INIT,), admin);

        Ok(())
    }

    // ══════════════════════════════════════════════════════════════
    // 2. CREDENTIAL ISSUANCE
    // ══════════════════════════════════════════════════════════════

    /// Mint a new soulbound credential for a worker.
    /// Validates all input lengths. Worker must authenticate.
    /// Credential expires after 1 year automatically.
    pub fn issue_credential(
        env: Env,
        worker: Address,
        name: String,
        skill: String,
        city: String,
        exp: u32,
        bio: String,
    ) -> Result<(), ContractError> {
        worker.require_auth();

        // Input validation — enforce maximum field lengths
        if name.len() > MAX_NAME_LEN {
            return Err(ContractError::InvalidInput);
        }
        if skill.len() > MAX_SKILL_LEN {
            return Err(ContractError::InvalidInput);
        }
        if city.len() > MAX_CITY_LEN {
            return Err(ContractError::InvalidInput);
        }
        if bio.len() > MAX_BIO_LEN {
            return Err(ContractError::InvalidInput);
        }

        // Prevent duplicate credentials
        if env.storage().persistent().has(&DataKey::Credential(worker.clone())) {
            return Err(ContractError::AlreadyExists);
        }

        let now = env.ledger().timestamp();
        let expires_at = now + CREDENTIAL_VALIDITY_SECS;

        let data = WorkerData {
            name,
            skill,
            city,
            exp,
            bio,
            issued_at: now,
            updated_at: now,
            expires_at,
            renewal_count: 0,
        };

        env.storage().persistent().set(&DataKey::Credential(worker.clone()), &data);

        // Set initial verification level to Unverified
        env.storage().persistent().set(
            &DataKey::VerificationLevel(worker.clone()),
            &VERIFICATION_UNVERIFIED,
        );

        // Increment counters
        let count: u32 = env.storage().persistent()
            .get(&DataKey::CredentialCount).unwrap_or(0);
        env.storage().persistent().set(&DataKey::CredentialCount, &(count + 1));

        let active: u32 = env.storage().persistent()
            .get(&DataKey::ActiveCount).unwrap_or(0);
        env.storage().persistent().set(&DataKey::ActiveCount, &(active + 1));

        env.events().publish((TOPIC_ISSUE,), worker);

        Ok(())
    }

    // ══════════════════════════════════════════════════════════════
    // 3. CREDENTIAL UPDATE
    // ══════════════════════════════════════════════════════════════

    /// Worker-only: update own credential data.
    /// Cannot update if revoked or expired.
    pub fn update_credential(
        env: Env,
        worker: Address,
        name: String,
        skill: String,
        city: String,
        exp: u32,
        bio: String,
    ) -> Result<(), ContractError> {
        worker.require_auth();

        // Input validation
        if name.len() > MAX_NAME_LEN || skill.len() > MAX_SKILL_LEN
            || city.len() > MAX_CITY_LEN || bio.len() > MAX_BIO_LEN
        {
            return Err(ContractError::InvalidInput);
        }

        let existing: WorkerData = env.storage().persistent()
            .get(&DataKey::Credential(worker.clone()))
            .ok_or(ContractError::NotFound)?;

        // Must not be revoked
        if env.storage().persistent().has(&DataKey::Revoked(worker.clone())) {
            return Err(ContractError::CredentialRevoked);
        }

        // Must not be expired
        let now = env.ledger().timestamp();
        if now > existing.expires_at {
            return Err(ContractError::CredentialExpired);
        }

        let updated = WorkerData {
            name,
            skill,
            city,
            exp,
            bio,
            issued_at: existing.issued_at,
            updated_at: now,
            expires_at: existing.expires_at,
            renewal_count: existing.renewal_count,
        };

        env.storage().persistent().set(&DataKey::Credential(worker.clone()), &updated);
        env.events().publish((TOPIC_UPDATE,), worker);

        Ok(())
    }

    // ══════════════════════════════════════════════════════════════
    // 4. CREDENTIAL RENEWAL
    // ══════════════════════════════════════════════════════════════

    /// Worker can renew their credential before or after expiry.
    /// Extends validity by another year from current time.
    pub fn renew_credential(env: Env, worker: Address) -> Result<(), ContractError> {
        worker.require_auth();

        let mut data: WorkerData = env.storage().persistent()
            .get(&DataKey::Credential(worker.clone()))
            .ok_or(ContractError::NotFound)?;

        // Cannot renew if revoked
        if env.storage().persistent().has(&DataKey::Revoked(worker.clone())) {
            return Err(ContractError::CredentialRevoked);
        }

        let now = env.ledger().timestamp();
        data.expires_at = now + CREDENTIAL_VALIDITY_SECS;
        data.updated_at = now;
        data.renewal_count += 1;

        env.storage().persistent().set(&DataKey::Credential(worker.clone()), &data);
        env.events().publish((TOPIC_RENEW,), worker);

        Ok(())
    }

    // ══════════════════════════════════════════════════════════════
    // 5. CREDENTIAL REVOCATION
    // ══════════════════════════════════════════════════════════════

    /// Admin-only: revoke a worker's credential.
    pub fn revoke_credential(env: Env, worker: Address) -> Result<(), ContractError> {
        let admin: Address = env.storage().persistent()
            .get(&DataKey::Admin)
            .ok_or(ContractError::Unauthorized)?;
        admin.require_auth();

        if !env.storage().persistent().has(&DataKey::Credential(worker.clone())) {
            return Err(ContractError::NotFound);
        }

        if env.storage().persistent().has(&DataKey::Revoked(worker.clone())) {
            return Err(ContractError::AlreadyRevoked);
        }

        env.storage().persistent().set(&DataKey::Revoked(worker.clone()), &true);

        // Decrement active count
        let active: u32 = env.storage().persistent()
            .get(&DataKey::ActiveCount).unwrap_or(1);
        if active > 0 {
            env.storage().persistent().set(&DataKey::ActiveCount, &(active - 1));
        }

        env.events().publish((TOPIC_REVOKE,), worker);

        Ok(())
    }

    // ══════════════════════════════════════════════════════════════
    // 6. BATCH REVOCATION
    // ══════════════════════════════════════════════════════════════

    /// Admin-only: revoke multiple credentials in a single transaction.
    /// Limited to MAX_BATCH_SIZE to prevent gas exhaustion.
    pub fn batch_revoke(env: Env, workers: Vec<Address>) -> Result<u32, ContractError> {
        let admin: Address = env.storage().persistent()
            .get(&DataKey::Admin)
            .ok_or(ContractError::Unauthorized)?;
        admin.require_auth();

        if workers.len() > MAX_BATCH_SIZE {
            return Err(ContractError::InvalidInput);
        }

        let mut revoked_count: u32 = 0;

        for i in 0..workers.len() {
            let worker = workers.get(i).unwrap();

            // Skip if no credential or already revoked
            if !env.storage().persistent().has(&DataKey::Credential(worker.clone())) {
                continue;
            }
            if env.storage().persistent().has(&DataKey::Revoked(worker.clone())) {
                continue;
            }

            env.storage().persistent().set(&DataKey::Revoked(worker.clone()), &true);

            let active: u32 = env.storage().persistent()
                .get(&DataKey::ActiveCount).unwrap_or(1);
            if active > 0 {
                env.storage().persistent().set(&DataKey::ActiveCount, &(active - 1));
            }

            revoked_count += 1;
        }

        env.events().publish((TOPIC_BATCH,), revoked_count);

        Ok(revoked_count)
    }

    // ══════════════════════════════════════════════════════════════
    // 7. VERIFICATION LEVEL MANAGEMENT
    // ══════════════════════════════════════════════════════════════

    /// Upgrade a worker's verification level based on endorsement metrics.
    /// Called externally (e.g., by reputation contract or frontend).
    pub fn upgrade_verification(
        env: Env,
        worker: Address,
        endorsement_count: u32,
        avg_rating: u32, // scaled by 100 (e.g., 350 = 3.50)
    ) -> Result<u32, ContractError> {
        // Credential must exist and not be revoked
        if !env.storage().persistent().has(&DataKey::Credential(worker.clone())) {
            return Err(ContractError::NotFound);
        }
        if env.storage().persistent().has(&DataKey::Revoked(worker.clone())) {
            return Err(ContractError::CredentialRevoked);
        }

        let current_level: u32 = env.storage().persistent()
            .get(&DataKey::VerificationLevel(worker.clone()))
            .unwrap_or(VERIFICATION_UNVERIFIED);

        // Don't downgrade admin-verified workers
        if current_level == VERIFICATION_ADMIN {
            return Ok(VERIFICATION_ADMIN);
        }

        // Calculate new level based on metrics
        let new_level = if endorsement_count >= 10 && avg_rating >= 350 {
            VERIFICATION_COMMUNITY
        } else if endorsement_count >= 3 {
            VERIFICATION_PEER
        } else {
            VERIFICATION_UNVERIFIED
        };

        // Only upgrade, never downgrade
        if new_level > current_level {
            env.storage().persistent().set(
                &DataKey::VerificationLevel(worker.clone()),
                &new_level,
            );
            env.events().publish((TOPIC_VERIFY,), (worker, new_level));
        }

        Ok(new_level)
    }

    /// Admin-only: manually set a worker to Admin-Verified (highest tier).
    pub fn admin_verify(env: Env, worker: Address) -> Result<(), ContractError> {
        let admin: Address = env.storage().persistent()
            .get(&DataKey::Admin)
            .ok_or(ContractError::Unauthorized)?;
        admin.require_auth();

        if !env.storage().persistent().has(&DataKey::Credential(worker.clone())) {
            return Err(ContractError::NotFound);
        }

        env.storage().persistent().set(
            &DataKey::VerificationLevel(worker.clone()),
            &VERIFICATION_ADMIN,
        );

        env.events().publish((TOPIC_VERIFY,), (worker, VERIFICATION_ADMIN));

        Ok(())
    }

    // ══════════════════════════════════════════════════════════════
    // 8. ADMIN TRANSFER (TWO-STEP PATTERN)
    // ══════════════════════════════════════════════════════════════

    /// Step 1: Current admin proposes a new admin.
    pub fn propose_admin(env: Env, new_admin: Address) -> Result<(), ContractError> {
        let admin: Address = env.storage().persistent()
            .get(&DataKey::Admin)
            .ok_or(ContractError::Unauthorized)?;
        admin.require_auth();

        env.storage().persistent().set(&DataKey::ProposedAdmin, &new_admin);
        env.events().publish((TOPIC_ADMIN,), new_admin);

        Ok(())
    }

    /// Step 2: Proposed admin accepts the role.
    pub fn accept_admin(env: Env) -> Result<(), ContractError> {
        let proposed: Address = env.storage().persistent()
            .get(&DataKey::ProposedAdmin)
            .ok_or(ContractError::NoProposedAdmin)?;

        proposed.require_auth();

        env.storage().persistent().set(&DataKey::Admin, &proposed);
        env.storage().persistent().remove(&DataKey::ProposedAdmin);

        env.events().publish((TOPIC_ADMIN,), proposed);

        Ok(())
    }

    // ══════════════════════════════════════════════════════════════
    // 9. STORAGE TTL MANAGEMENT
    // ══════════════════════════════════════════════════════════════

    /// Extend the TTL of a worker's credential storage.
    /// Important for Soroban persistent storage lifecycle.
    pub fn extend_credential_ttl(env: Env, worker: Address) -> Result<(), ContractError> {
        if !env.storage().persistent().has(&DataKey::Credential(worker.clone())) {
            return Err(ContractError::NotFound);
        }

        env.storage().persistent().extend_ttl(
            &DataKey::Credential(worker),
            TTL_EXTEND_AMOUNT,
            TTL_EXTEND_AMOUNT,
        );

        Ok(())
    }

    /// Extend TTL of core contract state (admin, counters, etc.).
    pub fn extend_instance_ttl(env: Env) {
        env.storage().instance().extend_ttl(TTL_EXTEND_AMOUNT, TTL_EXTEND_AMOUNT);
    }

    // ══════════════════════════════════════════════════════════════
    // 10. READ FUNCTIONS
    // ══════════════════════════════════════════════════════════════

    /// Return credential data if it exists and is not revoked.
    pub fn get_credential(env: Env, worker: Address) -> Option<WorkerData> {
        if env.storage().persistent().has(&DataKey::Revoked(worker.clone())) {
            return None;
        }
        env.storage().persistent().get(&DataKey::Credential(worker))
    }

    /// Returns total number of credentials ever issued.
    pub fn get_credential_count(env: Env) -> u32 {
        env.storage().persistent().get(&DataKey::CredentialCount).unwrap_or(0)
    }

    /// Returns current active (non-revoked) credential count.
    pub fn get_active_count(env: Env) -> u32 {
        env.storage().persistent().get(&DataKey::ActiveCount).unwrap_or(0)
    }

    /// Returns true if a credential exists and is not revoked and not expired.
    pub fn is_credential_valid(env: Env, worker: Address) -> bool {
        if !env.storage().persistent().has(&DataKey::Credential(worker.clone())) {
            return false;
        }
        if env.storage().persistent().has(&DataKey::Revoked(worker.clone())) {
            return false;
        }
        // Check expiry
        if let Some(data) = env.storage().persistent().get::<_, WorkerData>(
            &DataKey::Credential(worker)
        ) {
            return env.ledger().timestamp() <= data.expires_at;
        }
        false
    }

    /// Simple existence check (includes revoked).
    pub fn has_credential(env: Env, worker: Address) -> bool {
        env.storage().persistent().has(&DataKey::Credential(worker))
    }

    /// Returns the admin address.
    pub fn get_admin(env: Env) -> Option<Address> {
        env.storage().persistent().get(&DataKey::Admin)
    }

    /// Check if a specific credential has been revoked.
    pub fn is_revoked(env: Env, worker: Address) -> bool {
        env.storage().persistent().has(&DataKey::Revoked(worker))
    }

    /// Returns the verification level of a worker (0-3).
    pub fn get_verification_level(env: Env, worker: Address) -> u32 {
        env.storage().persistent()
            .get(&DataKey::VerificationLevel(worker))
            .unwrap_or(VERIFICATION_UNVERIFIED)
    }

    /// Check if a credential has expired.
    pub fn is_expired(env: Env, worker: Address) -> bool {
        if let Some(data) = env.storage().persistent().get::<_, WorkerData>(
            &DataKey::Credential(worker)
        ) {
            return env.ledger().timestamp() > data.expires_at;
        }
        true // No credential = treat as expired
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

    fn setup() -> (Env, CredentialContractClient<'static>, Address) {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(CredentialContract, ());
        let client = CredentialContractClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        client.initialize(&admin);
        (env, client, admin)
    }

    fn make_worker_data(env: &Env) -> (Address, String, String, String, u32, String) {
        let worker = Address::generate(env);
        let name = String::from_str(env, "Alice");
        let skill = String::from_str(env, "Plumbing");
        let city = String::from_str(env, "Mumbai");
        let exp = 5u32;
        let bio = String::from_str(env, "Experienced plumber");
        (worker, name, skill, city, exp, bio)
    }

    #[test]
    fn test_initialize() {
        let (_, client, _) = setup();
        assert!(client.get_admin().is_some());
        assert_eq!(client.get_credential_count(), 0);
        assert_eq!(client.get_active_count(), 0);
    }

    #[test]
    fn test_double_initialize_fails() {
        let (env, client, _) = setup();
        let admin2 = Address::generate(&env);
        let result = client.try_initialize(&admin2);
        assert!(result.is_err());
    }

    #[test]
    fn test_issue_credential() {
        let (env, client, _) = setup();
        let (worker, name, skill, city, exp, bio) = make_worker_data(&env);

        client.issue_credential(&worker, &name, &skill, &city, &exp, &bio);

        assert!(client.has_credential(&worker));
        assert!(client.is_credential_valid(&worker));
        assert_eq!(client.get_credential_count(), 1);
        assert_eq!(client.get_active_count(), 1);
        assert_eq!(client.get_verification_level(&worker), 0); // Unverified
    }

    #[test]
    fn test_duplicate_credential_fails() {
        let (env, client, _) = setup();
        let (worker, name, skill, city, exp, bio) = make_worker_data(&env);

        client.issue_credential(&worker, &name, &skill, &city, &exp, &bio);
        let result = client.try_issue_credential(&worker, &name, &skill, &city, &exp, &bio);
        assert!(result.is_err());
    }

    #[test]
    fn test_update_credential() {
        let (env, client, _) = setup();
        let (worker, name, skill, city, exp, bio) = make_worker_data(&env);
        client.issue_credential(&worker, &name, &skill, &city, &exp, &bio);

        let new_name = String::from_str(&env, "Alice Updated");
        let new_bio = String::from_str(&env, "Senior plumber");
        client.update_credential(&worker, &new_name, &skill, &city, &7u32, &new_bio);

        let cred = client.get_credential(&worker).unwrap();
        assert_eq!(cred.exp, 7);
    }

    #[test]
    fn test_revoke_credential() {
        let (env, client, _) = setup();
        let (worker, name, skill, city, exp, bio) = make_worker_data(&env);
        client.issue_credential(&worker, &name, &skill, &city, &exp, &bio);

        client.revoke_credential(&worker);

        assert!(client.is_revoked(&worker));
        assert!(!client.is_credential_valid(&worker));
        assert!(client.get_credential(&worker).is_none());
        assert_eq!(client.get_active_count(), 0);
    }

    #[test]
    fn test_double_revoke_fails() {
        let (env, client, _) = setup();
        let (worker, name, skill, city, exp, bio) = make_worker_data(&env);
        client.issue_credential(&worker, &name, &skill, &city, &exp, &bio);
        client.revoke_credential(&worker);

        let result = client.try_revoke_credential(&worker);
        assert!(result.is_err());
    }

    #[test]
    fn test_renew_credential() {
        let (env, client, _) = setup();
        let (worker, name, skill, city, exp, bio) = make_worker_data(&env);
        client.issue_credential(&worker, &name, &skill, &city, &exp, &bio);

        let cred_before = client.get_credential(&worker).unwrap();
        
        // Advance time by 6 months
        env.ledger().with_mut(|li| {
            li.timestamp = cred_before.issued_at + (180 * 24 * 60 * 60);
        });

        client.renew_credential(&worker);
        let cred_after = client.get_credential(&worker).unwrap();

        assert!(cred_after.expires_at > cred_before.expires_at);
        assert_eq!(cred_after.renewal_count, 1);
    }

    #[test]
    fn test_credential_expiry() {
        let (env, client, _) = setup();
        let (worker, name, skill, city, exp, bio) = make_worker_data(&env);
        client.issue_credential(&worker, &name, &skill, &city, &exp, &bio);

        // Advance time past expiry (>1 year)
        env.ledger().with_mut(|li| {
            li.timestamp = li.timestamp + CREDENTIAL_VALIDITY_SECS + 1;
        });

        assert!(!client.is_credential_valid(&worker));
        assert!(client.is_expired(&worker));
    }

    #[test]
    fn test_batch_revoke() {
        let (env, client, _) = setup();

        // Create 3 workers
        let mut workers = Vec::new(&env);
        for _ in 0..3 {
            let (worker, name, skill, city, exp, bio) = make_worker_data(&env);
            client.issue_credential(&worker, &name, &skill, &city, &exp, &bio);
            workers.push_back(worker);
        }

        assert_eq!(client.get_active_count(), 3);

        let revoked = client.batch_revoke(&workers);
        assert_eq!(revoked, 3);
        assert_eq!(client.get_active_count(), 0);
    }

    #[test]
    fn test_verification_upgrade() {
        let (env, client, _) = setup();
        let (worker, name, skill, city, exp, bio) = make_worker_data(&env);
        client.issue_credential(&worker, &name, &skill, &city, &exp, &bio);

        // Initially unverified
        assert_eq!(client.get_verification_level(&worker), 0);

        // 3 endorsements → Peer-Verified
        let level = client.upgrade_verification(&worker, &3, &400);
        assert_eq!(level, VERIFICATION_PEER);

        // 10 endorsements with high rating → Community-Verified
        let level = client.upgrade_verification(&worker, &10, &450);
        assert_eq!(level, VERIFICATION_COMMUNITY);
    }

    #[test]
    fn test_admin_verify() {
        let (env, client, _) = setup();
        let (worker, name, skill, city, exp, bio) = make_worker_data(&env);
        client.issue_credential(&worker, &name, &skill, &city, &exp, &bio);

        client.admin_verify(&worker);
        assert_eq!(client.get_verification_level(&worker), VERIFICATION_ADMIN);
    }

    #[test]
    fn test_admin_transfer() {
        let (env, client, admin) = setup();
        let new_admin = Address::generate(&env);

        client.propose_admin(&new_admin);
        client.accept_admin();

        let current_admin = client.get_admin().unwrap();
        assert_eq!(current_admin, new_admin);
    }

    #[test]
    fn test_input_validation_name_too_long() {
        let (env, client, _) = setup();
        let worker = Address::generate(&env);
        // Create a name longer than 64 chars
        let long_name = String::from_str(&env, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        let skill = String::from_str(&env, "Plumbing");
        let city = String::from_str(&env, "Mumbai");
        let bio = String::from_str(&env, "Test");

        let result = client.try_issue_credential(&worker, &long_name, &skill, &city, &5u32, &bio);
        assert!(result.is_err());
    }

    #[test]
    fn test_update_revoked_fails() {
        let (env, client, _) = setup();
        let (worker, name, skill, city, exp, bio) = make_worker_data(&env);
        client.issue_credential(&worker, &name, &skill, &city, &exp, &bio);
        client.revoke_credential(&worker);

        let result = client.try_update_credential(&worker, &name, &skill, &city, &exp, &bio);
        assert!(result.is_err());
    }
}
