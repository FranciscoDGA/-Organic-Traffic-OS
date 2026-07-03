# Sprint 39 — Opportunity Intelligence Engine V1

## O Que Foi Criado

A quarta **Engine de Inteligência** do Organic Traffic OS: **Opportunity Intelligence Engine**.

Ela cruza múltiplos sinais de busca, conteúdo, semântica, autoridade, tendências e performance para identificar as melhores oportunidades editoriais.

## Arquitetura

```
organic-traffic-os/core/engines/opportunity-intelligence/
├── opportunity-intelligence.types.ts         # Tipos: OpportunityItem, SignalData, Scores
├── opportunity-intelligence.validator.ts     # Funções de cálculo de scores
├── opportunity-intelligence.engine.ts        # Engine principal: merge, rank, detect
├── opportunity-intelligence.service.ts       # Service: runAnalysis, getQuickWins
├── opportunity-intelligence.manifest.json    # Metadata da engine
├── opportunity-intelligence.rules.json       # Regras de análise e pesos
└── opportunity-intelligence.report-template.json
```

## Sinais Analisados

A Engine cruza dados de múltiplas fontes:

| Sinal | Fonte | O que identifica |
|-------|-------|------------------|
| GSC | Google Search Console | Quick wins (posição 5-20) |
| GA4 | Google Analytics 4 | Páginas com tráfego mas baixo CTR |
| Bing | Bing Webmaster | Oportunidades no Bing |
| Trends | Google Trends | Tópicos em alta sem cobertura |
| Keywords | Dados de keywords | Keywords com baixa competição |
| SERP | Dados de busca | Competição e oportunidades |
| Inventory | Inventário de conteúdo | Conteúdo existente |
| Content Intelligence | Engine de conteúdo | Conteúdo crítico para atualizar |
| Semantic Intelligence | Engine semântica | Perguntas sem resposta |
| Authority Intelligence | Engine de autoridade | Clusters fracos e pilares ausentes |
| Competitors | Dados de concorrentes | Gaps competitivos |

## Tipos de Oportunidade

| Tipo | Descrição |
|------|-----------|
| **new_content** | Criar conteúdo novo |
| **update** | Atualizar conteúdo existente |
| **pillar_page** | Criar página pilar |
| **satellite_article** | Criar artigo satélite |
| **faq** | Criar FAQ para perguntas sem resposta |
| **simulado** | Criar simulado para tópicos educacionais |
| **checklist** | Criar checklist prático |
| **landing** | Criar landing page para keywords comerciais |
| **internal_linking** | Melhorar links internos |
| **cta_improvement** | Otimizar CTAs existentes |
| **cluster_expansion** | Expandir cluster existente |

## Scores Calculados

| Score | Descrição | Fórmula |
|-------|-----------|---------|
| **Opportunity** | Score geral de oportunidade | weighted average dos outros scores |
| **Traffic Potential** | Potencial de tráfego | impressions + position + trends + volume + competition |
| **Difficulty** | Dificuldade de execução | competition + domain_authority + content_exists + cluster |
| **Monetization** | Potencial de monetização | commercial_intent + keyword_type + cta + conversion |
| **Freshness** | Atualidade do conteúdo | baseado na idade do conteúdo |
| **Authority Fit** | Alinhamento com autoridade | cluster_authority + topical + entity + pillar |
| **Content Gap** | Tamanho da lacuna | has_content + keywords + questions + entities + depth |
| **Strategic Priority** | Prioridade estratégica | business_alignment + competitive + seasonal + conversion |

## Funções Implementadas

| Função | Descrição |
|--------|-----------|
| `mergeSignals()` | Cruza sinais de múltiplas fontes em oportunidades |
| `rankOpportunities()` | Ordena por opportunity_score |
| `detectQuickWins()` | Oportunidades de baixo esforço e alto impacto |
| `detectStrategicOpportunities()` | Oportunidades estratégicas e pilares |
| `detectRefreshOpportunities()` | Conteúdo que precisa de atualização |
| `detectClusterOpportunities()` | Oportunidades de expansão de cluster |
| `detectConversionOpportunities()` | Oportunidades de monetização |
| `generateRecommendations()` | Gera recomendações priorizadas |

## Regras de Análise

| Regra | Condição | Tipo | Prioridade |
|-------|----------|------|------------|
| Alta impressão, CTR baixo | impressions > 1000 && ctr < 2 | cta_improvement | high |
| Tópico em alta sem conteúdo | trends > 70 && !has_content | new_content | critical |
| Expansão de cluster | authority > 50 && items < 5 | cluster_expansion | high |
| Página pilar necessária | items >= 4 && !has_pillar | pillar_page | critical |
| Conteúdo desatualizado | age > 180d && clicks > 10 | update | high |
| Pergunta sem resposta | questions > 3 && coverage < 40 | faq | high |
| Quick win keyword | position 5-20 && impressions > 500 | new_content | high |
| Lacuna de entidade | entity_count < 2 && relevance > 50 | new_content | medium |
| Conversão comercial | commercial_intent && !has_cta | landing | high |
| Simulado educacional | topic == 'educacao' && questions > 5 | simulado | medium |

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/organic-os/engines/opportunity-intelligence` | Status da última análise |
| POST | `.../analyze` | Rodar análise com dados |
| GET | `.../reports` | Histórico de análises |
| GET | `.../recommendations` | Listar recomendações |
| GET | `.../quick-wins` | Listar quick wins |

## Painel

Acesse: `/organic-os/engines/opportunity-intelligence`

- **Overview**: 8 gauges de scores + contadores por tipo + sinais analisados
- **Quick Wins**: Oportunidades de baixo esforço e alto impacto
- **Estratégicas**: Oportunidades estratégicas e páginas pilares
- **Atualização**: Conteúdo que precisa de refresh
- **Clusters**: Oportunidades de expansão de cluster
- **Conversão**: Oportunidades de monetização
- **Todas**: Lista completa ranqueada
- **Análise**: Input JSON para rodar análise customizada ou mock

## Integração com Engines

A Opportunity Intelligence Engine consome dados de:
- **Content Intelligence Engine** — conteúdo crítico
- **Semantic Intelligence Engine** — perguntas sem resposta
- **Authority Intelligence Engine** — clusters fracos e pilares ausentes

E fornece dados para:
- **Planning Agent**: priorizar agenda editorial
- **Discovery Agent**: identificar novos tópicos
- **Writer Agent**: focar em conteúdo de alto impacto
- **Research Agent**: aprofundar oportunidades estratégicas

## Fluxo de Análise

```
Múltiplos sinais (GSC, GA4, Trends, Keywords, etc.)
    ↓
mergeSignals() → OpportunityItem[]
    ↓
rankOpportunities() → por opportunity_score
    ↓
detectQuickWins() → baixo esforço, alto impacto
    ↓
detectStrategicOpportunities() → pilares e estratégicas
    ↓
detectRefreshOpportunities() → conteúdo desatualizado
    ↓
detectClusterOpportunities() → expansão de cluster
    ↓
detectConversionOpportunities() → monetização
    ↓
generateRecommendations() → lista priorizada
    ↓
Opportunity Intelligence Report
```

## Exemplo de Quick Win

```json
{
  "title": "Otimizar: como estudar para concurso",
  "type": "new_content",
  "description": "Posição 12 com 3000 impressões — otimizar para subir",
  "reason": "Quick win — posição 5-20 com volume",
  "opportunity_score": 72,
  "traffic_potential": 65,
  "difficulty": 25,
  "effort": "baixo",
  "impact": "medio",
  "estimated_time_hours": 4
}
```

## Limitações

- Análise baseada em dados disponíveis (pode ter gaps)
- Scores são relativos ao conjunto analisado
- Regras são estáticas (podem ser customizadas no rules.json)
- Histórico de análises mantido (últimas 20)
- Recomendações são sugeridas (não executadas automaticamente)
- Não acessa APIs externas diretamente
- Não altera calendário ou publica automaticamente

## Próximos Passos

- Integrar dados de concorrentes em tempo real
- Adicionar comparação entre análises (evolução de oportunidades)
- Integrar com Dashboard principal
- Adicionar alertas para quick wins
- Conectar com Calendar Agent para agendamento
- Expandir regras baseadas em feedback dos Agents
