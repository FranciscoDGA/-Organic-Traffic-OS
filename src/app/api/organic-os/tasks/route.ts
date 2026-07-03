import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { SharedTaskQueue } from '@shared/queue/task-queue';

export async function GET() {
  try {
    if (!process.env.SUPABASE_URL) {
      return NextResponse.json({ data: [] });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('agent_tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json({ status: 'success', data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.SUPABASE_URL) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { blog_id, agent_name, task_type, input } = body;

    const task = await SharedTaskQueue.createAgentTask(blog_id, agent_name, task_type, input);
    
    if (!task) {
      throw new Error('Failed to create task in Supabase.');
    }

    return NextResponse.json({ status: 'success', data: task });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
