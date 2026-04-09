import { StrKey } from '@stellar/stellar-sdk';
import fs from 'fs';
fs.writeFileSync('keys.txt', 'Credential: ' + StrKey.encodeContract(Buffer.alloc(32, 1)) + '\nReputation: ' + StrKey.encodeContract(Buffer.alloc(32, 2)));
