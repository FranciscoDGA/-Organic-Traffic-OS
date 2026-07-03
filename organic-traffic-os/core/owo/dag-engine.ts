import { WorkflowStep, DAGNode, DAGEdge } from './workflow.types';

export class DAGEngine {
  buildDAG(steps: WorkflowStep[]): { nodes: DAGNode[]; edges: DAGEdge[] } {
    const nodeMap = new Map<string, DAGNode>();
    const edges: DAGEdge[] = [];

    for (const step of steps) {
      nodeMap.set(step.id, { id: step.id, step, indegree: 0, outdegree: 0 });
    }

    for (const step of steps) {
      for (const dep of step.dependsOn) {
        if (nodeMap.has(dep)) {
          edges.push({ from: dep, to: step.id });
          nodeMap.get(step.id)!.indegree++;
          nodeMap.get(dep)!.outdegree++;
        }
      }
    }

    return { nodes: Array.from(nodeMap.values()), edges };
  }

  hasCycles(steps: WorkflowStep[]): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const adjList = new Map<string, string[]>();

    for (const step of steps) {
      adjList.set(step.id, step.dependsOn.filter(d => steps.some(s => s.id === d)));
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

    for (const step of steps) {
      if (!visited.has(step.id)) {
        if (dfs(step.id)) return true;
      }
    }
    return false;
  }

  topologicalSort(steps: WorkflowStep[]): string[] {
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();
    const result: string[] = [];

    for (const step of steps) {
      inDegree.set(step.id, step.dependsOn.filter(d => steps.some(s => s.id === d)).length);
      adjList.set(step.id, []);
    }

    for (const step of steps) {
      for (const dep of step.dependsOn) {
        if (adjList.has(dep)) adjList.get(dep)!.push(step.id);
      }
    }

    const queue: string[] = [];
    for (const [id, deg] of inDegree) {
      if (deg === 0) queue.push(id);
    }

    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node);
      for (const neighbor of adjList.get(node) || []) {
        const newDeg = (inDegree.get(neighbor) || 1) - 1;
        inDegree.set(neighbor, newDeg);
        if (newDeg === 0) queue.push(neighbor);
      }
    }

    return result;
  }

  getReadySteps(steps: WorkflowStep[], completedSteps: string[]): string[] {
    return steps
      .filter(s => !completedSteps.includes(s.id) && s.dependsOn.every(d => completedSteps.includes(d)))
      .map(s => s.id);
  }
}
