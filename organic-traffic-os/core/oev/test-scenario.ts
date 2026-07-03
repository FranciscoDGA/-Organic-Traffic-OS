import { ValidationStep } from './validation.types';

export function createTestScenario(): ValidationStep[] {
  return [
    { id: 'step-1', name: 'Mission Control', module: 'mission-control', status: 'pending', retries: 0, events: [] },
    { id: 'step-2', name: 'Mission Planner', module: 'mission-planner', status: 'pending', retries: 0, events: [] },
    { id: 'step-3', name: 'Workflow Orchestrator', module: 'workflow-orchestrator', status: 'pending', retries: 0, events: [] },
    { id: 'step-4', name: 'Runtime Engine', module: 'runtime-engine', status: 'pending', retries: 0, events: [] },
    { id: 'step-5', name: 'Event Bus', module: 'event-bus', status: 'pending', retries: 0, events: [] },
    { id: 'step-6', name: 'AI Intelligence Layer', module: 'ai-intelligence', status: 'pending', retries: 0, events: [] },
    { id: 'step-7', name: 'Knowledge Base', module: 'knowledge-base', status: 'pending', retries: 0, events: [] },
    { id: 'step-8', name: 'Writing Agent', module: 'writing-agent', status: 'pending', retries: 0, events: [] },
    { id: 'step-9', name: 'Editor-in-Chief Agent', module: 'editor-agent', status: 'pending', retries: 0, events: [] },
    { id: 'step-10', name: 'QA Agent', module: 'qa-agent', status: 'pending', retries: 0, events: [] },
    { id: 'step-11', name: 'Compliance Agent', module: 'compliance-agent', status: 'pending', retries: 0, events: [] },
    { id: 'step-12', name: 'Approval Queue', module: 'approval-queue', status: 'pending', retries: 0, events: [] },
    { id: 'step-13', name: 'Universal Publisher', module: 'publisher', status: 'pending', retries: 0, events: [] },
    { id: 'step-14', name: 'Organic Bridge', module: 'organic-bridge', status: 'pending', retries: 0, events: [] },
    { id: 'step-15', name: 'Analytics', module: 'analytics', status: 'pending', retries: 0, events: [] },
    { id: 'step-16', name: 'Business Intelligence', module: 'business-intelligence', status: 'pending', retries: 0, events: [] },
    { id: 'step-17', name: 'Learning', module: 'learning', status: 'pending', retries: 0, events: [] },
    { id: 'step-18', name: 'Executive Briefing', module: 'executive-briefing', status: 'pending', retries: 0, events: [] },
  ];
}

export const allModules = [
  'mission-control', 'mission-planner', 'workflow-orchestrator', 'runtime-engine', 'event-bus',
  'ai-intelligence', 'knowledge-base', 'writing-agent', 'editor-agent', 'qa-agent',
  'compliance-agent', 'approval-queue', 'publisher', 'organic-bridge', 'analytics',
  'business-intelligence', 'learning', 'executive-briefing',
];
