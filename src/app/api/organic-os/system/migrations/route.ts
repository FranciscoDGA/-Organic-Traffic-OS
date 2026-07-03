import { NextResponse } from 'next/server';
import { getMigrations, getMigrationStatus } from '../../../../../../organic-traffic-os/core/database/migrations';

export async function GET() {
  const migrations = getMigrations();
  const status = getMigrationStatus();
  return NextResponse.json({
    success: true,
    data: {
      migrations: migrations.map(m => ({ id: m.id, version: m.version, name: m.name, schema: m.schema, executedAt: m.executedAt, rolledBack: m.rolledBack, executionTimeMs: m.executionTimeMs })),
      status,
    },
  });
}
