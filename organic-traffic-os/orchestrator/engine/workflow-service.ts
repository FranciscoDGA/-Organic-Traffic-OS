export class WorkflowService {
  start(data: any): any {
    return { id: 'mock', status: 'started' };
  }

  getWorkflow(id: string): any {
    return { id };
  }

  listWorkflows(): any[] {
    return [];
  }

  cancel(id: string): any {
    return { id, status: 'cancelled' };
  }

  resume(id: string): any {
    return { id, status: 'resumed' };
  }
}
