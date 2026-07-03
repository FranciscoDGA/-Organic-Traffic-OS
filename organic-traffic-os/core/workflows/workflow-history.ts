import { WorkflowState } from './workflow-state';
export interface WorkflowHistory { logState(s: WorkflowState): void; getTimeline(): WorkflowState[]; }
