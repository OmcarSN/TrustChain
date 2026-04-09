import { StrKey } from '@stellar/stellar-sdk';
console.log('Credential:', StrKey.encodeContract(Buffer.alloc(32, 1)));
console.log('Reputation:', StrKey.encodeContract(Buffer.alloc(32, 2)));
