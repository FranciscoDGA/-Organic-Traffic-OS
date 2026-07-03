import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { AgentTask, TaskStatus } from '../types';

export class SharedTaskQueue {
  static async createAgentTask(blog_id: string, agent_name: string, task_type: string, input: any): Promise<AgentTask | null> {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('agent_tasks')
      .insert({ blog_id, agent_name, task_type, input, status: 'pending' })
      .select()
      .single();
    
    if (error) {
      console.error('[TASK QUEUE] Erro ao criar task:', error.message);
      return null;
    }
    return data as AgentTask;
  }

  static async updateAgentTaskStatus(task_id: string, status: TaskStatus): Promise<boolean> {
    const supabaseAdmin = getSupabaseAdmin();
    const updatePayload: any = { status };
    if (status === 'running') updatePayload.started_at = new Date().toISOString();
    
    const { error } = await supabaseAdmin
      .from('agent_tasks')
      .update(updatePayload)
      .eq('id', task_id);
      
    return !error;
  }

  static async finishAgentTask(task_id: string, output: any): Promise<boolean> {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('agent_tasks')
      .update({ status: 'completed', output, finished_at: new Date().toISOString() })
      .eq('id', task_id);
      
    return !error;
  }

  static async failAgentTask(task_id: string, error_message: string): Promise<boolean> {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('agent_tasks')
      .update({ status: 'failed', error_message, finished_at: new Date().toISOString() })
      .eq('id', task_id);
      
    return !error;
  }

  static async logAgentMessage(task_id: string, agent_name: string, message: string, level: string = 'info'): Promise<void> {
    const supabaseAdmin = getSupabaseAdmin();
    await supabaseAdmin
      .from('agent_logs')
      .insert({ task_id, agent_name, message, level });
  }

  static async getPendingTasks(): Promise<AgentTask[]> {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('agent_tasks')
      .select('*')
      .eq('status', 'pending');
      
    if (error) return [];
    return data as AgentTask[];
  }
}
