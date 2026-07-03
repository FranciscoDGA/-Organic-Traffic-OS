import { WorkflowOrchestrator } from './workflow-orchestrator';

export class WorkflowService {
  private engine = new WorkflowOrchestrator();

  public startPipeline(blogId: string) {
    return this.engine.startPipeline(blogId);
  }
  public getExecution(id: string) {
    return { id, status: "Running", etapa_atual: "Research Pack", progresso: 75 };
  }
  public cancelExecution(id: string) {
    return this.engine.cancelExecution(id);
  }
  public resumeExecution(id: string) {
    return this.engine.resumeExecution(id);
  }
  public getProgress(id: string) {
    return { id, progresso: 75 };
  }
}
