let instance: any = null;

export function getRuntimeService(): any {
  if (!instance) {
    instance = {
      getJobs(): any[] {
        return [];
      },
      getWorkers(): any[] {
        return [];
      },
      getQueues(): any[] {
        return [];
      },
      getWorkflows(): any[] {
        return [];
      },
    };
  }
  return instance;
}
