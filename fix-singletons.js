const fs = require('fs');
const path = require('path');

function findSingletons(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findSingletons(filePath, fileList);
    } else if (file === '_service-singleton.ts') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const apiPath = path.join(process.cwd(), 'src/app/api/organic-os');
const singletons = findSingletons(apiPath);

let fixedCount = 0;
for (const file of singletons) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Example original content:
  // const AiService = new Proxy({}, { get: () => () => ({}) }) as any;
  // let aiService: AiService | null = null;
  // export function getAiService(): AiService {
  
  // Find the class name (e.g. AiService)
  const match = content.match(/const ([A-Z][a-zA-Z0-9_]+) = new Proxy/);
  if (match) {
    const className = match[1];
    
    // Replace let var: ClassName | null
    const regex1 = new RegExp(`: ${className} \\| null`, 'g');
    content = content.replace(regex1, `: typeof ${className} | null`);
    
    // Replace export function fn(): ClassName {
    const regex2 = new RegExp(`: ${className} \\{`, 'g');
    content = content.replace(regex2, `: typeof ${className} {`);
    
    fs.writeFileSync(file, content);
    fixedCount++;
  }
}
console.log(`Fixed ${fixedCount} singleton files.`);
