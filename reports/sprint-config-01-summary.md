# Sprint CONFIG-01 — Production Secrets, Supabase Tables & External Connectors

Este relatório estabelece as bases de configuração, banco de dados e segredos externos necessários para que o **OpenCode** ou o time de desenvolvimento preparem o ambiente de produção do Organic Traffic OS.

---

## 1. Environment Variables (.env.example)

Todas as variáveis foram mapeadas e organizadas no arquivo [.env.example](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/.env.example). Elas estão divididas em:

- **App & Environment**: Definições básicas de ambiente e URL base.
- **Database & Supabase**: Conexões diretas e chaves de segurança do Supabase.
- **Artificial Intelligence**: Chaves de API para OpenAI, Gemini e Anthropic, além da definição de provedor/modelo padrão.
- **Third Party Platforms**: Integrações com GitHub e Vercel.
- **Secrets & Security**: Secrets internas para comunicação de microsserviços (Publishing, Organic Bridge, JWT, Session).
- **Google Integration**: IDs do OAuth 2.0, GA4 Property ID e site inicial do Search Console.
- **Email Delivery**: SMTP e Resend API Key.
- **Organic Bridge**: Endpoints individuais e senhas para cada um dos blogs do ecossistema.

---

## 2. Supabase Tables & Storage Buckets

Criamos a migração inicial em [20260703000000_schema.sql](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/supabase/migrations/20260703000000_schema.sql) com a seguinte estrutura:

### Tabelas Principais (23 tabelas)
1. **users**: Cadastro central de operadores da plataforma.
2. **roles**: Cargos (ex: Admin, Writer, Editor, CEO).
3. **permissions**: Controle granular de acesso.
4. **user_roles**: Tabela pivô de usuários e papéis.
5. **role_permissions**: Tabela pivô de papéis e permissões.
6. **workspaces**: Isolamento dos domínios (ex: PassaCumaru, QualOSeguro).
7. **workspace_settings**: Configurações específicas por domínio.
8. **agents**: Instâncias ativas dos agentes autônomos.
9. **agent_registry**: Cadastro de manifesto e versão dos agentes.
10. **missions**: Objetivos e planos de execução (Mission Control).
11. **mission_history**: Histórico completo de estados da missão.
12. **content**: Cadastro de conteúdos produzidos (slug, tags SEO, schema).
13. **content_versions**: Histórico de revisões em HTML e Markdown + checksum.
14. **publisher_queue**: Fila assíncrona de publicação.
15. **publishing_history**: Logs de sucesso/erro de postagem externa.
16. **memory_records**: Cache chave-valor com expiração.
17. **knowledge_nodes**: Grafo de conhecimento de entidades e relacionamentos.
18. **playbooks**: Procedimentos padrão para os robôs.
19. **playbook_versions**: Passos detalhados e revisões de playbooks.
20. **events**: Barramento de eventos interno (Event Bus).
21. **runtime_jobs**: Fila de execução de tarefas assíncronas do worker.
22. **worker_sessions**: Heartbeat das sessões de agentes ativos.
23. **audit_logs**: Registro imutável de ações e IPs para segurança.
24. **api_keys**: Chaves de API para conexão externa (Workspace API).
25. **system_settings**: Parâmetros globais do sistema.

### Storage Buckets (9 buckets)
- **articles** (privado): Artigos finalizados gerados pelo Writer.
- **drafts** (privado): Rascunhos intermediários e relatórios de revisão.
- **images** (público): Imagens geradas e imagens enviadas via upload.
- **reports** (privado): Relatórios de auditoria, SEO e performance.
- **playbooks** (privado): Procedimentos operacionais exportados.
- **logs** (privado): Arquivos brutos de logs do Runtime/Worker.
- **backups** (privado): Snapshots e backups periódicos do banco.
- **exports** (privado): Pacotes de publicação gerados para exportação manual.
- **workspace-assets** (privado): Arquivos de contexto e identidade visual de cada workspace.

---

## 3. Checklist de Chaves Externas & Vercel

### Variáveis Vercel Obrigatórias
```env
NEXT_PUBLIC_APP_URL=https://seu-app-no-ar.vercel.app
APP_ENV=production
DATABASE_URL=postgres://postgres:...@db.supabase.co:5432/postgres
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=... # Gerar com: openssl rand -base64 32
SESSION_SECRET=...
PUBLISH_SECRET=...
ORGANIC_BRIDGE_SECRET=...
```

### GitHub Token Checklist
- O token deve ser criado como **Fine-grained Personal Access Token (PAT)** ou classic token.
- Repositório conectado: `FranciscoDGA/-Organic-Traffic-OS`
- Permissões obrigatórias:
  - `Contents` (Read & Write) para ler repositório e commitar arquivos ou atualizações de código.
  - `Metadata` (Read-only) obrigatório para repositórios públicos/privados.
  - `Webhooks` (Read & Write) se for configurar status de deploy em produção.

---

## 4. Guia de Configuração Google (GSC + GA4 + OAuth)

### Passo 1: Google Cloud Console
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie ou selecione um projeto.
3. Vá em **APIs & Services** > **Library** e ative:
   - *Google Search Console API*
   - *Google Analytics Data API (v1beta)*
4. Vá em **OAuth consent screen**:
   - Escolha o tipo (User Type: External).
   - Preencha o nome do app e email de suporte.
   - Adicione os scopes: `.../auth/webmasters.readonly` e `.../auth/analytics.readonly`.
5. Vá em **Credentials** > **Create Credentials** > **OAuth client ID**:
   - Application Type: *Web Application*.
   - Authorized JavaScript origins: `http://localhost:3000` (desenvolvimento) e `https://seu-app.vercel.app` (produção).
   - Authorized redirect URIs: `http://localhost:3000/api/organic-os/connectors/google-search-console/callback` e `https://seu-app.vercel.app/api/organic-os/connectors/google-search-console/callback`.
6. Copie o `Client ID` e o `Client Secret` para suas variáveis de ambiente.

---

## 5. Guia de Organic Bridge por Blog

Hoje, os blogs (WordPress, Next.js, etc.) não possuem uma "porta de entrada" padrão para receber postagens automáticas. A arquitetura **Organic Bridge** resolve isso expondo 4 rotas padrão em cada blog externo.

### Estrutura de Endpoints do Blog Externo
Cada blog deve expor em sua API:
- `POST /api/organic-publisher/publish`: Recebe o payload do `PublicationPackage` (HTML, Metadata, Schema) e cria um rascunho ou post.
- `POST /api/organic-publisher/approve`: Aprova e publica oficialmente o post no CMS.
- `GET /api/organic-publisher/status`: Retorna o status de um conteúdo (se está rascunho, publicado, ou falhou).
- `POST /api/revalidate`: Limpa o cache estático do post recém-publicado (ISR).

### Secrets Obrigatórias a serem adicionadas na Vercel (ou Hospedagem) de cada Blog
Cada blog individual deve configurar as seguintes variáveis no painel dele:
```env
ORGANIC_PUBLISHER_SECRET="sua_chave_secreta_super_segura" # Identifica que a requisição partiu do Organic OS
ORGANIC_ALLOWED_WORKSPACE="slug_do_workspace_no_organic_os" # Apenas este workspace pode publicar aqui
ORGANIC_ALLOWED_ORIGIN="https://seu-organic-os.vercel.app" # CORS e validação de origem
REVALIDATE_SECRET="sua_chave_de_revalidacao"
```

No **Organic OS**, preenchemos as URLs e secrets correspondentes nas variáveis correspondentes a cada blog (ex: `PASSACUMARU_PUBLISH_ENDPOINT`, `PASSACUMARU_PUBLISH_SECRET`, etc.).
