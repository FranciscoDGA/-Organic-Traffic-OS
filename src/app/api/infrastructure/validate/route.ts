import { NextResponse } from 'next/server';
import { InfrastructureValidatorService } from '../../../../../src/infrastructure/validator/validator.service';

export async function POST() {
  try {
    const report = await InfrastructureValidatorService.executeAuditory();
    return NextResponse.json({
      success: true,
      message: 'Auditoria de infraestrutura executada com sucesso.',
      report
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
