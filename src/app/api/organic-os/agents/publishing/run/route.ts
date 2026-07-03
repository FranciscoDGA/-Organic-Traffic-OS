import { NextRequest, NextResponse } from 'next/server';
import { PublishingAgentService } from '../../../../../../../organic-traffic-os/core/agents/publishing-agent/publishing-agent.service';
import { VisibilityAgentService } from '../../../../../../../organic-traffic-os/core/agents/visibility-agent/visibility-agent.service';
import { ReviewAgentService } from '../../../../../../../organic-traffic-os/core/agents/review-agent/review-agent.service';
import { WriterAgentService } from '../../../../../../../organic-traffic-os/core/agents/writer-agent/writer-agent.service';
import { FactAgentService } from '../../../../../../../organic-traffic-os/core/agents/fact-agent/fact-agent.service';
import { ResearchAgentService } from '../../../../../../../organic-traffic-os/core/agents/research-agent/research-agent.service';
import { PlanningAgentService } from '../../../../../../../organic-traffic-os/core/agents/planning-agent/planning-agent.service';
import { DiscoveryAgentService } from '../../../../../../../organic-traffic-os/core/agents/discovery-agent/discovery-agent.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const blog_id = body.blog_id || 'passacumaru';
    const topic = body.topic || 'Concurso Cumaru';
    const config = body.config || { target_adapters: ['json', 'html', 'markdown'], auto_publish: false };

    let { visibility_report } = body;
    let draft_pack = body.draft_pack;
    let evidence_pack = body.evidence_pack;
    
    // Auto-pipeline
    if (!visibility_report) {
      const dService = new DiscoveryAgentService();
      const discovery = await dService.runDiscovery({ blog_id, topic, mode: 'mock', limit: 5 });
      
      const pService = new PlanningAgentService();
      const backlog = pService.generateBacklog(discovery.opportunities);
      
      const rService = new ResearchAgentService();
      const researchReport = await rService.runResearch({ blog_id, backlog_item: backlog[0], mode: 'mock' });
      const research_pack = researchReport.pack;

      const fService = new FactAgentService();
      const factReport = await fService.runFactValidation({ blog_id, research_pack, mode: 'mock' });
      evidence_pack = factReport.evidence_pack;

      const wService = new WriterAgentService();
      const writerReport = await wService.runWriterDraft({ blog_id, research_pack, evidence_pack, mode: 'mock' });
      draft_pack = writerReport.draft_pack;

      const revService = new ReviewAgentService();
      const revOutput = await revService.runReview({ blog_id, draft_pack, evidence_pack, research_pack, mode: 'mock' });
      const review_report = revOutput.report;

      const visService = new VisibilityAgentService();
      const visOutput = await visService.runVisibility({ blog_id, draft_pack, evidence_pack, review_report, mode: 'mock' });
      visibility_report = visOutput.report;
    }

    const pubService = new PublishingAgentService();
    const report = await pubService.runPublishing({ 
      blog_id, 
      optimized_draft: visibility_report.optimized_draft, 
      visibility_report, 
      metadata: visibility_report.metadata, 
      schema: visibility_report.schema, 
      config, 
      mode: body.mode || 'mock' 
    });
    
    return NextResponse.json(report);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
