import { NextResponse } from 'next/server';
import { PlanningAgentService } from '../../../../../../../organic-traffic-os/core/agents/planning-agent/planning-agent.service';
import { DiscoveryAgentService } from '../../../../../../../organic-traffic-os/core/agents/discovery-agent/discovery-agent.service';

export async function GET() {
  const dService = new DiscoveryAgentService();
  const discovery = await dService.runDiscovery({ blog_id: 'passacumaru', topic: 'Concurso Cumaru', mode: 'mock', limit: 10 });
  const pService = new PlanningAgentService();
  const backlog = pService.generateBacklog(discovery.opportunities);
  const calendar = pService.generateCalendar(backlog, new Date().toISOString().split('T')[0], 8);
  return NextResponse.json(calendar);
}
