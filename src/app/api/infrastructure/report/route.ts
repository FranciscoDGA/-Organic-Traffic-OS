import { NextResponse } from 'next/server';
import { InfrastructureValidatorService } from '../../../../../src/infrastructure/validator/validator.service';

export async function GET() {
  try {
    const report = await InfrastructureValidatorService.executeAuditory();
    return NextResponse.json(report);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
