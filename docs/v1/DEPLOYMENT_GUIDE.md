# DEPLOYMENT GUIDE — Organic Traffic OS v1.0

## Pré-requisitos

- Conta Vercel ativa com projeto configurado
- Projeto Supabase criado com RLS habilitado
- Chaves de API dos provedores de IA (OpenAI, Anthropic, Gemini)
- Conta Resend (ou SMTP) configurada
- Node.js 20+ instalado localmente

## Deploy na Vercel

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login na conta
vercel login

# 3. Deploy do projeto
vercel --prod
```

## Variáveis de Ambiente Obrigatórias

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_AI_API_KEY=

# Email
RESEND_API_KEY=

# Organic Publisher (por blog)
ORGANIC_PUBLISHER_SECRET=
ORGANIC_ALLOWED_ORIGIN=
REVALIDATE_SECRET=
```

## Verificação Pós-Deploy

1. Acessar `https://seu-dominio.vercel.app/organic-os`
2. Verificar `/api/organic-os/system/health` retorna `{ "overall_status": "healthy" }`
3. Verificar `/api/organic-os/system/readiness` retorna `readiness_score: 100`
4. Abrir Morning Briefing e confirmar dados carregando

## Rollback

Em caso de falha:
```bash
vercel rollback
```
