# Sprint 30 — Bing Webmaster Tools Connector V1

## O Que Foi Criado

O quarto **Connector** do Organic Traffic OS: **Bing Webmaster Tools Connector**.

Ele complementa o Google Search Console ao adicionar dados de busca vindos do Bing, ampliando a visão de tráfego orgânico.

## Arquitetura

```
organic-traffic-os/core/connectors/bing-webmaster/
├── bing-webmaster.types.ts       # Tipos: BwAuthConfig, BwSite, InternalBwMetrics, etc.
├── bing-webmaster.client.ts      # Cliente HTTP com API Key + Mock Fallback
├── bing-webmaster.mapper.ts      # Mapper: formato Bing → formato interno
├── bing-webmaster.validator.ts   # Validação de API key, URLs, datas
├── bing-webmaster.service.ts     # Service: connect, disconnect, sync, fetch*
├── bing-webmaster.connector.ts   # Implementação BaseConnector
├── bing-webmaster.manifest.json  # Metadata, rate limits, limitations
└── bing-webmaster.report-template.json
```

## Autenticação

- **API Key** via header `Ocp-Apim-Subscription-Key`
- Variável de ambiente: `BING_API_KEY`
- Nunca armazenar credenciais no código
- Validação de credenciais antes de requisições

## Mock Fallback

Quando a API do Bing não está disponível (credenciais inválidas ou API indisponível), o Connector usa dados mock realistas:
- Consultas mock baseadas no nicho de concursos públicos
- Páginas mock com URLs do PassaCumaru
- Erros de rastreamento simulados
- Status de indexação simulado

## Formato Interno (Mapper)

Todos os dados são convertidos para `InternalBwMetrics`:

```typescript
{
  id: string;           // query ou URL da página
  type: string;         // 'query' | 'page'
  clicks: number;
  impressions: number;
  ctr: number;          // percentual
  position: number;     // posição média
  date: string;         // ISO date
}
```

## Recursos

- Sites disponíveis
- Consultas de busca
- Páginas indexadas
- Cliques, impressões, CTR, posição média
- Erros de rastreamento
- Status de indexação

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/organic-os/connectors/bing-webmaster/connect` | Conectar com API Key |
| POST | `/api/organic-os/connectors/bing-webmaster/sync` | Sincronizar dados de um site |
| GET | `/api/organic-os/connectors/bing-webmaster/status` | Status da conexão |
| GET | `/api/organic-os/connectors/bing-webmaster/sites` | Listar sites |
| GET | `/api/organic-os/connectors/bing-webmaster/queries` | Buscar consultas |
| GET | `/api/organic-os/connectors/bing-webmaster/pages` | Buscar páginas |

## Painel

Acesse: `/organic-os/connectors/bing-webmaster`

- Status da conexão e API Key
- Sites vinculados
- Sincronização com seleção de site
- Consultas de busca (top 50)
- Páginas indexadas (top 50)
- Erros de rastreamento
- Logs de operação

## Variáveis de Ambiente

```env
BING_API_KEY=
```

## Boas Práticas

- Nenhum Agent acessa diretamente a API do Bing
- Toda comunicação passa pelo Connector
- API Key nunca armazenada em código
- Mapper garante formato interno agnóstico
- Cache evita chamadas repetidas à API
- Mock fallback para desenvolvimento

## Limitações

- API Key necessária (obtida no Bing Webmaster Tools)
- Dados mock usados como fallback
- Rate limits da API do Bing aplicáveis
- Backlinks não disponíveis nesta versão

## Próximos Passos

- Integrar dados do Bing com o Monitoring Agent
- Combinar GSC + Bing para análise multi-busca
- Adicionar suporte a backlinks
- Implementar alertas de erros de rastreamento
