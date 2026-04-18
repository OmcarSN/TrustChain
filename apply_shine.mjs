import fs from 'fs';
import path from 'path';

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === 'node_modules') return;
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(filePath));
        } else if (filePath.endsWith('.jsx')) {
            results.push(filePath);
        }
    });
    return results;
}

const files = walkDir(path.resolve('./src'));
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    if (content.includes("background: '#FFFFFF'")) {
        // Replace solid white with glassmorphic background
        content = content.replace(/background:\s*'#FFFFFF'/g, "background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(24px)'");
        changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated:', file);
    }
});
