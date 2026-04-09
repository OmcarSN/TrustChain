import { execSync } from 'child_process';
import fs from 'fs';

try {
  const result = execSync('cargo build --release --target wasm32-unknown-unknown', { 
    cwd: 'contracts/credential',
    encoding: 'utf-8' 
  });
  fs.writeFileSync('build_output.txt', result);
} catch (error) {
  fs.writeFileSync('build_output.txt', error.stdout + '\n' + error.stderr);
}
