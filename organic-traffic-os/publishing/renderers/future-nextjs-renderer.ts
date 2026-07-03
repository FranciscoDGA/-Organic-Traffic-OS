export class NextJSRenderer {
  public render(content: any) { return `export default function Page() { return <article>${content.titulo}</article>; }`; }
}