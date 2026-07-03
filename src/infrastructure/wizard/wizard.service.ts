import { env } from '../../config/env';
import { InfrastructureValidatorService } from '../validator/validator.service';
import { WizardStep, WizardStatus } from './wizard.types';

// In-memory store for manual steps completed
const COMPLETED_MANUAL_KEYS = new Set<string>();

export class InfrastructureWizardService {
  public static async getStatus(): Promise<WizardStatus> {
    const report = await InfrastructureValidatorService.executeAuditory();
    const checkedAt = new Date().toISOString();

    const step1Items = [
      { key: 'ENV_URL', description: 'Definir NEXT_PUBLIC_APP_URL', completed: !!env.APP.NEXT_PUBLIC_APP_URL, mandatory: true },
      { key: 'ENV_ENV', description: 'Definir APP_ENV', completed: !!env.APP.APP_ENV, mandatory: true }
    ];

    const step2Items = [
      { key: 'VERCEL_VARS', description: 'Definir variáveis na Vercel', completed: report.overall_health_score > 40, mandatory: true },
      { key: 'VERCEL_DEPLOY', description: 'Deploy inicial realizado', completed: report.overall_health_score > 30, mandatory: true }
    ];

    const step3Items = [
      { key: 'SUPABASE_CONN', description: 'Conectar ao banco Supabase', completed: !!env.SUPABASE.DATABASE_URL, mandatory: true },
      { key: 'SUPABASE_BUCKETS', description: 'Provisionar buckets de storage', completed: true, mandatory: true }
    ];

    const step4Items = [
      { key: 'GITHUB_CONN', description: 'Conectar repositório GitHub', completed: !!env.GITHUB.GITHUB_TOKEN, mandatory: true },
      { key: 'GITHUB_OWNER', description: 'Definir proprietário do repositório', completed: !!env.GITHUB.GITHUB_OWNER, mandatory: true }
    ];

    const step5Items = [
      { key: 'AI_GEMINI', description: 'Cadastrar GEMINI_API_KEY', completed: !!env.AI_PROVIDERS.GEMINI_API_KEY, mandatory: true },
      { key: 'AI_OPENAI', description: 'Cadastrar OPENAI_API_KEY (opcional)', completed: !!env.AI_PROVIDERS.OPENAI_API_KEY, mandatory: false }
    ];

    const step6Items = [
      { key: 'GOOGLE_OAUTH', description: 'Configurar credenciais OAuth do Google', completed: !!env.GOOGLE.GOOGLE_CLIENT_ID, mandatory: true },
      { key: 'GOOGLE_GSC', description: 'Mapear Search Console Site URL', completed: !!env.GOOGLE.GOOGLE_SEARCH_CONSOLE_SITE_URL, mandatory: true }
    ];

    const step7Items = [
      { key: 'EMAIL_RESEND', description: 'Configurar Resend API Key', completed: !!env.EMAIL.RESEND_API_KEY, mandatory: true },
      { key: 'EMAIL_SMTP', description: 'SMTP config (opcional)', completed: !!env.EMAIL.SMTP_HOST, mandatory: false }
    ];

    const step8Items = [
      { key: 'BRIDGE_PASSACUMARU', description: 'Conectar PassaCumaru', completed: !!env.BLOGS.PASSACUMARU.endpoint, mandatory: true },
      { key: 'BRIDGE_QUALOSEGURO', description: 'Conectar Qual o Seguro', completed: !!env.BLOGS.QUALOSEGURO.endpoint, mandatory: true },
      { key: 'BRIDGE_UTILPRO', description: 'Conectar UtilPro Brasil', completed: !!env.BLOGS.UTILPRO.endpoint, mandatory: true },
      { key: 'BRIDGE_TABUOMETRO', description: 'Conectar Tabuômetro', completed: !!env.BLOGS.TABUOMETRO.endpoint, mandatory: true },
      { key: 'BRIDGE_AIAGENCY', description: 'Conectar AI Agency OS', completed: !!env.BLOGS.AIAGENCY.endpoint, mandatory: true }
    ];

    const step9Items = [
      { key: 'PUB_ENDPOINTS', description: 'Mapear endpoints de preview e approve', completed: true, mandatory: true },
      { key: 'PUB_MANUAL', description: 'Forçar publicação em modo manual por padrão', completed: true, mandatory: true }
    ];

    const step10Items = [
      { key: 'LAUNCH_VERIFY', description: 'Revalidar toda a infraestrutura', completed: report.overall_health_score >= 80, mandatory: true },
      { key: 'LAUNCH_CONFIRM', description: 'Confirmar checklist manual de go-live', completed: COMPLETED_MANUAL_KEYS.has('LAUNCH_CONFIRM'), mandatory: true }
    ];

    // Helpers to verify step completion status
    const evaluateStep = (num: number, title: string, desc: string, platform: string, doc: string, difficulty: 'Fácil' | 'Médio' | 'Difícil', time: number, items: any[]): WizardStep => {
      const allMandatoryCompleted = items.filter(i => i.mandatory).every(i => i.completed || COMPLETED_MANUAL_KEYS.has(i.key));
      return {
        step_number: num,
        title,
        description: desc,
        status: allMandatoryCompleted ? 'completed' : 'pending',
        estimated_time_minutes: time,
        difficulty,
        platform,
        documentation_link: doc,
        items: items.map(i => ({ ...i, completed: i.completed || COMPLETED_MANUAL_KEYS.has(i.key) }))
      };
    };

    const steps: WizardStep[] = [
      evaluateStep(1, 'Ambiente', 'Definição da URL da aplicação e ambiente ativo.', 'Vercel / Local', '/docs/setup/START_HERE.md', 'Fácil', 5, step1Items),
      evaluateStep(2, 'Vercel', 'Vinculação de variáveis de ambiente e deploy da Next.js.', 'Vercel', '/docs/setup/VERCEL_SETUP_GUIDE.md', 'Fácil', 10, step2Items),
      evaluateStep(3, 'Supabase', 'Criação de tabelas, triggers e RLS no Postgres e Storage.', 'Supabase', '/docs/setup/SUPABASE_SETUP_GUIDE.md', 'Médio', 15, step3Items),
      evaluateStep(4, 'GitHub', 'Associação do token com escopo de repositório.', 'GitHub', '/docs/setup/GITHUB_SETUP_GUIDE.md', 'Fácil', 5, step4Items),
      evaluateStep(5, 'IA', 'Configuração das chaves de OpenAI/Gemini.', 'OpenAI / Google AI Studio', '/docs/setup/AI_PROVIDERS_SETUP_GUIDE.md', 'Fácil', 5, step5Items),
      evaluateStep(6, 'Google', 'OAuth 2.0, Analytics 4 e Search Console.', 'Google Cloud Platform', '/docs/setup/GOOGLE_SETUP_GUIDE.md', 'Difícil', 20, step6Items),
      evaluateStep(7, 'E-mail', 'Domínios e registros DNS de e-mail no Resend.', 'Resend / SMTP', '/docs/setup/EMAIL_SETUP_GUIDE.md', 'Médio', 10, step7Items),
      evaluateStep(8, 'Organic Bridge', 'Conexão dos 5 workspaces dos blogs.', 'Vercel / Blogs', '/docs/setup/ORGANIC_BRIDGE_SETUP_GUIDE.md', 'Médio', 15, step8Items),
      evaluateStep(9, 'Publicação', 'Verificação dos modos operacionais manuais.', 'Organic OS', '/ORGANIC_BRIDGE_SETUP.md', 'Fácil', 5, step9Items),
      evaluateStep(10, 'Go-Live', 'Auditoria final do checklist e lançamento em produção.', 'Organic OS', '/docs/setup/PRODUCTION_LAUNCH_CHECKLIST.md', 'Médio', 10, step10Items)
    ];

    const completedCount = steps.filter(s => s.status === 'completed').length;
    const progress = Math.round((completedCount / steps.length) * 100);

    return {
      timestamp: checkedAt,
      overall_progress_percent: progress,
      completed_steps: completedCount,
      pending_steps: steps.length - completedCount,
      critical_blocks: steps.filter(s => s.status === 'blocked').length,
      readiness_scores: {
        infrastructure: report.scores.infrastructure,
        database: report.scores.database,
        storage: report.scores.storage,
        providers: report.scores.security,
        publishing: report.scores.publishing,
        workspaces: report.scores.workspace,
        overall: report.overall_health_score
      },
      steps
    };
  }

  public static completeStepItem(key: string): void {
    COMPLETED_MANUAL_KEYS.add(key);
  }

  public static resetSteps(): void {
    COMPLETED_MANUAL_KEYS.clear();
  }
}
