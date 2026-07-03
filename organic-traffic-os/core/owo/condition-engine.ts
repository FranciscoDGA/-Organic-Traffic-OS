import { WorkflowStep, WorkflowCondition } from './workflow.types';

export class ConditionEngine {
  evaluate(condition: WorkflowCondition, context: Record<string, unknown>): boolean {
    switch (condition.type) {
      case 'if': return this.evaluateIf(condition, context);
      case 'else': return true;
      case 'approval': return context['approved'] === true;
      case 'wait': return this.evaluateWait(condition, context);
      case 'retry': return true;
      case 'timeout': return this.evaluateTimeout(condition, context);
      case 'failover': return true;
      default: return true;
    }
  }

  private evaluateIf(condition: WorkflowCondition, context: Record<string, unknown>): boolean {
    if (!condition.field || !condition.operator) return true;
    const fieldValue = context[condition.field];
    const compareValue = condition.value;
    switch (condition.operator) {
      case 'equals': return fieldValue === compareValue;
      case 'not_equals': return fieldValue !== compareValue;
      case 'gt': return Number(fieldValue) > Number(compareValue);
      case 'lt': return Number(fieldValue) < Number(compareValue);
      case 'contains': return String(fieldValue).includes(String(compareValue));
      default: return true;
    }
  }

  private evaluateWait(condition: WorkflowCondition, context: Record<string, unknown>): boolean {
    const waitUntil = context['waitUntil'];
    if (!waitUntil) return false;
    return Date.now() >= new Date(waitUntil as string).getTime();
  }

  private evaluateTimeout(condition: WorkflowCondition, context: Record<string, unknown>): boolean {
    const startedAt = context['stepStartedAt'];
    if (!startedAt || !condition.timeoutMs) return false;
    return Date.now() - new Date(startedAt as string).getTime() > condition.timeoutMs;
  }

  evaluateAll(conditions: WorkflowCondition[], context: Record<string, unknown>): boolean {
    return conditions.every(c => this.evaluate(c, context));
  }
}
