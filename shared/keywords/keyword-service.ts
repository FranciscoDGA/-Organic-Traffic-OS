import { KeywordLoader } from './keyword-loader';

export class KeywordService {
  private blogId: string;
  private data: any;

  constructor(blogId: string) {
    this.blogId = blogId;
    this.data = KeywordLoader.load(blogId);
  }

  buscarKeyword(keywordStr: string) {
    return this.data.keywords.find((k: any) => k.keyword === keywordStr) || null;
  }

  buscarCluster(clusterId: string) {
    return this.data.clusters.find((c: any) => c.id === clusterId) || null;
  }

  buscarEntidade(entidadeId: string) {
    return this.data.entities.find((e: any) => e.id === entidadeId) || null;
  }

  buscarPerguntas(keywordStr: string) {
    return this.data.questions.filter((q: any) => q.keyword_relacionada === keywordStr);
  }

  buscarOportunidades() {
    return this.data.opportunities;
  }
}
