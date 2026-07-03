import { AgentManifest } from '../config/agent.schema';

export class SharedAgentRegistry {
  private static agents: Record<string, AgentManifest> = {};

  static register(manifest: AgentManifest) {
    this.agents[manifest.id] = manifest;
    console.log(`[SHARED REGISTRY] Registered agent: ${manifest.id}`);
  }

  static getAgent(id: string): AgentManifest | undefined {
    return this.agents[id];
  }

  static getAllAgents(): AgentManifest[] {
    return Object.values(this.agents);
  }
}
