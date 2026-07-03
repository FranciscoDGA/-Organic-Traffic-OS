import { BaseAgent } from './base-agent';
export interface AgentFactory { create(role: string): BaseAgent; }
