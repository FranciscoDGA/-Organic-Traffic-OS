export class StrategyService {
  create(data: any): any {
    return { id: 'mock', ...data };
  }

  getStrategy(id: string): any {
    return { id };
  }

  listStrategies(): any[] {
    return [];
  }
}
