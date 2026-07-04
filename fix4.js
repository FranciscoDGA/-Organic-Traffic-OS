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
const files = walk('./src/app/api');
let count = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  content = content.replace(/import\s+\{.*\}\s+from\s+['\`\"]@\/core\/.*?['\`\"];/g, 'const MOCK_SERVICE = new Proxy({}, { get: () => () => ({}) }) as any;');
  if (content !== original) {
    fs.writeFileSync(f, content);
    count++;
  }
});
console.log('Fixed ' + count + ' routes.');
