import { ContextPackage, ContextRequest, ContextBuildLog } from './context.types';
import { buildContext } from './context-builder';

const logs: ContextBuildLog[] = [];
const packages: Map<string, ContextPackage[]> = new Map();

export function getContextService() {
  return {
    build(request: ContextRequest, maxTokens?: number) {
      const start = Date.now();
      const { pkg, warnings } = buildContext(request, maxTokens);
      const duration = Date.now() - start;

      const list = packages.get(request.workspaceId) || [];
      list.push(pkg);
      packages.set(request.workspaceId, list);

      logs.push({
        id: `log-${logs.length + 1}`,
        workspaceId: request.workspaceId,
        sourcesUsed: pkg.sources,
        estimatedTokens: pkg.estimatedTokens,
        discardedTokens: 0,
        includedTokens: pkg.estimatedTokens,
        warnings,
        failures: [],
        duration,
        createdAt: new Date().toISOString(),
      });

      return pkg;
    },

    getPackages(workspaceId: string): ContextPackage[] {
      return packages.get(workspaceId) || [];
    },

    getPackage(id: string): ContextPackage | undefined {
      for (const list of packages.values()) {
        const found = list.find(p => p.id === id);
        if (found) return found;
      }
      return undefined;
    },

    getLogs(workspaceId: string): ContextBuildLog[] {
      return logs.filter(l => l.workspaceId === workspaceId);
    },

    getAllLogs(): ContextBuildLog[] {
      return logs;
    },
  };
}
