export class JSONRenderer {
  public render(content: any) { return JSON.stringify(content, null, 2); }
}