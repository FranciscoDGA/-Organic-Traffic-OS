let instance: SharedAgentDispatcher | null = null;

export class SharedAgentDispatcher {
  private constructor() {}

  static getInstance(): SharedAgentDispatcher {
    if (!instance) {
      instance = new SharedAgentDispatcher();
    }
    return instance;
  }

  async dispatch(): Promise<any> {
    return { status: 'ok' };
  }
}
