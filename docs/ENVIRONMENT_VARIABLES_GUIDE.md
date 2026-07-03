# Guia de Configuração de Variáveis de Ambiente

Este documento descreve como gerenciar e configurar com segurança todas as variáveis de ambiente necessárias para o funcionamento correto do **Organic Traffic OS** nos ambientes de **Desenvolvimento**, **Staging** e **Produção**.

---

## 1. Localização e Arquivos de Exemplo

Criamos os seguintes arquivos modelo no diretório raiz do projeto:

- `.env.example`: Modelo global com todas as chaves e campos vazios.
- `.env.development.example`: Configuração recomendada para o ambiente local de desenvolvimento.
- `.env.staging.example`: Configurações de teste e preparação de staging.
- `.env.production.example`: Variáveis requeridas para o ambiente de produção.

> [!WARNING]
> Nunca salve ou commite o arquivo `.env.local` no GitHub. Ele é automaticamente ignorado pelo `.gitignore`.

---

## 2. Grupos de Variáveis de Ambiente

### A. Variáveis do Organic OS (Painel Central)

#### APP
- `APP_ENV`: Define o ambiente (`development`, `staging`, `production`).
- `NEXT_PUBLIC_APP_URL`: URL base onde a aplicação está rodando.
- `NEXT_PUBLIC_APP_NAME`: Nome de exibição da plataforma.

#### SUPABASE
- `NEXT_PUBLIC_SUPABASE_URL`: Endpoint de conexão com a API do Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave pública para operações no cliente.
- `SUPABASE_SERVICE_ROLE_KEY`: **Mantenha em segredo absoluto**. Usada para bypass de RLS no backend.
- `DATABASE_URL`: String de conexão direta com o banco Postgres do Supabase.

#### AI PROVIDERS
- `OPENAI_API_KEY`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`: Chaves de API para os provedores de inteligência artificial.
- `DEFAULT_AI_PROVIDER`: Provedor principal a ser utilizado (ex: `gemini`).
- `DEFAULT_AI_MODEL`: Modelo principal a ser carregado (ex: `gemini-1.5-pro`).

#### GITHUB & VERCEL (Segredos)
- `GITHUB_TOKEN`: PAT com privilégios para commit.
- `VERCEL_TOKEN`: Token de deploy da Vercel.
- `VERCEL_PROJECT_ID` / `VERCEL_TEAM_ID`: IDs de identificação do projeto.

#### AUTH (Segredos)
- `JWT_SECRET`: Chave de criptografia de tokens JWT.
- `SESSION_SECRET`: Chave para assinar cookies de sessão.

---

### B. Variáveis de Publicação & Blogs (Organic Bridge)

As variáveis abaixo pertencem ao Organic OS, mas guardam os endpoints e as secrets de cada blog de destino. Elas devem ser idênticas às cadastradas individualmente nos blogs.

#### Conexão com os Blogs do Ecossistema:
- `PASSACUMARU_PUBLISH_ENDPOINT` / `PASSACUMARU_PUBLISH_SECRET`
- `QUALOSEGURO_PUBLISH_ENDPOINT` / `QUALOSEGURO_PUBLISH_SECRET`
- `UTILPRO_PUBLISH_ENDPOINT` / `UTILPRO_PUBLISH_SECRET`
- `TABUOMETRO_PUBLISH_ENDPOINT` / `TABUOMETRO_PUBLISH_SECRET`
- `AIAGENCY_PUBLISH_ENDPOINT` / `AIAGENCY_PUBLISH_SECRET`

---

## 3. Matriz de Obrigatoriedade por Ambiente

| Variável | Dev | Staging | Production | Categoria / Nível de Segredo |
|---|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Opcional | **Obrigatória** | **Obrigatória** | Público / Configuração |
| `NEXT_PUBLIC_SUPABASE_URL`| Opcional | **Obrigatória** | **Obrigatória** | Público / Configuração |
| `SUPABASE_SERVICE_ROLE_KEY`| Opcional| **Obrigatória** | **Obrigatória** | **Segredo Absoluto** |
| `JWT_SECRET` / `SESSION_SECRET`| Opcional| **Obrigatória** | **Obrigatória** | **Segredo Absoluto** |
| `OPENAI_API_KEY` / `GEMINI_API_KEY`| Opcional| Opcional | **Obrigatória** | **Segredo Absoluto** |
| `GITHUB_TOKEN` / `VERCEL_TOKEN`| Opcional | Opcional | **Obrigatória** | **Segredo Absoluto** |
| `ORGANIC_BRIDGE_SECRET` | Opcional | **Obrigatória** | **Obrigatória** | **Segredo Absoluto** |
| `*__PUBLISH_SECRET` (Blogs) | Opcional | Opcional | **Obrigatória** | **Segredo Absoluto** |

---

## 4. Onde Configurar no Painel Vercel

1. Acesse o dashboard da [Vercel](https://vercel.com).
2. Selecione o projeto `Organic-Traffic-OS`.
3. Vá na aba **Settings** > **Environment Variables**.
4. Adicione as chaves uma a uma.
   - Para variáveis de segurança (`JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `*__SECRET`, chaves de API), certifique-se de marcar a opção **"Secret"** (esconder o valor no console).
5. Defina a disponibilidade de cada variável marcando as caixas correspondentes aos ambientes desejados (**Production**, **Preview**, **Development**).
