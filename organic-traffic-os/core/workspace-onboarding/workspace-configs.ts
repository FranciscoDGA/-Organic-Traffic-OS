import { WorkspaceConfig, WorkspaceIdentity, EditorialProfile, WorkspacePolicy, PublisherConfig, WorkspaceKPI } from './workspace-onboarding.types';

function baseIdentity(id: string, name: string, domain: string, niche: string, type: WorkspaceConfig['identity']['type'], objective: string, audience: string, monetization: string): WorkspaceIdentity {
  return { id, name, domain, niche, type, status: 'inactive', language: 'pt-BR', country: 'BR', timezone: 'America/Sao_Paulo', objective, targetAudience: audience, monetization, publishMode: 'manual', publisherAdapter: 'organic-bridge', organicBridgeEndpoint: `/api/bridge/${id}`, created_at: '2026-07-03T00:00:00Z', updated_at: '2026-07-03T00:00:00Z' };
}

function baseEditorial(categories: string[], ctas: string[]): EditorialProfile {
  return { voiceTone: 'professional', depthLevel: 'intermediate', defaultArticleSize: '1500-2500', mainCategories: categories, allowedContentTypes: ['artigo', 'review', 'comparativo', 'pilar', 'faq', 'newsletter'], allowedCTAs: ctas, forbiddenThemes: ['conteudo adulto', 'violencia', 'discriminacao'], adSenseRules: ['nao inserir em artigos com menos de 800 palavras', 'max 3 ads por pagina'], seoRules: [' titulo unico', 'meta description', 'alt text em imagens', 'links internos'], aiVisibilityRules: ['estrutura H2/H3 clara', 'dados atualizados', 'fontes confiaveis'] };
}

function basePolicy(maxPerDay: number): WorkspacePolicy {
  return { requireHumanApproval: true, autoPublishEnabled: false, maxPostsPerDay: maxPerDay, preferredPublishDays: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'], preferredPublishTime: '09:00', minWordsPerArticle: 1200, maxWordsPerArticle: 5000, requiredSections: ['introducao', 'desenvolvimento', 'conclusao'] };
}

function basePublisher(domain: string): PublisherConfig {
  return { publish_endpoint: `https://${domain}/api/publish`, preview_endpoint: `https://${domain}/api/preview`, approve_endpoint: `https://${domain}/api/approve`, revalidate_endpoint: `https://${domain}/api/revalidate`, api_secret_reference: `WORKSPACE_${domain.replace(/\./g, '_').toUpperCase()}_SECRET`, allowed_origin: `https://${domain}`, auto_publish_enabled: false, require_human_approval: true, max_posts_per_day: 3, preferred_publish_days: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'], preferred_publish_time: '09:00' };
}

export const workspaceConfigs: Record<string, WorkspaceConfig> = {
  'passacumaru': {
    identity: baseIdentity('passacumaru', 'PassaCumaru', 'passacumaru.com.br', 'concursos publicos municipais', 'blog', 'Autoridade em concursos publicos municipais', 'concurseiros municipais', 'e-books, afiliados'),
    editorialProfile: { ...baseEditorial(['concursos', 'edital', 'preparacao', 'carreiras'], ['e-book', 'curso', 'simulado']), voiceTone: 'didatico', depthLevel: 'deep', defaultArticleSize: '2000-3500' },
    policy: basePolicy(2),
    publisherConfig: basePublisher('passacumaru.com.br'),
    kpis: [
      { id: 'traffic', name: 'Trafego Organico', target: 5000, unit: 'visitas/mes' },
      { id: 'subscriptions', name: 'Assinaturas', target: 200, unit: 'leads' },
      { id: 'ebook_sales', name: 'Vendas de E-books', target: 50, unit: 'vendas/mes' },
      { id: 'downloads', name: 'Downloads', target: 300, unit: 'downloads/mes' },
      { id: 'read_time', name: 'Tempo de Leitura', target: 4, unit: 'min' },
    ],
  },
  'qualoseguro': {
    identity: baseIdentity('qualoseguro', 'Qual o Seguro', 'qualoseguro.com.br', 'seguros e geracao de leads', 'blog', 'Autoridade em seguros e comparativos', 'pessoas buscando seguros', 'leads, afiliados de seguros'),
    editorialProfile: { ...baseEditorial(['seguros', 'comparativos', 'dicas financeiras', 'protecao'], ['formulario', 'comparativo', 'orcamento']), voiceTone: 'confiavel', depthLevel: 'intermediate', defaultArticleSize: '1500-2500' },
    policy: basePolicy(3),
    publisherConfig: basePublisher('qualoseguro.com.br'),
    kpis: [
      { id: 'leads', name: 'Leads', target: 500, unit: 'leads/mes' },
      { id: 'forms', name: 'Formularios Enviados', target: 300, unit: 'formularios/mes' },
      { id: 'cta_clicks', name: 'Cliques em CTA', target: 1000, unit: 'cliques/mes' },
      { id: 'traffic', name: 'Trafego Organico', target: 8000, unit: 'visitas/mes' },
      { id: 'conversions', name: 'Conversoes', target: 100, unit: 'conversoes/mes' },
    ],
  },
  'utilprobrasil': {
    identity: baseIdentity('utilprobrasil', 'UtilPro Brasil', 'utilprobrasil.com.br', 'reviews, comparativos, utilidades e afiliados', 'blog', 'Autoridade em reviews e comparativos de ferramentas', 'profissionais e empresas', 'afiliados, comissao'),
    editorialProfile: { ...baseEditorial(['reviews', 'comparativos', 'ferramentas', 'produtividade', 'tecnologia'], ['afiliado', 'review', 'comparativo']), voiceTone: 'tecnico', depthLevel: 'deep', defaultArticleSize: '2000-4000' },
    policy: basePolicy(3),
    publisherConfig: basePublisher('utilprobrasil.com.br'),
    kpis: [
      { id: 'affiliate_clicks', name: 'Cliques em Afiliados', target: 2000, unit: 'cliques/mes' },
      { id: 'reviews', name: 'Reviews Publicados', target: 20, unit: 'reviews/mes' },
      { id: 'traffic', name: 'Trafego Organico', target: 10000, unit: 'visitas/mes' },
      { id: 'revenue', name: 'Receita Estimada', target: 2000, unit: 'BRL/mes' },
      { id: 'ctr', name: 'CTR', target: 3.5, unit: '%' },
    ],
  },
  'tabuometro': {
    identity: baseIdentity('tabuometro', 'Tabuometro', 'tabuometro.vercel.app', 'portal editorial', 'news', 'Portal editorial de conteudo relevante', 'publico geral', 'publicidade, afiliados'),
    editorialProfile: { ...baseEditorial(['editorial', 'opiniao', 'analise', 'tendencias'], ['banner', 'afiliado', 'newsletter']), voiceTone: 'editorial', depthLevel: 'moderate', defaultArticleSize: '1200-2000' },
    policy: basePolicy(4),
    publisherConfig: basePublisher('tabuometro.vercel.app'),
    kpis: [
      { id: 'returning', name: 'Visitas Recorrentes', target: 3000, unit: 'visitas/mes' },
      { id: 'engagement', name: 'Engajamento', target: 60, unit: '%' },
      { id: 'read_time', name: 'Tempo de Permanencia', target: 3.5, unit: 'min' },
      { id: 'shares', name: 'Compartilhamentos', target: 500, unit: 'shares/mes' },
      { id: 'growth', name: 'Crescimento Editorial', target: 15, unit: 'artigos/mes' },
    ],
  },
  'aiagencyos': {
    identity: baseIdentity('aiagencyos', 'AI Agency OS', 'aiagencyos.com', 'autoridade, conhecimento e geracao de leads para servicos de IA', 'agency', 'Autoridade em servicos de IA e automacao', 'empresas e empreendedores', 'leads, servicos de consultoria'),
    editorialProfile: { ...baseEditorial(['inteligencia artificial', 'automacao', 'agentes', 'consultoria', 'cases'], ['contato', 'reuniao', 'proposta']), voiceTone: 'expert', depthLevel: 'deep', defaultArticleSize: '2000-3500' },
    policy: basePolicy(2),
    publisherConfig: basePublisher('aiagencyos.com'),
    kpis: [
      { id: 'leads', name: 'Leads', target: 100, unit: 'leads/mes' },
      { id: 'meetings', name: 'Reunioes Agendadas', target: 20, unit: 'reunioes/mes' },
      { id: 'proposals', name: 'Propostas Solicitadas', target: 15, unit: 'propostas/mes' },
      { id: 'knowledge_traffic', name: 'Trafego Conhecimento', target: 3000, unit: 'visitas/mes' },
      { id: 'content_conversions', name: 'Conversoes por Conteudo', target: 8, unit: 'conversoes/mes' },
    ],
  },
};
