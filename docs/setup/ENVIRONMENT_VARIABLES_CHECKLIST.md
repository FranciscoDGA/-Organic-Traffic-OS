# Environment Variables Checklist

Abaixo está a matriz de chaves a serem cadastradas no ambiente de Produção:

| Nome da Variável | Local de Configuração | Nível | Obrigatória? | Exemplo Seguro | Descrição |
|---|---|---|---|---|---|
| `APP_ENV` | Vercel | Production | **Sim** | `production` | Ambiente de execução principal |
| `NEXT_PUBLIC_APP_URL` | Vercel | Production | **Sim** | `https://app.organic-os.com` | URL do painel central |
| `DATABASE_URL` | Vercel | Production | **Sim** | `postgresql://postgres:...` | Conexão com banco Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel | Production | **Sim** | `eyJhbGciOi...` | Chave de bypass de RLS (segredo) |
| `GEMINI_API_KEY` | Vercel | Production | **Sim** | `AIzaSy...` | Chave de acesso aos modelos Gemini |
| `GITHUB_TOKEN` | Vercel | Production | **Sim** | `ghp_...` | Token para commit no repositório |
| `VERCEL_TOKEN` | Vercel | Production | **Sim** | `vcl_...` | Token de deploy Vercel |
| `ORGANIC_BRIDGE_SECRET` | Vercel | Production | **Sim** | `bridge_...` | Chave compartilhada com blogs |
| `RESEND_API_KEY` | Vercel | Production | **Sim** | `re_...` | API Key para envio de e-mails |
