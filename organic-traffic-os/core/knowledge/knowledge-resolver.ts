import { KnowledgeContext } from './knowledge-context';
export interface KnowledgeResolver { resolveEntity(name: string, ctx: KnowledgeContext): any; }