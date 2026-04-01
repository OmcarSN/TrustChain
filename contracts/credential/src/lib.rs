#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct WorkerData {
    pub name: String,
    pub skill: String,
    pub city: String,
    pub exp: u32,
    pub bio: String,
}

#[contract]
pub struct CredentialContract;

#[contractimpl]
impl CredentialContract {
    pub fn issue_credential(
        env: Env,
        worker: Address,
        name: String,
        skill: String,
        city: String,
        exp: u32,
        bio: String,
    ) {
        worker.require_auth();
        let data = WorkerData { name, skill, city, exp, bio };
        env.storage().persistent().set(&worker, &data);
    }

    pub fn get_credential(env: Env, worker: Address) -> Option<WorkerData> {
        env.storage().persistent().get(&worker)
    }

    pub fn has_credential(env: Env, worker: Address) -> bool {
        env.storage().persistent().has(&worker)
    }
}
