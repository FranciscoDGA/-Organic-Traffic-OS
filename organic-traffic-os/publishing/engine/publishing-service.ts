export class PublishingService {
  publish(data: any): any {
    return { id: 'mock', status: 'published' };
  }

  getPublication(id: string): any {
    return { id };
  }

  listPublications(): any[] {
    return [];
  }

  prepare(data: any): any {
    return { prepared: data };
  }
}
