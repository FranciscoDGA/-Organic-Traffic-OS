export class MarkdownRenderer {
  public render(content: any) { return `# ${content.titulo}\n\n${content.body}`; }
}