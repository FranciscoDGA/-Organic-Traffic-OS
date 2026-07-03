export class HTMLRenderer {
  public render(content: any) { return `<article><h1>${content.titulo}</h1><div>${content.body}</div></article>`; }
}