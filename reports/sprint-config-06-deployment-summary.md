# Sprint CONFIG-06 — Deployment & Setup Guides

Esta Sprint consolida toda a documentação estrutural necessária para o deploy manual e go-live seguro do Organic Traffic OS.

---

## 1. O Que Foi Criado

### Manuais de Instalação e Configuração (docs/setup/)
- **`START_HERE.md`** ([START_HERE.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/docs/setup/START_HERE.md)): Ordem recomendada de setup e mitigação de riscos de segurança.
- **`VERCEL_SETUP_GUIDE.md`** ([VERCEL_SETUP_GUIDE.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/docs/setup/VERCEL_SETUP_GUIDE.md)): Deploy de ambientes de preview e production na Vercel.
- **`SUPABASE_SETUP_GUIDE.md`** ([SUPABASE_SETUP_GUIDE.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/docs/setup/SUPABASE_SETUP_GUIDE.md)): Provisionamento de Postgres relacional, RLS e buckets de storage.
- **`GITHUB_SETUP_GUIDE.md`** ([GITHUB_SETUP_GUIDE.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/docs/setup/GITHUB_SETUP_GUIDE.md)): Criação de Personal Access Tokens (PAT) clássicos ou fine-grained.
- **`GOOGLE_SETUP_GUIDE.md`** ([GOOGLE_SETUP_GUIDE.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/docs/setup/GOOGLE_SETUP_GUIDE.md)): Configuração do Google Cloud Project, consent screen do OAuth e propriedades de GSC/GA4.
- **`AI_PROVIDERS_SETUP_GUIDE.md`** ([AI_PROVIDERS_SETUP_GUIDE.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/docs/setup/AI_PROVIDERS_SETUP_GUIDE.md)): Configuração de limites e orçamentos para OpenAI, Claude e Gemini.
- **`EMAIL_SETUP_GUIDE.md`** ([EMAIL_SETUP_GUIDE.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/docs/setup/EMAIL_SETUP_GUIDE.md)): Registros DNS de e-mail (SPF/DKIM/DMARC) no Resend.
- **`ORGANIC_BRIDGE_SETUP_GUIDE.md`** ([ORGANIC_BRIDGE_SETUP_GUIDE.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/docs/setup/ORGANIC_BRIDGE_SETUP_GUIDE.md)): Relação de chaves e testes via `curl` da Organic Bridge dos blogs.
- **`ENVIRONMENT_VARIABLES_CHECKLIST.md`** ([ENVIRONMENT_VARIABLES_CHECKLIST.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/docs/setup/ENVIRONMENT_VARIABLES_CHECKLIST.md)): Tabela resumo com chaves obrigatórias.
- **`PRODUCTION_LAUNCH_CHECKLIST.md`** ([PRODUCTION_LAUNCH_CHECKLIST.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/docs/setup/PRODUCTION_LAUNCH_CHECKLIST.md)): Checklist final de go-live.

---

## 2. Testes de Compilação
O projeto foi submetido a uma nova compilação local Next.js e confirmou compilação correta, indicando integridade total do sistema.
