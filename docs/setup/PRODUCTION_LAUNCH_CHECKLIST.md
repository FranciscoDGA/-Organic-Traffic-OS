# Production Launch Checklist

Antes de dar o "Go-Live" definitivo no painel de controle operacional do Organic Traffic OS, garanta que todos os itens abaixo estejam validados:

- [ ] **Vercel**: Todas as 32 variáveis de ambiente preenchidas na Vercel e o build completou com sucesso.
- [ ] **Supabase**: Tabelas e views criadas via script `001_initial_schema.sql` e buckets criados via `buckets.sql` com políticas RLS ativas.
- [ ] **GitHub**: Repositório conectado e Personal Access Token (PAT) com escopo `repo` válido cadastrado.
- [ ] **AI Providers**: Chaves de API configuradas e limites de gastos definidos na OpenAI/Google AI Studio para evitar surpresas.
- [ ] **Google APIs**: Aplicativo registrado no Google Cloud com redirect URI correto e chaves do Google Search Console verificadas.
- [ ] **E-mail**: Domínio validado com registros SPF/DKIM configurados no DNS.
- [ ] **Organic Bridge**: Todos os 5 blogs possuem as variáveis cadastradas no respectivo ambiente.
- [ ] **Controle Editorial**: Modo manual ativo por padrão em todos os blogs (`ORGANIC_AUTO_PUBLISH=false`) para as primeiras publicações.
