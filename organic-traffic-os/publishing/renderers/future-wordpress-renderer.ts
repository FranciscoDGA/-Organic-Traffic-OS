export class WordPressRenderer {
  public render(content: any) { return { title: content.titulo, content: content.body, status: "draft" }; }
}