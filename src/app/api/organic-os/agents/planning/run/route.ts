import { NextRequest, NextResponse } from 'next/server';
import { PlanningAgentService } from '../../../../../../../organic-traffic-os/core/agents/planning-agent/planning-agent.service';
import { DiscoveryAgentService } from '../../../../../../../organic-traffic-os/core/agents/discovery-agent/discovery-agent.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const blog_id = body.blog_id || 'passacumaru';
    let discovery_report = body.discovery_report;
    if (!discovery_report) {
      const dService = new DiscoveryAgentService();
      discovery_report = await dService.runDiscovery({
        blog_id,
        topic: body.topic || 'Concurso Prefeitura de Cumaru do Norte',
        mode: 'mock',
        limit: body.limit || 10,
      });
    }
    const service = new PlanningAgentService();
    const report = await service.runPlanning({
      blog_id,
      discovery_report,
      start_date: body.start_date || new Date().toISOString().split('T')[0],
      weeks: body.weeks || 8,
    });
    return NextResponse.json(report);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
