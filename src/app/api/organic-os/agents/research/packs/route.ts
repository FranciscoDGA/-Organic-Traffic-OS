import { NextResponse } from 'next/server';
import { ResearchAgentService } from '../../../../../../../organic-traffic-os/core/agents/research-agent/research-agent.service';
import { DiscoveryAgentService } from '../../../../../../../organic-traffic-os/core/agents/discovery-agent/discovery-agent.service';
import { PlanningAgentService } from '../../../../../../../organic-traffic-os/core/agents/planning-agent/planning-agent.service';

export async function GET() {
  const dService = new DiscoveryAgentService();
  const discovery = await dService.runDiscovery({ blog_id: 'passacumaru', topic: 'Concurso Cumaru', mode: 'mock', limit: 5 });
  const pService = new PlanningAgentService();
  const backlog = pService.generateBacklog(discovery.opportunities);
  const rService = new ResearchAgentService();
  const packs = await Promise.all(
    backlog.slice(0, 3).map(item => rService.runResearch({ blog_id: 'passacumaru', backlog_item: item, mode: 'mock' }).then(r => r.pack))
  );
  return NextResponse.json(packs);
}
