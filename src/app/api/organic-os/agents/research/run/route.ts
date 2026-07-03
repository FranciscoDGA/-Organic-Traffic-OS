import { NextRequest, NextResponse } from 'next/server';
import { ResearchAgentService } from '../../../../../../../organic-traffic-os/core/agents/research-agent/research-agent.service';
import { DiscoveryAgentService } from '../../../../../../../organic-traffic-os/core/agents/discovery-agent/discovery-agent.service';
import { PlanningAgentService } from '../../../../../../../organic-traffic-os/core/agents/planning-agent/planning-agent.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const blog_id = body.blog_id || 'passacumaru';

    // Auto-build backlog item if not provided
    let backlog_item = body.backlog_item;
    if (!backlog_item) {
      const dService = new DiscoveryAgentService();
      const discovery = await dService.runDiscovery({
        blog_id, topic: body.topic || 'Concurso Prefeitura de Cumaru do Norte',
        mode: 'mock', limit: 10,
      });
      const pService = new PlanningAgentService();
      const backlog = pService.generateBacklog(discovery.opportunities);
      const idx = Math.min(body.item_index || 0, backlog.length - 1);
      backlog_item = backlog[idx];
    }

    const service = new ResearchAgentService();
    const report = await service.runResearch({ blog_id, backlog_item, mode: body.mode || 'mock' });
    return NextResponse.json(report);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
