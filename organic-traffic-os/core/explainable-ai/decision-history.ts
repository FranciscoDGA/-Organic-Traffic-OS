import { DecisionExplanation } from './explainable.types';

const history: DecisionExplanation[] = [];

export function addToHistory(explanation: DecisionExplanation) { history.push(explanation); }
export function getHistory(limit = 50) { return history.slice(-limit); }
export function getById(id: string) { return history.find(h => h.id === id); }
export function getByWorkspace(workspaceId: string) { return history.filter(h => h.workspace_id === workspaceId); }
export function getByType(type: string) { return history.filter(h => h.type === type); }
