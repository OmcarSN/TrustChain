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
    
    // Increase common border widths from 1px to 2px
    const borderReplacements = [
        "border: '1px solid #E5E7EB'",
        "border: '1px solid #DBEAFE'",
        "border: '1px solid #D1FAE5'",
        "border: '1px solid #FFEDD5'",
        "border: '1px solid #F3F4F6'"
    ];
    
    borderReplacements.forEach(b => {
        if (content.includes(b)) {
            content = content.replaceAll(b, b.replace('1px', '2px'));
            changed = true;
        }
    });
    
    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated borders in:', file);
    }
});
