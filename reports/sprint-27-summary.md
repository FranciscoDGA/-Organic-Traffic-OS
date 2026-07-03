# Sprint 27 — Google Search Console Connector V1

## O Que Foi Criado

O primeiro **Connector real** do Organic Traffic OS: **Google Search Console Connector**.

Ele representa a primeira integração com dados reais de pesquisa, utilizando OAuth 2.0 e totalmente desacoplado das Engines e Agents.

## Arquitetura

```
organic-traffic-os/core/connectors/google-search-console/
├── google-search-console.types.ts       # Tipos: GscAuthConfig, GscSite, InternalMetricsData, etc.
├── google-search-console.client.ts      # Cliente HTTP com OAuth 2.0 (authorize, refresh, fetch)
├── google-search-console.mapper.ts      # Mapper: formato Google → formato interno
├── google-search-console.validator.ts   # Validação de config, tokens, URLs, datas
├── google-search-console.service.ts     # Service: connect, disconnect, sync, fetch*, listSites
├── google-search-console.connector.ts   # Implementação BaseConnector
├── google-search-console.manifest.json  # Metadata, rate limits, OAuth config
└── google-search-console.report-template.json
```

## Fluxo OAuth 2.0

1. Usuário fornece `client_id` e `client_secret`
2. Connector gera URL de autorização do Google
3. Usuário autoriza em popup
4. Google redireciona para `/api/.../callback` com `code`
5. Connector troca `code` por `access_token` + `refresh_token`
6. Token armazenado em memória (nunca em código)
7. Refresh automático quando token expira

## Formato Interno (Mapper)

Todos os dados do Google são convertidos para `InternalMetricsData`:

```typescript
{
  id: string;           // query ou URL da página
  type: 'query' | 'page' | 'country' | 'device' | 'date';
  clicks: number;
  impressions: number;
  ctr: number;          // percentual
  position: number;     // posição média
  date: string;         // ISO date
}
```

Nenhuma Engine conhece o formato da API do Google.

## Recursos Sincronizados

- Sites disponíveis
- Consultas (queries)
- Páginas
- Impressões
- Cliques
- CTR
- Posição Média

## Cache

- Cache em memória com TTL de 1 hora
- Metadata: `last_sync`, `expires_at`, `source`, `status`, `record_count`
- Status: `valid`, `stale`, `empty`

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/organic-os/connectors/google-search-console/connect` | Inicializar conexão / OAuth |
| POST | `/api/organic-os/connectors/google-search-console/sync` | Sincronizar dados de um site |
| GET | `/api/organic-os/connectors/google-search-console/status` | Status da conexão e cache |
| GET | `/api/organic-os/connectors/google-search-console/sites` | Listar sites vinculados |
| GET | `/api/organic-os/connectors/google-search-console/callback` | Callback OAuth |

## Painel

Acesse: `/organic-os/connectors/google-search-console`

- Status da conexão e token
- Fluxo OAuth completo
- Sites vinculados
- Sincronização com seleção de site
- Consultas de pesquisa (top 50)
- Páginas indexadas (top 50)
- Logs de operação com timestamps
- Resultado da sincronização (clicks, impressões, CTR, posição)

## Variáveis de Ambiente

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/organic-os/connectors/google-search-console/callback
```

## Boas Práticas

- Nenhum Agent acessa diretamente a API do Google
- Toda comunicação passa pelo Connector
- Tokens nunca armazenados em código
- Mapper garante formato interno agnóstico
- Cache evita chamadas repetidas à API
- Rate limits configurados no manifest

## Limitações

- Modo mock para desenvolvimento (sem credenciais reais)
- Cache em memória (não persiste entre reinicializações)
- Máximo 25.000 linhas por requisição (limite do GSC)
- Período máximo de consulta: 901 dias

## Próximos Passos

- Integrar dados do GSC com o Monitoring Agent
- Alimentar o Discovery Agent com dados reais de performance
- Implementar persistência do cache (Redis/Supabase)
- Adicionar suporte a Google Analytics
