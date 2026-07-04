export class SourceService {
  getSources(): any[] {
    return [];
  }

  getSource(id: string): any {
    return { id };
  }

  createSource(data: any): any {
    return { id: 'mock', ...data };
  }
}
