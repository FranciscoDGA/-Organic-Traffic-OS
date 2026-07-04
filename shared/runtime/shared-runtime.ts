let instance: SharedRuntime | null = null;

export class SharedRuntime {
  private constructor() {}

  static getInstance(): SharedRuntime {
    if (!instance) {
      instance = new SharedRuntime();
    }
    return instance;
  }

  async run(): Promise<any> {
    return { status: 'ok' };
  }
}
