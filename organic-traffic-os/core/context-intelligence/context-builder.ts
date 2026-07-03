import { ContextRequest, ContextPackage, ContextSource } from './context.types';
import { rankSources } from './context-ranker';
import { compressSources, removeDuplicates, estimateTokens } from './context-compressor';
import { getWorkspaceContext } from './context-selector';
import { validateContextPackage } from './context-validator';

let counter = 0;

export function buildContext(request: ContextRequest, maxTokens: number = 8000): { pkg: ContextPackage; warnings: string[] } {
  const warnings: string[] = [];
  const sources = getWorkspaceContext(request.workspaceId);

  const ranked = rankSources(sources, request.objective);
  const deduplicated = removeDuplicates(ranked);
  const { compressed, discarded } = compressSources(deduplicated, maxTokens);

  if (discarded > 0) warnings.push(`${discarded} sources discarded due to token limit`);

  const editorial = compressed.filter(s => s.type === 'workspace').map(s => s.data).join('\n');
  const memory = compressed.filter(s => s.type === 'memory').map(s => s.data);
  const entities = compressed.filter(s => s.type === 'knowledge-graph' && s.data.includes('entity')).map(s => s.data.split('|')[0]);
  const clusters = compressed.filter(s => s.type === 'knowledge-graph' && s.data.includes('cluster')).map(s => s.data.split('|')[0]);
  const content = compressed.filter(s => s.type === 'knowledge-core').map(s => s.data.split('|')[0]);
  const faqs = compressed.filter(s => s.type === 'knowledge-graph' && s.data.includes('faq')).map(s => s.data.split('|')[0]);
  const personas = compressed.filter(s => s.type === 'personas').map(s => s.data.split('|')[0]);
  const objectives = compressed.filter(s => s.type === 'objectives').map(s => s.data);
  const sourcesList = compressed.map(s => s.type);

  const estimatedTokens = compressed.reduce((sum, s) => sum + estimateTokens(s.data), 0);

  const pkg: ContextPackage = {
    id: `ctx-${request.workspaceId}-${++counter}`,
    workspaceId: request.workspaceId,
    workflowId: request.workflowId,
    agentId: request.agentId,
    engineId: request.engineId,
    objective: request.objective,
    editorialContext: editorial || 'No editorial context available',
    relevantMemory: memory,
    entities,
    clusters,
    relatedContent: content,
    faqs,
    personas,
    strategy: objectives[0] || 'General strategy',
    sources: sourcesList,
    restrictions: ['No external API calls', 'Workspace isolation enforced'],
    priority: 1,
    estimatedTokens,
    createdAt: new Date().toISOString(),
  };

  const validation = validateContextPackage(pkg);
  if (!validation.valid) warnings.push(...validation.errors);

  return { pkg, warnings };
}
