import { NextResponse } from 'next/server';
import { SharedAgentDispatcher } from '../../../../../../shared/dispatcher/agent-dispatcher';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { blog_id, intent, input } = body;

    if (!intent) {
      return NextResponse.json(
        { error: 'Missing intent' },
        { status: 400 }
      );
    }

    const result = await SharedAgentDispatcher.dispatch('mock_agent_id', intent, input || {});

    return NextResponse.json({
      status: 'success',
      data: result
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
