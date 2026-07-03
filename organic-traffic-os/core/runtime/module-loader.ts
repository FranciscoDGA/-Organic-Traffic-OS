import { ModuleType, ModuleDefinition } from './runtime.types';
import { moduleRegistry } from './module-registry';
import { eventBus } from './event-bus';

interface ModuleBlueprint {
  id: string;
  name: string;
  type: ModuleType;
  version: string;
  dependencies: string[];
}

const KNOWN_MODULES: ModuleBlueprint[] = [
  { id: 'connector-gsc', name: 'Google Search Console', type: 'connector', version: '1.0.0', dependencies: [] },
  { id: 'connector-ga4', name: 'Google Analytics 4', type: 'connector', version: '1.0.0', dependencies: [] },
  { id: 'connector-trends', name: 'Google Trends', type: 'connector', version: '1.0.0', dependencies: [] },
  { id: 'connector-bing', name: 'Bing Webmaster', type: 'connector', version: '1.0.0', dependencies: [] },
  { id: 'connector-rss', name: 'RSS & Sitemap', type: 'connector', version: '1.0.0', dependencies: [] },
  { id: 'connector-wordpress', name: 'WordPress', type: 'connector', version: '1.0.0', dependencies: ['connector-rss'] },
  { id: 'connector-headless', name: 'Headless CMS', type: 'connector', version: '1.0.0', dependencies: [] },
  { id: 'connector-newsletter', name: 'Newsletter', type: 'connector', version: '1.0.0', dependencies: [] },
  { id: 'engine-content', name: 'Content Intelligence', type: 'engine', version: '1.0.0', dependencies: ['connector-gsc', 'connector-ga4'] },
  { id: 'engine-semantic', name: 'Semantic Intelligence', type: 'engine', version: '1.0.0', dependencies: ['connector-gsc'] },
  { id: 'engine-authority', name: 'Authority Intelligence', type: 'engine', version: '1.0.0', dependencies: ['connector-gsc'] },
  { id: 'engine-opportunity', name: 'Opportunity Intelligence', type: 'engine', version: '1.0.0', dependencies: ['connector-gsc', 'connector-trends', 'engine-content', 'engine-semantic', 'engine-authority'] },
  { id: 'engine-predictive', name: 'Predictive Intelligence', type: 'engine', version: '1.0.0', dependencies: ['connector-gsc', 'connector-ga4'] },
  { id: 'orchestrator', name: 'Orchestrator', type: 'workflow', version: '1.0.0', dependencies: ['connector-gsc', 'connector-ga4', 'engine-content'] },
];

export class ModuleLoader {
  async loadAll(): Promise<ModuleDefinition[]> {
    const loaded: ModuleDefinition[] = [];
    const loadOrder = this.resolveLoadOrder(KNOWN_MODULES);
    for (const blueprint of loadOrder) {
      const result = await this.loadModule(blueprint);
      if (result) loaded.push(result);
    }
    return loaded;
  }

  async loadModule(blueprint: ModuleBlueprint): Promise<ModuleDefinition | null> {
    const existing = moduleRegistry.get(blueprint.id);
    if (existing && (existing.status === 'loaded' || existing.status === 'active')) {
      return existing;
    }

    const depsOk = this.checkDependencies(blueprint);
    if (!depsOk) {
      moduleRegistry.register(blueprint.id, blueprint.name, blueprint.type, blueprint.version, blueprint.dependencies);
      moduleRegistry.updateStatus(blueprint.id, 'error', 'Missing dependencies');
      return moduleRegistry.get(blueprint.id) || null;
    }

    moduleRegistry.register(blueprint.id, blueprint.name, blueprint.type, blueprint.version, blueprint.dependencies);
    moduleRegistry.updateStatus(blueprint.id, 'loaded');
    eventBus.emit('ModuleLoaded', 'module-loader', { moduleId: blueprint.id, name: blueprint.name, type: blueprint.type });
    return moduleRegistry.get(blueprint.id) || null;
  }

  async unloadModule(id: string): Promise<boolean> {
    const result = moduleRegistry.unregister(id);
    eventBus.emit('ModuleUnloaded', 'module-loader', { moduleId: id });
    return result;
  }

  private checkDependencies(blueprint: ModuleBlueprint): boolean {
    for (const dep of blueprint.dependencies) {
      const mod = moduleRegistry.get(dep);
      if (!mod || (mod.status !== 'loaded' && mod.status !== 'active')) return false;
    }
    return true;
  }

  private resolveLoadOrder(blueprints: ModuleBlueprint[]): ModuleBlueprint[] {
    const sorted: ModuleBlueprint[] = [];
    const visited = new Set<string>();
    const visit = (bp: ModuleBlueprint) => {
      if (visited.has(bp.id)) return;
      visited.add(bp.id);
      for (const depId of bp.dependencies) {
        const dep = blueprints.find(b => b.id === depId);
        if (dep) visit(dep);
      }
      sorted.push(bp);
    };
    for (const bp of blueprints) visit(bp);
    return sorted;
  }
}

export const moduleLoader = new ModuleLoader();
