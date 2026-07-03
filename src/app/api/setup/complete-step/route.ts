import { NextRequest, NextResponse } from 'next/server';
import { InfrastructureWizardService } from '../../../../../src/infrastructure/wizard/wizard.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key } = body;
    if (!key) {
      return NextResponse.json({ error: 'Parâmetro key é obrigatório.' }, { status: 400 });
    }

    InfrastructureWizardService.completeStepItem(key);
    const status = await InfrastructureWizardService.getStatus();

    return NextResponse.json({
      success: true,
      message: `Etapa ${key} marcada como concluída manualmente.`,
      status
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
