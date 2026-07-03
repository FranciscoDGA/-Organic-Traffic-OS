import { NextResponse } from 'next/server';
import { InfrastructureValidatorService } from '../../../../../src/infrastructure/validator/validator.service';

export async function POST() {
  try {
    const report = await InfrastructureValidatorService.executeAuditory();
    console.log(`[Infrastructure Validator] Re-checagem executada em ${report.timestamp}. Score: ${report.overall_health_score}`);
    
    return NextResponse.json({
      success: true,
      message: 'Re-checagem concluída.',
      report
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
