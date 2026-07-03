import { NextResponse } from 'next/server';
import { InfrastructureValidatorService } from '../../../../../src/infrastructure/validator/validator.service';

export async function GET() {
  try {
    const report = await InfrastructureValidatorService.executeAuditory();
    const workspaceDiagnostics = report.diagnostics.filter(d => d.category === 'Organic Bridge');
    
    return NextResponse.json({
      timestamp: report.timestamp,
      workspaces_health_score: report.scores.workspace,
      workspaces: workspaceDiagnostics
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
