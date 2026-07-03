# Sprint 38 — Authority Intelligence Engine V1

## O Que Foi Criado

A terceira **Engine de Inteligência** do Organic Traffic OS: **Authority Intelligence Engine**.

Ela mede, analisa e fortalece a autoridade temática do site, identificando clusters fracos, páginas pilares ausentes e falta de links internos.

## Arquitetura

```
organic-traffic-os/core/engines/authority-intelligence/
├── authority-intelligence.types.ts         # Tipos: AuthorityItem, Cluster, EntityAuthority
├── authority-intelligence.validator.ts     # Funções de cálculo de scores
├── authority-intelligence.engine.ts        # Engine principal: clusters, entities, pillars, links
├── authority-intelligence.service.ts       # Service: runAnalysis, getRecommendations
├── authority-intelligence.manifest.json    # Metadata da engine
├── authority-intelligence.rules.json       # Regras de análise e pesos
└── authority-intelligence.report-template.json
```

## Entradas (Inputs)

A Engine consome dados normalizados de:
- **Knowledge Core** — conteúdos catalogados
- **Inventory** — inventário de conteúdos
- **Content Intelligence** — dados da Content Intelligence Engine
- **Semantic Intelligence** — dados da Semantic Intelligence Engine
- **Keywords** — palavras-chave
- **Clusters** — dados de clusters existentes
- **Internal Links** — mapa de links internos
- **Sources** — fontes de dados
- **Performance** — dados de performance
- **Publishing Packages** — pacotes publicados

## Saídas (Outputs)

- **Authority Intelligence Report** — relatório completo
- **Topical Authority Score** — autoridade temática geral
- **Cluster Authority Report** — autoridade por cluster
- **Entity Authority Report** — autoridade por entidade
- **Internal Link Authority Report** — qualidade dos links internos
- **Pillar Page Gap Report** — pilares ausentes
- **Authority Recommendations** — recomendações estruturadas

## Scores Calculados

| Score | Descrição | Fórmula |
|-------|-----------|---------|
| **Topical** | Autoridade temática geral | word_count + cluster_count + internal_links + keyword_breadth + entity_breadth |
| **Cluster** | Autoridade por cluster | pillar_ratio + avg_items + avg_words + avg_links + keyword_coverage |
| **Entity** | Autoridade por entidade | avg_mentions + pillar_ratio + cluster_spread + entity_count |
| **Internal Linking** | Qualidade dos links internos | avg_links + incoming_ratio + outgoing_ratio + orphan_ratio |
| **Pillar Coverage** | Cobertura de páginas pilares | coverage_ratio + avg_words + avg_links |
| **Source** | Diversidade de fontes | unique_sources + dominance_ratio + keywords + entities |
| **Overall** | Autoridade geral | weighted average dos 6 scores |

## Funções Implementadas

| Função | Descrição |
|--------|-----------|
| `buildClusters()` | Constrói clusters a partir de items e dados de clusters |
| `buildEntityAuthority()` | Mapeia autoridade de cada entidade |
| `detectPillarGaps()` | Identifica clusters sem página pilar |
| `detectWeakClusters()` | Identifica clusters com score baixo |
| `analyzeInternalLinks()` | Analisa qualidade da rede de links internos |
| `calculateScores()` | Calcula os 7 scores de autoridade |
| `generateRecommendations()` | Gera recomendações baseadas nos gaps |

## Regras de Análise

| Regra | Condição | Ação | Prioridade |
|-------|----------|------|------------|
| Cluster sem pilar | cluster.pillar_id == null && items >= 3 | create_pillar | critical |
| Cluster fraco | total_words < 2000 && items < 3 | expand_cluster | high |
| Sem links internos | links_in == 0 && links_out == 0 | add_internal_links | high |
| Conteúdo órfão | links_in == 0 && type == 'post' | add_internal_links | medium |
| Entidade fraca | mentions < 3 && clusters < 2 | strengthen_entity | medium |
| Pilar raso | word_count < 1500 | expand_cluster | high |
| Keywords ausentes | keywords.length == 0 && items > 2 | consolidate_topic | medium |
| Fonte dominante | dominance_ratio > 0.7 | improve_source | low |
| Alta oportunidade | items >= 5 && pillar_id == null | create_pillar | critical |

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/organic-os/engines/authority-intelligence` | Status da última análise |
| POST | `.../analyze` | Rodar análise com dados |
| GET | `.../reports` | Histórico de análises |
| GET | `.../recommendations` | Listar recomendações |

## Painel

Acesse: `/organic-os/engines/authority-intelligence`

- **Overview**: 7 gauges de scores + contadores (itens, clusters, entidades, pilares, lacunas)
- **Clusters**: Lista de clusters com pillar_id, itens, palavras, keywords, entidades, score
- **Entidades**: Autoridade por entidade com menções, clusters, itens, status de pilar
- **Pilares**: Páginas pilares com palavras, links in/out, coverage score
- **Lacunas**: Pilares ausentes + clusters fracos com score e razão
- **Recomendações**: Lista priorizada com tipo, impacto e esforço
- **Análise**: Input JSON para rodar análise customizada ou mock

## Integração com Engines

A Authority Intelligence Engine consome dados de:
- **Content Intelligence Engine** — items e scores de conteúdo
- **Semantic Intelligence Engine** — entidades e tópicos

E fornece dados para:
- **Discovery Agent**: identificar clusters para expandir
- **Planning Agent**: priorizar criação de páginas pilares
- **Writer Agent**: orientar criação de conteúdo para clusters fracos
- **Monitoring Agent**: rastrear mudanças na autoridade ao longo do tempo

## Fluxo de Análise

```
Connectors e dados normalizados
    ↓
extractItems() → AuthorityItem[]
    ↓
buildClusters() → Cluster[]
    ↓
buildEntityAuthority() → EntityAuthority[]
    ↓
detectPillarGaps() → pillar gaps
    ↓
detectWeakClusters() → weak clusters
    ↓
analyzeInternalLinks() → link analysis
    ↓
calculateScores() → AuthorityScores (7 scores)
    ↓
generateRecommendations() → AuthorityRecommendation[]
    ↓
Authority Intelligence Report
    ↓
Disponível para todos os Agents
```

## Diferenças vs Outras Engines

| Aspecto | Content | Semantic | Authority |
|---------|---------|----------|-----------|
| Foco | Performance | Significado | Autoridade |
| Scores | Health, Opportunity, Risk | Coverage, Entities, Topics | Topical, Cluster, Entity, Links |
| Inputs | GSC, GA4, Bing | Knowledge, Keywords | Inventory, Clusters, Links |
| Pilar pages | Não | Não | Sim |
| Clusters | Não | Parcial | Sim |
| Links internos | Não | Não | Sim |

## Limitações

- Análise baseada em dados disponíveis (pode ter gaps)
- Clusters definidos externamente ou inferidos de keywords
- Links internos precisam ser fornecidos ou inferidos
- Scores são relativos ao conjunto analisado
- Regras são estáticas (podem ser customizadas no rules.json)
- Histórico de análises mantido (últimas 20)
- Recomendações são sugeridas (não executadas automaticamente)

## Próximos Passos

- Inferir clusters automaticamente a partir de keywords e conteúdo
- Detectar links internos a partir do conteúdo
- Integrar com Content Intelligence e Semantic Intelligence automaticamente
- Adicionar comparação entre análises (evolução da autoridade)
- Integrar com Dashboard principal
- Adicionar alertas automáticos para scores críticos
