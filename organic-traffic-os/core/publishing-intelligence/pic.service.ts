export interface PICItem {
  id: string;
  workspace_id: string;
  content_id: string;
  title: string;
  status: 'queued' | 'scheduled' | 'published' | 'failed';
  scheduled_at?: string;
  published_at?: string;
  created_at: string;
}

const queue: PICItem[] = [
  { id: 'pic-001', workspace_id: 'passacumaru', content_id: 'cnt-001', title: '10 Dicas de Viagem', status: 'scheduled', scheduled_at: '2026-07-05T10:00:00Z', created_at: '2026-07-01' },
  { id: 'pic-002', workspace_id: 'garimpeibrasil', content_id: 'cnt-002', title: 'Guia Garimpeiro', status: 'queued', created_at: '2026-07-02' },
];

export class PICService {
  getCalendar(workspaceId?: string): PICItem[] {
    const items = workspaceId ? queue.filter(i => i.workspace_id === workspaceId) : queue;
    return items.filter(i => i.status === 'scheduled');
  }

  getQueue(workspaceId?: string): PICItem[] {
    if (workspaceId) return queue.filter(i => i.workspace_id === workspaceId);
    return queue;
  }

  publishNow(id: string): boolean {
    const item = queue.find(i => i.id === id);
    if (!item) return false;
    item.status = 'published';
    item.published_at = new Date().toISOString();
    return true;
  }

  reschedule(id: string, newDate: string): boolean {
    const item = queue.find(i => i.id === id);
    if (!item) return false;
    item.scheduled_at = newDate;
    item.status = 'scheduled';
    return true;
  }

  schedule(payload: { workspace_id: string; content_id: string; title: string; scheduled_at?: string }): PICItem {
    const item: PICItem = {
      id: `pic-${Date.now()}`,
      workspace_id: payload.workspace_id,
      content_id: payload.content_id,
      title: payload.title,
      status: payload.scheduled_at ? 'scheduled' : 'queued',
      scheduled_at: payload.scheduled_at,
      created_at: new Date().toISOString(),
    };
    queue.push(item);
    return item;
  }
}

let instance: PICService | null = null;
export function getPICService(): PICService {
  if (!instance) instance = new PICService();
  return instance;
}
