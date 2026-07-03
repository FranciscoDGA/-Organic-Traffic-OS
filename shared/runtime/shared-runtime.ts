import { ModuleManifest } from '../config/module.schema';
import { SharedAgentRegistry } from '../registry/agent-registry';
import { SharedAgentDispatcher } from '../dispatcher/agent-dispatcher';

export class SharedRuntime {
  private static modules: Record<string, ModuleManifest> = {};
  private static isRunning: boolean = false;

  static initialize() {
    console.log('[SHARED RUNTIME] Initializing AI Agency OS Runtime...');
    this.isRunning = true;
  }

  static loadModule(manifest: ModuleManifest) {
    this.modules[manifest.name] = manifest;
    console.log(`[SHARED RUNTIME] Loaded module: ${manifest.name} (v${manifest.version})`);
  }

  static getStatus() {
    return {
      status: this.isRunning ? 'online' : 'offline',
      modules_loaded: Object.keys(this.modules).length,
      modules: Object.keys(this.modules),
      agents_registered: SharedAgentRegistry.getAllAgents().length,
      queue_status: 'idle',
      total_logs: 0,
    };
  }

  static async runWorkflowStep(targetAgentId: string, intent: string, input: Record<string, any>) {
    console.log(`[SHARED RUNTIME] Running workflow step for intent: ${intent}`);
    return SharedAgentDispatcher.dispatch(targetAgentId, intent, input);
  }
}
