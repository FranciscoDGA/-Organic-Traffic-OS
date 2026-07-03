export class DraftWriterEngine {
  public prepareContext(briefId: string, blueprintId: string, researchId: string) {
    return { context_ready: true };
  }
  public sendToAIProvider(context: any) {
    return { text: "Este é o rascunho base gerado pela IA...", tokens_in: 1500, tokens_out: 800 };
  }
  public generateDraft(context: any) {
    const aiResponse = this.sendToAIProvider(context);
    return { id: "draft-id", status: "created", ...aiResponse };
  }
}
