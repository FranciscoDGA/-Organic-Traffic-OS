# Sprint 29 — Google Trends Connector V1

## O Que Foi Criado

O terceiro **Connector** do Organic Traffic OS: **Google Trends Connector**.

Este Connector identifica tendências, crescimento de interesse, sazonalidade, termos relacionados e oportunidades emergentes.

**Importante:** O Google Trends não possui API oficial. Este Connector utiliza um **Mock Adapter** claramente identificado, com dados simulados baseados em padrões reais de busca.

## Arquitetura

```
organic-traffic-os/core/connectors/google-trends/
├── google-trends.types.ts       # Tipos: GtConfig, GtInterestOverTime, GtSeasonality, etc.
├── google-trends.client.ts      # Mock Adapter com dados realistas
├── google-trends.mapper.ts      # Mapper: formato Trends → formato interno
├── google-trends.validator.ts   # Validação de termos, países, config
├── google-trends.service.ts     # Service: connect, sync, fetch*, compare, detectSeasonality
├── google-trends.connector.ts   # Implementação BaseConnector
├── google-trends.manifest.json  # Metadata, rate limits, limitations
└── google-trends.report-template.json
```

## Limitações do Google Trends

- **Não existe API oficial do Google Trends**
- Dados obtidos via scraping são contra os ToS do Google
- Para produção, usar SerpAPI, DataForSEO ou similar
- Mock Adapter simula dados realistas para desenvolvimento

## Mock Adapter

O `GtClient` funciona como um Mock Adapter que:
- Gera timelines realistas com sazonalidade
- Simula distribuição regional
- Fornece consultas e tópicos relacionados realistas
- Detecta tendências (rising/stable/declining)
- Analisa sazonalidade por mês

**Todos os mocks estão claramente identificados no código e no manifest.**

## Formato Interno (Mapper)

Todos os dados são convertidos para `GtInternalData`:

```typescript
{
  id: string;
  term: string;
  type: 'interest_over_time' | 'interest_by_region' | 'related_queries' | 'related_topics' | 'comparison' | 'seasonality';
  value: number;
  metadata: Record<string, unknown>;
  date: string;
  country: string;
}
```

## Recursos

- Interesse ao longo do tempo
- Interesse por região
- Consultas relacionadas (rising/top)
- Tópicos relacionados (rising/top)
- Comparação entre termos
- Detecção de sazonalidade

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/organic-os/connectors/google-trends/sync` | Connect, sync, fetch data |
| GET | `/api/organic-os/connectors/google-trends/status` | Status do connector |
| GET | `/api/organic-os/connectors/google-trends/interest` | Interesse ao longo do tempo |
| GET | `/api/organic-os/connectors/google-trends/related` | Consultas/tópicos relacionados |
| POST | `/api/organic-os/connectors/google-trends/compare` | Comparar termos |

## Painel

Acesse: `/organic-os/connectors/google-trends`

- Status do connector (modo mock/ativo)
- Configuração de termos e país
- Interesse ao longo do tempo (gráfico de barras)
- Regiões com ranking
- Consultas e tópicos relacionados (rising/top)
- Comparação de termos com vencedor
- Sazonalidade (pico, baixa, força)
- Logs de operação

## Boas Práticas

- Nenhum Agent acessa diretamente o Google Trends
- Toda comunicação passa pelo Connector
- Mock Adapter claramente identificado
- Mapper garante formato interno agnóstico
- Cache evita chamadas repetidas
- Rate limits configurados no manifest

## Próximos Passos

- Integrar dados de tendências com o Discovery Agent
- Usar tendências para priorizar oportunidades editoriais
- Implementar SerpAPI como adapter real (produção)
- Criar alertas de tendências emergentes
- Combinar dados GSC + GA4 + Trends para análise completa
