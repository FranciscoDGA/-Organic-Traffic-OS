# Sprint CONFIG-01 — Production Environment Variables

Esta Sprint estabelece a estrutura profissional e os validadores necessários para as variáveis de ambiente nos diferentes ambientes (Development, Staging, Production).

---

## 1. Arquivos Criados

- **`.env.example`** ([.env.example](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/.env.example)): Exemplo global em branco agrupando todas as variáveis por contexto.
- **`.env.development.example`** ([.env.development.example](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/.env.development.example)): Padrões locais de desenvolvimento e mocks úteis.
- **`.env.staging.example`** ([.env.staging.example](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/.env.staging.example)): Configurações de pré-produção.
- **`.env.production.example`** ([.env.production.example](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/.env.production.example)): Estrutura real esperada no servidor de produção.
- **`src/config/env.ts`** ([env.ts](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/src/config/env.ts)): Carregador de variáveis fortemente tipado.
- **`src/config/env-validator.ts`** ([env-validator.ts](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/src/config/env-validator.ts)): Validador de variáveis obrigatórias dependente do ambiente.
- **`docs/ENVIRONMENT_VARIABLES_GUIDE.md`** ([ENVIRONMENT_VARIABLES_GUIDE.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/docs/ENVIRONMENT_VARIABLES_GUIDE.md)): Guia detalhado explicativo.

---

## 2. Lógica de Validação (env-validator.ts)

A função `validateEnv(environment)` implementa as seguintes regras:

1. **Development**:
   - Permite variáveis vazias e chaves simuladas para evitar impedimentos no setup local.
2. **Staging**:
   - Exige Supabase completo (URL, Anon Key, Service Role Key, Database URL).
   - Exige URL da aplicação (`NEXT_PUBLIC_APP_URL`) que não contenha `localhost`.
   - Exige segredos do editor e revalidação (`PUBLISH_SECRET`, `ORGANIC_BRIDGE_SECRET`, `REVALIDATE_SECRET`).
   - Bloqueia chaves de segurança JWT/Session padrão.
3. **Production**:
   - Todas as regras do Staging.
   - Exige pelo menos uma chave de provedor de IA ativa (OpenAI ou Gemini/Google).
   - Exige GITHUB_TOKEN e VERCEL_TOKEN.
   - Exige credenciais de envio de e-mail (Resend ou SMTP).
   - Exige chaves e caminhos dos blogs do ecossistema.

---

## 3. Verificação de Compilação
A build (`npm run build`) foi testada e finalizada com sucesso, confirmando que os arquivos criados e suas tipagens não possuem conflitos com o Next.js ou TypeScript.
