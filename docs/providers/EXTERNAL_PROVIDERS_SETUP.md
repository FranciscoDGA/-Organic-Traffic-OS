# External Providers Setup Guide

Esta pasta contém manuais completos ensinando como obter, configurar e validar chaves de API para os provedores do Organic Traffic OS.

---

## 1. Categorias de Provedores

A plataforma organiza suas integrações em 5 pilares estratégicos:

### AI (Modelos de Linguagem)
- **OpenAI**: Geração avançada de textos (GPT-4o).
- **Google Gemini**: Geração de artigos longos com contexto amplo (Gemini 1.5 Pro).
- **Anthropic**: Revisão técnica e alinhamento de personas (Claude 3.5 Sonnet).
- *Guia de Configuração*: [AI_PROVIDERS_GUIDE.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/docs/providers/AI_PROVIDERS_GUIDE.md)

### Infraestrutura (Deploys e Código)
- **Supabase**: Banco Postgres relacional e Storage.
- **GitHub**: Controle de versão e automações de código.
- **Vercel**: Deploy em nuvem das páginas estáticas e painel central.
- *Guia de Configuração*: [GITHUB_VERCEL_SETUP.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/docs/providers/GITHUB_VERCEL_SETUP.md)

### Analytics (Métricas e Performance)
- **Google Search Console**: Cliques reais e posições médias das palavras-chave.
- **Google Analytics 4**: Comportamento, engajamento e conversões nas páginas.
- *Guia de Configuração*: [GOOGLE_SETUP_GUIDE.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/docs/providers/GOOGLE_SETUP_GUIDE.md)

### Comunicação (Notificações)
- **Resend**: Envio rápido e otimizado de relatórios e newsletters.
- **SMTP**: Servidor genérico de e-mail como fallback de envios.
- *Guia de Configuração*: [EMAIL_PROVIDER_GUIDE.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/docs/providers/EMAIL_PROVIDER_GUIDE.md)

### Publishing (Integração de Conteúdo)
- **Organic Bridge**: Endpoints seguros criados nos blogs para receber as pautas.
- **Revalidate**: Serviço de limpeza automática do cache das páginas.
- *Guia de Configuração*: [ORGANIC_BRIDGE_SETUP.md](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/ORGANIC_BRIDGE_SETUP.md)

---

## 2. Validador Automático de Conexões

O Organic Traffic OS implementa o carregador [provider-health.ts](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/src/config/providers/provider-health.ts) para testar as conexões de forma segura. Esse script checa se as chaves existem no ambiente sem exibir as senhas nos logs do console, ajudando a manter a auditoria em conformidade com as melhores práticas de segurança corporativa.
