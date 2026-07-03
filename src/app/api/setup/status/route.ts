import { NextResponse } from 'next/server';
import { InfrastructureWizardService } from '../../../../../src/infrastructure/wizard/wizard.service';

export async function GET() {
  try {
    const status = await InfrastructureWizardService.getStatus();
    return NextResponse.json({
      overall_progress_percent: status.overall_progress_percent,
      completed_steps: status.completed_steps,
      pending_steps: status.pending_steps,
      critical_blocks: status.critical_blocks,
      readiness_scores: status.readiness_scores
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
