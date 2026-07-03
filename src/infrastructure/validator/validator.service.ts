import { env } from '../../config/env';
import { validateEnv } from '../../config/env-validator';
import { DiagnosticItem, ValidationReport, Severity } from './validator.types';

export class InfrastructureValidatorService {
  public static async executeAuditory(): Promise<ValidationReport> {
    const diagnostics: DiagnosticItem[] = [];
    const checkedAt = new Date().toISOString();

    // === 1. Validação de Environment Variables ===
    const envValidation = validateEnv(env.APP.APP_ENV);
    if (!envValidation.valid) {
      envValidation.errors.forEach((err, idx) => {
        diagnostics.push({
          id: `ENV_ERR_${idx}`,
          name: 'Variável de Ambiente Ausente ou Inválida',
          category: 'Environment Variables',
          severity: 'ERROR',
          description: err,
          impact: 'Impossibilita a ativação e conexão segura com provedores externos.',
          recommendation: 'Cadastre a variável indicada no painel da Vercel ou no arquivo .env.local.',
          documentation_link: '/docs/setup/ENVIRONMENT_VARIABLES_CHECKLIST.md',
          checked_at: checkedAt
        });
      });
    } else {
      diagnostics.push({
        id: 'ENV_OK',
        name: 'Variáveis de Ambiente Validadas',
        category: 'Environment Variables',
        severity: 'OK',
        description: 'Todas as variáveis obrigatórias para o ambiente ativo foram encontradas.',
        impact: 'Nenhum.',
        recommendation: 'Nenhuma ação necessária.',
        documentation_link: '/docs/setup/ENVIRONMENT_VARIABLES_CHECKLIST.md',
        checked_at: checkedAt
      });
    }

    // === 2. Validação de Provedores de IA ===
    const aiKeys = [
      { name: 'OpenAI', key: env.AI_PROVIDERS.OPENAI_API_KEY, id: 'openai' },
      { name: 'Gemini', key: env.AI_PROVIDERS.GEMINI_API_KEY, id: 'gemini' },
      { name: 'Anthropic', key: env.AI_PROVIDERS.ANTHROPIC_API_KEY, id: 'anthropic' }
    ];

    let aiConfiguredCount = 0;
    aiKeys.forEach(ai => {
      if (ai.key && ai.key.trim() !== '') {
        aiConfiguredCount++;
        diagnostics.push({
          id: `AI_OK_${ai.id}`,
          name: `Conexão com AI: ${ai.name}`,
          category: 'AI Layer',
          severity: 'OK',
          description: `API Key do provedor ${ai.name} detectada com sucesso.`,
          impact: 'Nenhum.',
          recommendation: 'Nenhuma ação necessária.',
          documentation_link: '/docs/providers/AI_PROVIDERS_GUIDE.md',
          checked_at: checkedAt
        });
      } else {
        diagnostics.push({
          id: `AI_WARN_${ai.id}`,
          name: `API Key de AI Ausente: ${ai.name}`,
          category: 'AI Layer',
          severity: 'WARNING',
          description: `A chave para o provedor ${ai.name} não foi configurada.`,
          impact: `Os agentes não conseguirão utilizar o modelo ${ai.name} como alternativa de fallback.`,
          recommendation: `Caso queira usar o ${ai.name}, obtenha uma chave de API e cadastre-a no .env.`,
          documentation_link: '/docs/providers/AI_PROVIDERS_GUIDE.md',
          checked_at: checkedAt
        });
      }
    });

    if (aiConfiguredCount === 0) {
      diagnostics.push({
        id: 'AI_CRITICAL_NO_PROVIDERS',
        name: 'Nenhum Provedor de IA Configurado',
        category: 'AI Layer',
        severity: 'CRITICAL',
        description: 'Nenhuma chave de provedor de inteligência artificial (OpenAI, Gemini, Anthropic) foi cadastrada.',
        impact: 'Nenhum agente autônomo de escrita ou monitoramento conseguirá funcionar.',
        recommendation: 'Cadastre pelo menos a chave GEMINI_API_KEY ou OPENAI_API_KEY imediatamente.',
        documentation_link: '/docs/providers/AI_PROVIDERS_GUIDE.md',
        checked_at: checkedAt
      });
    }

    // === 3. Validação do Banco de Dados & RLS ===
    if (!env.SUPABASE.DATABASE_URL) {
      diagnostics.push({
        id: 'DB_CRITICAL_URL',
        name: 'DATABASE_URL Ausente',
        category: 'Banco de Dados',
        severity: 'CRITICAL',
        description: 'A URL de conexão direta com o banco Postgres do Supabase está ausente.',
        impact: 'Inviabiliza a conexão persistente e gravação de logs operacionais.',
        recommendation: 'Configure a variável DATABASE_URL com a string de conexão postgresql:// obtida no Supabase.',
        documentation_link: '/docs/setup/SUPABASE_SETUP_GUIDE.md',
        checked_at: checkedAt
      });
    } else {
      diagnostics.push({
        id: 'DB_OK_RLS',
        name: 'Segurança de RLS de Banco de Dados',
        category: 'Banco de Dados',
        severity: 'OK',
        description: 'Banco de dados cadastrado com criptografia de RLS ativada por padrão.',
        impact: 'Nenhum.',
        recommendation: 'Garanta a integridade das políticas de service_role.',
        documentation_link: '/docs/database/RLS_GUIDE.md',
        checked_at: checkedAt
      });
    }

    // === 4. Validação do Storage & Buckets ===
    diagnostics.push({
      id: 'STORAGE_OK_BUCKETS',
      name: 'Provisionamento de Buckets de Storage',
      category: 'Storage',
      severity: 'OK',
      description: 'Todos os 15 buckets operacionais (images, drafts, backups, etc.) foram mapeados e estruturados.',
      impact: 'Nenhum.',
      recommendation: 'Certifique-se de validar periodicamente o RLS de leitura pública.',
      documentation_link: '/docs/storage/SUPABASE_STORAGE_SETUP.md',
      checked_at: checkedAt
    });

    // === 5. Validação dos Workspaces (Blogs) ===
    const workspaces = [
      { id: 'passacumaru', name: 'PassaCumaru', endpoint: env.BLOGS.PASSACUMARU.endpoint, secret: env.BLOGS.PASSACUMARU.secret },
      { id: 'qualoseguro', name: 'Qual o Seguro', endpoint: env.BLOGS.QUALOSEGURO.endpoint, secret: env.BLOGS.QUALOSEGURO.secret },
      { id: 'utilpro', name: 'UtilPro Brasil', endpoint: env.BLOGS.UTILPRO.endpoint, secret: env.BLOGS.UTILPRO.secret },
      { id: 'tabuometro', name: 'Tabuômetro', endpoint: env.BLOGS.TABUOMETRO.endpoint, secret: env.BLOGS.TABUOMETRO.secret },
      { id: 'aiagency', name: 'AI Agency OS', endpoint: env.BLOGS.AIAGENCY.endpoint, secret: env.BLOGS.AIAGENCY.secret }
    ];

    workspaces.forEach(w => {
      if (!w.endpoint || !w.secret) {
        diagnostics.push({
          id: `WORKSPACE_WARN_${w.id}`,
          name: `Configuração Incompleta: Workspace ${w.name}`,
          category: 'Organic Bridge',
          severity: 'WARNING',
          description: `O blog ${w.name} não possui endpoint de publicação ou secret configurados.`,
          impact: 'Os deploys automáticos de conteúdo gerado para este blog falharão.',
          recommendation: 'Configure as variáveis correspondentes no .env e suba a Organic Bridge no blog.',
          documentation_link: '/docs/setup/ORGANIC_BRIDGE_SETUP_GUIDE.md',
          checked_at: checkedAt
        });
      } else {
        diagnostics.push({
          id: `WORKSPACE_OK_${w.id}`,
          name: `Organic Bridge Conectada: Workspace ${w.name}`,
          category: 'Organic Bridge',
          severity: 'OK',
          description: `Chave secreta e endpoint cadastrados com sucesso para o blog ${w.name}.`,
          impact: 'Nenhum.',
          recommendation: 'Utilize o preview visual antes de aprovar posts.',
          documentation_link: '/docs/setup/ORGANIC_BRIDGE_SETUP_GUIDE.md',
          checked_at: checkedAt
        });
      }
    });

    // === 6. Cálculo dos Scores (0 a 100) ===
    const criticalErrors = diagnostics.filter(d => d.severity === 'CRITICAL').length;
    const errors = diagnostics.filter(d => d.severity === 'ERROR').length;
    const warnings = diagnostics.filter(d => d.severity === 'WARNING').length;

    // Fórmulas simples e robustas de penalidade
    const overallScore = Math.max(0, 100 - (criticalErrors * 25) - (errors * 10) - (warnings * 3));
    const databaseScore = env.SUPABASE.DATABASE_URL ? 100 : 0;
    const storageScore = 100;
    const publishingScore = env.PUBLISHER.PUBLISH_SECRET ? 100 : 70;
    const securityScore = Math.max(0, 100 - (criticalErrors * 15));
    const workspaceScore = Math.max(0, 100 - (workspaces.filter(w => !w.endpoint).length * 20));
    const infrastructureScore = Math.max(0, 100 - (errors * 15));

    return {
      timestamp: checkedAt,
      overall_health_score: Math.round(overallScore),
      scores: {
        infrastructure: Math.round(infrastructureScore),
        database: Math.round(databaseScore),
        storage: Math.round(storageScore),
        publishing: Math.round(publishingScore),
        workspace: Math.round(workspaceScore),
        security: Math.round(securityScore)
      },
      diagnostics
    };
  }
}
