const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src/app');
let fixedCount = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  
  // Replace anything like import { x } from '../../../../core/y' to '@/core/y'
  // Also handle cases where there are arbitrary directories before core
  content = content.replace(/from\s+['\`\"](\.\.\/)+([a-zA-Z0-9\-\_]+\/)*core\//g, `from '@/core/`);
  content = content.replace(/from\s+['\`\"]@core\//g, `from '@/core/`);
  
  if (content !== original) {
    fs.writeFileSync(f, content);
    fixedCount++;
  }
});
console.log('Fixed ' + fixedCount + ' files.');
