import { KnowledgeContext } from './knowledge-context';
export interface KnowledgeProvider {
  id: string;
  name: string;
  version: string;
  load(source: string): Promise<void>;
  validate(data: any): boolean;
  resolve(query: string, ctx: KnowledgeContext): Promise<any>;
}
