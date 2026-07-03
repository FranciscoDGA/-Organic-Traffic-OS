import { ModuleDefinition, ModuleType, ModuleStatus } from './runtime.types';
import { eventBus } from './event-bus';

export class ModuleRegistry {
  private modules: Map<string, ModuleDefinition> = new Map();

  register(id: string, name: string, type: ModuleType, version: string, dependencies: string[] = []): ModuleDefinition {
    const module: ModuleDefinition = {
      id,
      name,
      type,
      version,
      dependencies,
      status: 'registered',
    };
    this.modules.set(id, module);
    return module;
  }

  updateStatus(id: string, status: ModuleStatus, error?: string): void {
    const mod = this.modules.get(id);
    if (!mod) return;
    mod.status = status;
    if (status === 'loaded' || status === 'active') {
      mod.loadedAt = new Date().toISOString();
    }
    if (error) mod.error = error;
    eventBus.emit('ModuleLoaded', 'module-registry', { moduleId: id, status });
  }

  get(id: string): ModuleDefinition | undefined {
    return this.modules.get(id);
  }

  getAll(): ModuleDefinition[] {
    return Array.from(this.modules.values());
  }

  getByType(type: ModuleType): ModuleDefinition[] {
    return this.getAll().filter(m => m.type === type);
  }

  getActive(): ModuleDefinition[] {
    return this.getAll().filter(m => m.status === 'active' || m.status === 'loaded');
  }

  unregister(id: string): boolean {
    const existed = this.modules.has(id);
    this.modules.delete(id);
    if (existed) {
      eventBus.emit('ModuleUnloaded', 'module-registry', { moduleId: id });
    }
    return existed;
  }

  resolveDependencies(id: string): string[] {
    const mod = this.modules.get(id);
    if (!mod) return [];
    const resolved: string[] = [];
    const visited = new Set<string>();
    const stack = [id];
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);
      const currentMod = this.modules.get(current);
      if (currentMod && current !== id) {
        resolved.push(current);
      }
      if (currentMod) {
        for (const dep of currentMod.dependencies) {
          if (!visited.has(dep)) stack.push(dep);
        }
      }
    }
    return resolved;
  }

  hasCircularDependencies(): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const adjList = new Map<string, string[]>();

    for (const [id, mod] of this.modules) {
      adjList.set(id, mod.dependencies.filter(d => this.modules.has(d)));
    }

    const dfs = (node: string): boolean => {
      visited.add(node);
      recursionStack.add(node);
      for (const neighbor of adjList.get(node) || []) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        } else if (recursionStack.has(neighbor)) {
          return true;
        }
      }
      recursionStack.delete(node);
      return false;
    };

    for (const id of this.modules.keys()) {
      if (!visited.has(id)) {
        if (dfs(id)) return true;
      }
    }
    return false;
  }

  size(): number {
    return this.modules.size;
  }
}

export const moduleRegistry = new ModuleRegistry();
