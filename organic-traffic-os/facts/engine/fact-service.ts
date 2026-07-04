export class FactService {
  register(data: any): any {
    return { id: 'mock', ...data };
  }

  getFact(id: string): any {
    return { id };
  }

  listFacts(): any[] {
    return [];
  }
}
