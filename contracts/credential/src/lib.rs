#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype,
    Address, Env, String, symbol_short,
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
}

// ─── Storage Keys ──────────────────────────────────────────────
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,                   // Address — contract administrator
    Credential(Address),     // WorkerData — per-worker credential
    Revoked(Address),        // bool — revocation flag
    CredentialCount,         // u32 — total credentials issued
    Initialized,             // bool — initialization guard
}

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
}

// ─── Contract ──────────────────────────────────────────────────
#[contract]
pub struct CredentialContract;

// ─── Event topic symbols ───────────────────────────────────────
const TOPIC_INIT: symbol_short = symbol_short!("init");
const TOPIC_ISSUE: symbol_short = symbol_short!("issue");
const TOPIC_REVOKE: symbol_short = symbol_short!("revoke");
const TOPIC_UPDATE: symbol_short = symbol_short!("update");

#[contractimpl]
impl CredentialContract {
    // ── 1. Initialize ──────────────────────────────────────────
    /// Set the contract admin. Can only be called once.
    pub fn initialize(env: Env, admin: Address) -> Result<(), ContractError> {
        if env.storage().persistent().has(&DataKey::Initialized) {
            return Err(ContractError::AlreadyInitialized);
        }

        admin.require_auth();

        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::Initialized, &true);
        env.storage().persistent().set(&DataKey::CredentialCount, &0u32);

        env.events().publish((TOPIC_INIT,), admin);

        Ok(())
    }

    // ── 2. Issue Credential ────────────────────────────────────
    /// Mint a new soulbound credential for a worker.
    /// The worker must authenticate the transaction.
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

        // Prevent duplicate credentials
        if env.storage().persistent().has(&DataKey::Credential(worker.clone())) {
            return Err(ContractError::AlreadyExists);
        }

        let now = env.ledger().timestamp();

        let data = WorkerData {
            name,
            skill,
            city,
            exp,
            bio,
            issued_at: now,
            updated_at: now,
        };

        env.storage().persistent().set(&DataKey::Credential(worker.clone()), &data);

        // Increment global credential counter
        let count: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::CredentialCount)
            .unwrap_or(0);
        env.storage().persistent().set(&DataKey::CredentialCount, &(count + 1));

        env.events().publish((TOPIC_ISSUE,), worker);

        Ok(())
    }

    // ── 3. Revoke Credential ───────────────────────────────────
    /// Admin-only: revoke a worker's credential.
    pub fn revoke_credential(env: Env, worker: Address) -> Result<(), ContractError> {
        let admin: Address = env
            .storage()
            .persistent()
            .get(&DataKey::Admin)
            .ok_or(ContractError::Unauthorized)?;
        admin.require_auth();

        // Check credential exists
        if !env.storage().persistent().has(&DataKey::Credential(worker.clone())) {
            return Err(ContractError::NotFound);
        }

        // Check not already revoked
        if env.storage().persistent().has(&DataKey::Revoked(worker.clone())) {
            return Err(ContractError::AlreadyRevoked);
        }

        env.storage().persistent().set(&DataKey::Revoked(worker.clone()), &true);

        env.events().publish((TOPIC_REVOKE,), worker);

        Ok(())
    }

    // ── 4. Get Credential ──────────────────────────────────────
    /// Public read: return credential data if it exists and is not revoked.
    pub fn get_credential(env: Env, worker: Address) -> Option<WorkerData> {
        // Return None if revoked
        if env.storage().persistent().has(&DataKey::Revoked(worker.clone())) {
            return None;
        }

        env.storage().persistent().get(&DataKey::Credential(worker))
    }

    // ── 5. Update Credential ───────────────────────────────────
    /// Worker-only: update own credential data.
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

        // Credential must exist
        let existing: WorkerData = env
            .storage()
            .persistent()
            .get(&DataKey::Credential(worker.clone()))
            .ok_or(ContractError::NotFound)?;

        // Must not be revoked
        if env.storage().persistent().has(&DataKey::Revoked(worker.clone())) {
            return Err(ContractError::AlreadyRevoked);
        }

        let updated = WorkerData {
            name,
            skill,
            city,
            exp,
            bio,
            issued_at: existing.issued_at,
            updated_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&DataKey::Credential(worker.clone()), &updated);

        env.events().publish((TOPIC_UPDATE,), worker);

        Ok(())
    }

    // ── 6. Get Credential Count ────────────────────────────────
    /// Returns total number of credentials ever issued.
    pub fn get_credential_count(env: Env) -> u32 {
        env.storage()
            .persistent()
            .get(&DataKey::CredentialCount)
            .unwrap_or(0)
    }

    // ── 7. Is Credential Valid ─────────────────────────────────
    /// Returns true if a credential exists and has not been revoked.
    pub fn is_credential_valid(env: Env, worker: Address) -> bool {
        if !env.storage().persistent().has(&DataKey::Credential(worker.clone())) {
            return false;
        }
        !env.storage().persistent().has(&DataKey::Revoked(worker))
    }

    // ── 8. Has Credential (backward compat) ────────────────────
    /// Simple existence check (includes revoked).
    pub fn has_credential(env: Env, worker: Address) -> bool {
        env.storage().persistent().has(&DataKey::Credential(worker))
    }

    // ── 9. Get Admin ───────────────────────────────────────────
    /// Returns the admin address.
    pub fn get_admin(env: Env) -> Option<Address> {
        env.storage().persistent().get(&DataKey::Admin)
    }

    // ── 10. Is Revoked ─────────────────────────────────────────
    /// Check if a specific credential has been revoked.
    pub fn is_revoked(env: Env, worker: Address) -> bool {
        env.storage().persistent().has(&DataKey::Revoked(worker))
    }
}
