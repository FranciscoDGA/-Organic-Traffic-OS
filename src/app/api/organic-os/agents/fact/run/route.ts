import { NextRequest, NextResponse } from 'next/server';
import { FactAgentService } from '../../../../../../../organic-traffic-os/core/agents/fact-agent/fact-agent.service';
import { ResearchAgentService } from '../../../../../../../organic-traffic-os/core/agents/research-agent/research-agent.service';
import { PlanningAgentService } from '../../../../../../../organic-traffic-os/core/agents/planning-agent/planning-agent.service';
import { DiscoveryAgentService } from '../../../../../../../organic-traffic-os/core/agents/discovery-agent/discovery-agent.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const blog_id = body.blog_id || 'passacumaru';

    let research_pack = body.research_pack;
    
    // Auto-pipeline if no research pack provided
    if (!research_pack) {
      const dService = new DiscoveryAgentService();
      const discovery = await dService.runDiscovery({ blog_id, topic: body.topic || 'Concurso Cumaru', mode: 'mock', limit: 5 });
      
      const pService = new PlanningAgentService();
      const backlog = pService.generateBacklog(discovery.opportunities);
      
      const rService = new ResearchAgentService();
      const researchReport = await rService.runResearch({ blog_id, backlog_item: backlog[0], mode: 'mock' });
      research_pack = researchReport.pack;
    }

    const fService = new FactAgentService();
    const report = await fService.runFactValidation({ blog_id, research_pack, mode: body.mode || 'mock' });
    
    return NextResponse.json(report);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
