import { Strategy } from './mission-planner.types';
import { workflowTemplates } from '../owo/workflow-templates';

export class WorkflowSelector {
  select(strategy: Strategy): string | undefined {
    const tpl = workflowTemplates[strategy.workflowId.replace('tpl-', '')];
    return tpl ? tpl.id : undefined;
  }

  getCompatibleWorkflows(strategy: Strategy): string[] {
    return [strategy.workflowId];
  }
}
