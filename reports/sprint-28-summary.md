# Sprint 28 — Google Analytics 4 Connector V1

## O Que Foi Criado

O segundo **Connector real** do Organic Traffic OS: **Google Analytics 4 Connector**.

Ele complementa o Google Search Console Connector ao adicionar dados de comportamento dos usuários: sessões, visualizações, engajamento, eventos e conversões.

## Arquitetura

```
organic-traffic-os/core/connectors/google-analytics-4/
├── google-analytics-4.types.ts       # Tipos: Ga4AuthConfig, Ga4Property, InternalGa4Metrics, etc.
├── google-analytics-4.client.ts      # Cliente HTTP com OAuth 2.0 (authorize, refresh, runReport)
├── google-analytics-4.mapper.ts      # Mapper: formato GA4 → formato interno
├── google-analytics-4.validator.ts   # Validação de config, tokens, propertyId, datas
├── google-analytics-4.service.ts     # Service: connect, disconnect, sync, fetch*, listProperties
├── google-analytics-4.connector.ts   # Implementação BaseConnector
├── google-analytics-4.manifest.json  # Metadata, rate limits, OAuth config, scopes
└── google-analytics-4.report-template.json
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

Todos os dados do GA4 são convertidos para `InternalGa4Metrics`:

```typescript
{
  id: string;                          // página, fonte, ou evento
  type: Ga4Dimension;                  // pagePath, sessionSource, etc.
  activeUsers: number;
  sessions: number;
  totalUsers: number;
  screenPageViews: number;
  averageSessionDuration: number;
  engagementRate: number;              // percentual
  eventsPerSession: number;
  conversions: number;
  date: string;                        // ISO date
  source?: string;
  medium?: string;
  device?: string;
  country?: string;
}
```

Nenhuma Engine conhece o formato bruto do GA4.

## Recursos Sincronizados

- Propriedades disponíveis
- Páginas mais acessadas
- Sessões e usuários
- Visualizações de tela
- Tempo médio de engajamento
- Taxa de engajamento
- Eventos
- Conversões
- Fontes de tráfego (origem/mídia)
- Dispositivo
- País

## Cache

- Cache em memória com TTL de 1 hora
- Metadata: `last_sync`, `expires_at`, `source`, `status`, `record_count`
- Status: `valid`, `stale`, `empty`

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/organic-os/connectors/google-analytics-4/connect` | Inicializar conexão / OAuth |
| POST | `/api/organic-os/connectors/google-analytics-4/sync` | Sincronizar dados de uma propriedade |
| GET | `/api/organic-os/connectors/google-analytics-4/status` | Status da conexão e cache |
| GET | `/api/organic-os/connectors/google-analytics-4/properties` | Listar propriedades GA4 |
| GET | `/api/organic-os/connectors/google-analytics-4/pages` | Buscar páginas acessadas |
| GET | `/api/organic-os/connectors/google-analytics-4/callback` | Callback OAuth |

## Painel

Acesse: `/organic-os/connectors/google-analytics-4`

- Status da conexão e token
- Fluxo OAuth completo
- Propriedades GA4 vinculadas
- Sincronização com seleção de propriedade
- Páginas mais acessadas (top 50)
- Fontes de tráfego (top 50)
- Eventos rastreados (top 50)
- Logs de operação com timestamps
- Resultado da sincronização (sessões, usuários, engajamento, duração)

## Variáveis de Ambiente

```env
GA4_CLIENT_ID=
GA4_CLIENT_SECRET=
GA4_REDIRECT_URI=http://localhost:3000/api/organic-os/connectors/google-analytics-4/callback
```

## Boas Práticas

- Nenhum Agent acessa diretamente a API do GA4
- Toda comunicação passa pelo Connector
- Tokens nunca armazenados em código
- Mapper garante formato interno agnóstico
- Cache evita chamadas repetidas à API
- Rate limits configurados no manifest
- Scopes mínimos necessários (readonly)

## Limitações

- Modo mock para desenvolvimento (sem credenciais reais)
- Cache em memória (não persiste entre reinicializações)
- Máximo 100.000 linhas por relatório (limite do GA4 API)
- Dados de GA4 podem ter latência de até 48 horas

## Próximos Passos

- Integrar dados do GA4 com o Monitoring Agent
- Combinar dados GSC + GA4 para análise completa
- Implementar persistência do cache (Redis/Supabase)
- Adicionar suporte a Google Ads
- Criar dashboards de comparação GSC vs GA4
