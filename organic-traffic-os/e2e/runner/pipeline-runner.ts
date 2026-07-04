export class PipelineRunner {
  async run(params: any): Promise<any> {
    return { status: 'ok', results: [] };
  }

  getHistory(): any[] {
    return [];
  }

  getResult(id: string): any {
    return { id };
  }
}
