import { WorkflowRegistry } from './workflow-registry';
export interface BaseWorkflow {
  id: string;
  name: string;
  version: string;
  steps: string[];
  execute(): Promise<any>;
  pause(): void;
  resume(): void;
  cancel(): void;
}
export class WorkflowManager { constructor(public registry: WorkflowRegistry) {} }
