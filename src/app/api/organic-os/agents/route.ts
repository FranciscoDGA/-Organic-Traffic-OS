import { NextResponse } from 'next/server';
import { SharedAgentRegistry } from '../../../../../shared/registry/agent-registry';

export async function GET() {
  const agents = SharedAgentRegistry.getAllAgents();
  return NextResponse.json({
    status: 'success',
    data: agents
  });
}
