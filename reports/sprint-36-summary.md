# Sprint 36 — Content Intelligence Engine V1

## O Que Foi Criado

A primeira **Engine de Inteligência** do Organic Traffic OS: **Content Intelligence Engine**.

Ela consome dados normalizados dos Connectors e produz recomendações reutilizáveis para todos os Agents, transformando dados em decisões editoriais.

## Arquitetura

```
organic-traffic-os/core/engines/content-intelligence/
├── content-intelligence.types.ts         # Tipos: ContentItem, ContentMetrics, ContentScores
├── content-intelligence.validator.ts     # Funções de cálculo de scores
├── content-intelligence.engine.ts        # Engine principal: analyze, detect, recommend
├── content-intelligence.service.ts       # Service: runAnalysis, getRecommendations
├── content-intelligence.manifest.json    # Metadata da engine
├── content-intelligence.rules.json       # Regras de análise e pesos
└── content-intelligence.report-template.json
```

## Entradas (Inputs)

A Engine consome dados de:
- Google Search Console (clicks, impressions, CTR, position)
- Google Analytics 4 (sessions, pageviews, bounce rate, time on page)
- Bing Webmaster (clicks, impressions, CTR, position)
- Google Trends (interest data)
- RSS & Sitemap (URLs, dates, types)
- Inventory (conteúdo catalogado)
- Performance History

## Saídas (Outputs)

- **Content Intelligence Report** — relatório completo
- **Content Scores** — 7 scores de 0-100
- **Recommendations** — lista priorizada de ações
- **Critical Content** — conteúdos que precisam de atenção urgente
- **Promising Content** — conteúdos com alto potencial

## Scores Calculados

| Score | Descrição | Fórmula |
|-------|-----------|---------|
| **Health** | Saúde geral do conteúdo | clicks + ctr + position + bounce + freshness |
| **Opportunity** | Potencial de melhoria | impressions + ctr_gap + position + clicks |
| **Risk** | Risco de perda | position_drop + age + ctr_decline + bounce |
| **Freshness** | Atualidade do conteúdo | Baseado na data de publicação/atualização |
| **Authority** | Autoridade temática | clicks + position + sessions |
| **Potential** | Potencial de tráfego | impressions + position + ctr |
| **Growth** | Trajetória de crescimento | Variação de clicks, impressions, position |

## Regras de Análise

| Regra | Condição | Ação | Prioridade |
|-------|----------|------|------------|
| Alto bounce + Posição Ruim | bounce > 70% && position > 20 | update | critical |
| Alta impressão + CTR baixo | impressions > 1000 && ctr < 2% | optimize | high |
| Conteúdo em declínio | clicks > 20 && position > 10 && age > 180d | update | high |
| Posição favorável | position 5-20 && impressions > 500 | optimize | medium |
| Conteúdo desatualizado | age > 365d | update | medium |
| Conteúdo autoridade | clicks > 100 && position <= 5 | monitor | low |
| Oportunidade novo conteúdo | impressions > 2000 && clicks < 5 | create | high |
| Cluster temático | impressions > 500 && position > 10 | cluster | medium |

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/organic-os/engines/content-intelligence` | Status da última análise |
| POST | `/api/organic-os/engines/content-intelligence/analyze` | Rodar análise com dados |
| GET | `/api/organic-os/engines/content-intelligence/recommendations` | Listar recomendações |
| GET | `/api/organic-os/engines/content-intelligence/scores` | Obter scores gerais |

## Painel

Acesse: `/organic-os/engines/content-intelligence`

- **Overview**: 7 gauges de scores + contadores (críticos, recomendações, promissores)
- **Recomendações**: Lista priorizada com tipo, prioridade, impacto
- **Conteúdo Crítico**: Itens com health baixo ou risco alto
- **Conteúdo Promissor**: Itens com alta oportunidade ou potencial
- **Análise**: Input JSON para rodar análise customizada ou mock

## Integração com Agents

A Intelligence Engine fornece dados para:
- **Discovery Agent**: priorizar descobertas
- **Planning Agent**: agenda baseada em oportunidades
- **Research Agent**: aprofundar tópicos promissores
- **Writer Agent**: focar em conteúdo de alto impacto
- **Review Agent**: validar calidaden base em scores
- **Monitoring Agent**: rastrear mudanças nos scores

## Fluxo de Análise

```
Connectors coletam dados
    ↓
Dados normalizados (formato padrão)
    ↓
Content Intelligence Engine
    ↓
calculateScores() → 7 scores por conteúdo
    ↓
detectOpportunities() → regras de negócio
    ↓
generateRecommendations() → lista priorizada
    ↓
Content Intelligence Report
    ↓
Disponível para todos os Agents
```

## Limitações

- Análise baseada em dados disponíveis (pode ter gaps)
- Scores são relativos ao conjunto analisado
- Regras são estáticas (podem ser customizadas no rules.json)
- Histórico de análises não persistido ainda
- Recomendações são sugeridas (não executadas automaticamente)

## Próximos Passos

- Persistir histórico de análises
- Adicionar comparação entre análises (tendências)
- Integrar com Dashboard principal
- Adicionar alertas automáticos para scores críticos
- Expandir regras baseadas em feedback dos Agents
