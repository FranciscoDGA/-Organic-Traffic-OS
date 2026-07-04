export class QualityService {
  review(data: any): any {
    return { score: 0, issues: [] };
  }

  getReport(id: string): any {
    return { id };
  }

  listReports(): any[] {
    return [];
  }
}
