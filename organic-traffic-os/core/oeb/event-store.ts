import { OrganicEvent } from './event.types';

class EventStore {
  private events: OrganicEvent[] = [];
  private maxEvents = 10000;

  store(event: OrganicEvent): void {
    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
  }

  getAll(): OrganicEvent[] {
    return [...this.events];
  }

  getById(id: string): OrganicEvent | undefined {
    return this.events.find(e => e.event_id === id);
  }

  getByType(type: string): OrganicEvent[] {
    return this.events.filter(e => e.event_type === type);
  }

  getByWorkspace(workspaceId: string): OrganicEvent[] {
    return this.events.filter(e => e.workspace_id === workspaceId);
  }

  getByMission(missionId: string): OrganicEvent[] {
    return this.events.filter(e => e.mission_id === missionId);
  }

  getByCorrelation(correlationId: string): OrganicEvent[] {
    return this.events.filter(e => e.correlation_id === correlationId);
  }

  getRecent(count: number): OrganicEvent[] {
    return this.events.slice(-count);
  }

  getFailed(): OrganicEvent[] {
    return this.events.filter(e => e.status === 'failed' || e.status === 'dead_letter');
  }

  updateStatus(id: string, status: OrganicEvent['status']): boolean {
    const event = this.events.find(e => e.event_id === id);
    if (!event) return false;
    event.status = status;
    return true;
  }

  getStats(): { total: number; byStatus: Record<string, number>; byType: Record<string, number> } {
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    for (const e of this.events) {
      byStatus[e.status] = (byStatus[e.status] || 0) + 1;
      byType[e.event_type] = (byType[e.event_type] || 0) + 1;
    }
    return { total: this.events.length, byStatus, byType };
  }
}

export const eventStore = new EventStore();
