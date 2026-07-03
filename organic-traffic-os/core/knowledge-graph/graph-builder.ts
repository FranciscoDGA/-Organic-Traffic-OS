import { KnowledgeGraph, GraphNode, GraphEdge, GraphStats, NodeType, RelationType } from './graph.types';
import { createNode } from './graph-node';
import { createEdge } from './graph-edge';

function buildStats(nodes: GraphNode[], edges: GraphEdge[]): GraphStats {
  const nodesByType: Record<NodeType, number> = {} as any;
  const edgesByRelation: Record<RelationType, number> = {} as any;
  nodes.forEach(n => { nodesByType[n.type] = (nodesByType[n.type] || 0) + 1; });
  edges.forEach(e => { edgesByRelation[e.relation] = (edgesByRelation[e.relation] || 0) + 1; });
  const connectedNodes = new Set(edges.flatMap(e => [e.source, e.target]));
  const orphans = nodes.filter(n => !connectedNodes.has(n.id)).length;
  return { totalNodes: nodes.length, totalEdges: edges.length, nodesByType, edgesByRelation, orphans };
}

export function buildPassaCumaruGraph(): KnowledgeGraph {
  const ws = 'passacumaru';
  const nodes: GraphNode[] = [
    createNode(ws, 'workspace', 'PassaCumaru', 'Blog de concursos e editais'),
    createNode(ws, 'content', 'Guia Completo de Concursos', 'Artigo principal sobre concursos', { size: 3000 }),
    createNode(ws, 'content', 'Editais de Julho 2026', 'Lista de editais do mes', { size: 2500 }),
    createNode(ws, 'content', 'Como Estudar para Concurso', 'Dicas de estudo', { size: 2000 }),
    createNode(ws, 'category', 'Concursos', 'Categoria principal', { slug: 'concursos' }),
    createNode(ws, 'category', 'Editais', 'Categoria de editais', { slug: 'editais' }),
    createNode(ws, 'category', 'Dicas', 'Categoria de dicas', { slug: 'dicas' }),
    createNode(ws, 'cluster', 'Concursos Municipais', 'Cluster de concursos municipais'),
    createNode(ws, 'cluster', 'Editais Saude', 'Cluster de editais de saude'),
    createNode(ws, 'pillar', 'Guia Completo de Concursos', 'Pagina pilar principal'),
    createNode(ws, 'entity', 'INSS', 'Instituto Nacional do Seguro Social', { importance: 9 }),
    createNode(ws, 'entity', 'Edital', 'Documento oficial', { importance: 10 }),
    createNode(ws, 'entity', 'Banca', 'Organizacao de concurso', { importance: 9 }),
    createNode(ws, 'faq', 'Como me inscrever?', 'FAQ sobre inscricao'),
    createNode(ws, 'faq', 'Quando sera a prova?', 'FAQ sobre data de prova'),
    createNode(ws, 'keyword', 'concurso publico', 'Palavra-chave principal', { volume: 50000 }),
    createNode(ws, 'keyword', 'edital aberto', 'Palavra-chave de edital', { volume: 30000 }),
    createNode(ws, 'persona', 'Concurseiro Iniciante', 'Persona principiante'),
    createNode(ws, 'persona', 'Concurseiro Experiente', 'Persona avancada'),
    createNode(ws, 'objective', 'Aprovacao em concurso', 'Objetivo principal'),
  ];

  const edges: GraphEdge[] = [
    createEdge(ws, nodes[1].id, nodes[3].id, 'PERTENCE_A'),
    createEdge(ws, nodes[2].id, nodes[4].id, 'PERTENCE_A'),
    createEdge(ws, nodes[1].id, nodes[5].id, 'RELACIONADO_A'),
    createEdge(ws, nodes[6].id, nodes[0].id, 'PERTENCE_AO_CLUSTER'),
    createEdge(ws, nodes[1].id, nodes[7].id, 'UTILIZA'),
    createEdge(ws, nodes[1].id, nodes[10].id, 'REFERENCIA'),
    createEdge(ws, nodes[9].id, nodes[8].id, 'RESPONDE'),
    createEdge(ws, nodes[10].id, nodes[11].id, 'RELACIONADO_A'),
    createEdge(ws, nodes[13].id, nodes[14].id, 'DERIVA_DE'),
    createEdge(ws, nodes[15].id, nodes[1].id, 'UTILIZA'),
    createEdge(ws, nodes[16].id, nodes[17].id, 'UTILIZA'),
    createEdge(ws, nodes[1].id, nodes[18].id, 'EXPANDE'),
  ];

  return { workspaceId: ws, nodes, edges, stats: buildStats(nodes, edges), lastUpdated: new Date().toISOString() };
}

export function buildGarimpeiBrasilGraph(): KnowledgeGraph {
  const ws = 'garimpeibrasil';
  const nodes: GraphNode[] = [
    createNode(ws, 'workspace', 'Garimpei Brasil', 'Blog de financas pessoais'),
    createNode(ws, 'content', 'Guia de Investimentos', 'Artigo principal', { size: 2500 }),
    createNode(ws, 'content', 'O que e CDI', 'Explicacao sobre CDI', { size: 1500 }),
    createNode(ws, 'category', 'Investimentos', 'Categoria principal', { slug: 'investimentos' }),
    createNode(ws, 'cluster', 'Renda Fixa', 'Cluster de renda fixa'),
    createNode(ws, 'entity', 'Tesouro Direto', 'Investimento publico', { importance: 9 }),
    createNode(ws, 'entity', 'Selic', 'Taxa basica', { importance: 10 }),
    createNode(ws, 'faq', 'Como investir?', 'FAQ basico'),
    createNode(ws, 'keyword', 'investimento', 'Palavra-chave principal', { volume: 40000 }),
    createNode(ws, 'persona', 'Investidor Iniciante', 'Persona principiante'),
    createNode(ws, 'objective', 'Liberdade financeira', 'Objetivo principal'),
  ];

  const edges: GraphEdge[] = [
    createEdge(ws, nodes[1].id, nodes[3].id, 'PERTENCE_A'),
    createEdge(ws, nodes[4].id, nodes[0].id, 'PERTENCE_AO_CLUSTER'),
    createEdge(ws, nodes[1].id, nodes[5].id, 'REFERENCIA'),
    createEdge(ws, nodes[6].id, nodes[1].id, 'RELACIONADO_A'),
    createEdge(ws, nodes[7].id, nodes[1].id, 'RESPONDE'),
  ];

  return { workspaceId: ws, nodes, edges, stats: buildStats(nodes, edges), lastUpdated: new Date().toISOString() };
}
