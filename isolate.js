const fs = require('fs');
const path = require('path');

const validDirs = [
  'seo-auditor', 'competitor-analysis', 'settings', 'publisher', 'analytics', 
  'ai-writer', 'internal-linking', 'topic-cluster', 'content-planner', 
  'keywords', 'site-configuration', 'workspaces'
];

function findRoutes(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findRoutes(filePath, fileList);
    } else if (file === 'route.ts' || file === 'route.tsx' || file === 'page.ts' || file === 'page.tsx') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const apiPath = path.join(process.cwd(), 'src/app/api/organic-os');
const allApiRoutes = findRoutes(apiPath);
const legacyApiRoutes = allApiRoutes.filter(routePath => {
  const relativePath = path.relative(apiPath, routePath);
  const topLevelDir = relativePath.split(path.sep)[0];
  return !validDirs.includes(topLevelDir);
});

const legacyApiContent = `import { NextResponse } from 'next/server';

export async function GET() { return disableResponse(); }
export async function POST() { return disableResponse(); }
export async function PUT() { return disableResponse(); }
export async function DELETE() { return disableResponse(); }
export async function PATCH() { return disableResponse(); }

function disableResponse() {
  return NextResponse.json({
    status: "disabled",
    reason: "Legacy scaffold isolated from production build"
  });
}
`;

let count = 0;
for (const route of legacyApiRoutes) {
  fs.writeFileSync(route, legacyApiContent);
  count++;
}
console.log(`Isolated ${count} legacy API routes.`);

// Also check src/app/organic-os for legacy UI routes causing build errors
// Valid UI dirs include setup, inventory plus the 12 above.
const validUIDirs = [...validDirs, 'setup', 'inventory'];
const uiPath = path.join(process.cwd(), 'src/app/organic-os');
const allUIRoutes = findRoutes(uiPath);
const legacyUIRoutes = allUIRoutes.filter(routePath => {
  const relativePath = path.relative(uiPath, routePath);
  const topLevelDir = relativePath.split(path.sep)[0];
  return !validUIDirs.includes(topLevelDir);
});

const legacyUIContent = `export default function LegacyDisabledPage() {
  return (
    <div style={{ padding: '2rem', color: '#ff4444', fontFamily: 'monospace' }}>
      <h1>Disabled Legacy UI</h1>
      <p>Reason: Legacy scaffold isolated from production build</p>
    </div>
  );
}
`;

let countUI = 0;
for (const route of legacyUIRoutes) {
  fs.writeFileSync(route, legacyUIContent);
  countUI++;
}
console.log(`Isolated ${countUI} legacy UI routes.`);
