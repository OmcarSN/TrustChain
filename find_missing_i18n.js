import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');
const keys = new Set();
const regex = /t\(['"]([^'"]+)['"]\)/g;

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      let match;
      while ((match = regex.exec(content)) !== null) {
        keys.add(match[1]);
      }
    }
  }
}

walk(srcDir);
const sortedKeys = Array.from(keys).sort();

const enPath = path.join(srcDir, 'locales', 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const hiPath = path.join(srcDir, 'locales', 'hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

const missingEn = [];
const missingHi = [];

function checkKey(data, keyPath) {
  const parts = keyPath.split('.');
  let curr = data;
  for (const p of parts) {
    if (curr && curr[p] !== undefined) {
      curr = curr[p];
    } else {
      return false;
    }
  }
  return true;
}

for (const key of sortedKeys) {
  if (!checkKey(enData, key)) missingEn.push(key);
  if (!checkKey(hiData, key)) missingHi.push(key);
}

fs.writeFileSync('missing_en.json', JSON.stringify(missingEn, null, 2));
fs.writeFileSync('missing_hi.json', JSON.stringify(missingHi, null, 2));
console.log(`Missing EN: ${missingEn.length}, Missing HI: ${missingHi.length}`);
