export class DraftService {
  createDraft(data: any): any {
    return { id: 'mock', ...data };
  }

  getDraft(id: string): any {
    return { id };
  }

  listDrafts(): any[] {
    return [];
  }
}
