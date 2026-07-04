import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate auto-saving to database
    // In reality, this would upsert a Draft to a SQL Database

    return NextResponse.json({
      success: true,
      persistedAt: new Date().toISOString(),
      dbStatus: "Persistência Pendente",
      source: "Banco Local (Em Memória)",
      log: `Draft saved successfully at ${new Date().toLocaleTimeString()} (Simulated)`
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
