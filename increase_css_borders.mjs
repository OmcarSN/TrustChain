import fs from 'fs';
import path from 'path';

const file = path.resolve('./src/index.css');
let content = fs.readFileSync(file, 'utf8');

// Replace all remaining 1px solid borders that match our typical border colors
const borderReplacements = [
    "border: 1px solid #E5E7EB",
    "border: 1px solid #DBEAFE",
    "border: 1px solid #D1FAE5",
    "border: 1px solid #FFEDD5",
    "border: 1px solid #F3F4F6",
    "border: 1px solid rgba(30,58,138,0.1)"
];

let changed = false;
borderReplacements.forEach(b => {
    if (content.includes(b)) {
        content = content.replaceAll(b, b.replace('1px', '2px'));
        changed = true;
    }
});

if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated 1px borders in index.css to 2px');
}
