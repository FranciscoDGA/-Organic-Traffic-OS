const fs = require('fs');

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

const files = [
  'src/app/api/organic-os/publisher/history/route.ts',
  'src/app/api/organic-os/publisher/mode/route.ts',
  'src/app/api/organic-os/publisher/publish/route.ts',
  'src/app/api/organic-os/publisher/queue/route.ts',
  'src/app/api/organic-os/publisher/schedule/route.ts'
];

for (const f of files) {
  if (fs.existsSync(f)) {
    fs.writeFileSync(f, legacyApiContent);
    console.log('Isolated:', f);
  }
}
