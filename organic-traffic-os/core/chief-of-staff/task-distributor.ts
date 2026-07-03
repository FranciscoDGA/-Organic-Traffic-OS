import { PriorityTask } from './chief.types';

export function distributeTasks(tasks: PriorityTask[]): { task: PriorityTask; assignee: string; scheduledTime: string }[] {
  const agents = ['Research Agent', 'Writer Agent', 'Review Agent', 'Publishing Agent', 'Monitoring Agent'];
  const sorted = [...tasks].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.priority] - order[b.priority];
  });

  return sorted.map((task, i) => ({
    task,
    assignee: task.assignedTo || agents[i % agents.length],
    scheduledTime: `${9 + Math.floor(i * 1.5)}:${i % 2 === 0 ? '00' : '30'}`,
  }));
}
