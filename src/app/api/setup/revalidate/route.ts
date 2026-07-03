import { NextResponse } from 'next/server';
import { InfrastructureWizardService } from '../../../../../src/infrastructure/wizard/wizard.service';

export async function POST() {
  try {
    const status = await InfrastructureWizardService.getStatus();
    return NextResponse.json({
      success: true,
      message: 'Re-checagem do progresso concluída com sucesso.',
      status
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
