import { NextRequest, NextResponse } from 'next/server';
import { DiscoveryAgentService } from '../../../../../../../organic-traffic-os/core/agents/discovery-agent/discovery-agent.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const service = new DiscoveryAgentService();
    const report = await service.runDiscovery({
      blog_id: body.blog_id || 'passacumaru',
      topic: body.topic || 'Concurso Prefeitura de Cumaru do Norte',
      mode: body.mode || 'mock',
      limit: body.limit || 10,
    });
    return NextResponse.json(report);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
