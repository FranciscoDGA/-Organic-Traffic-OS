export class ResearchService {
  create(data: any): any {
    return { id: 'mock', ...data };
  }

  getPack(id: string): any {
    return { id };
  }

  listPacks(): any[] {
    return [];
  }
}
