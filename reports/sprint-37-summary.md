# Sprint 37 — Semantic Intelligence Engine V1

## O Que Foi Criado

A segunda **Engine de Inteligência** do Organic Traffic OS: **Semantic Intelligence Engine**.

Ela analisa cobertura semântica, entidades, tópicos, perguntas e lacunas de significado dos conteúdos, transformando dados existentes em inteligência semântica reutilizável.

## Arquitetura

```
organic-traffic-os/core/engines/semantic-intelligence/
├── semantic-intelligence.types.ts         # Tipos: SemanticItem, Entity, Topic, Gap
├── semantic-intelligence.validator.ts     # Funções de cálculo de scores
├── semantic-intelligence.engine.ts        # Engine principal: entities, topics, questions, gaps
├── semantic-intelligence.service.ts       # Service: runAnalysis, getRecommendations
├── semantic-intelligence.manifest.json    # Metadata da engine
├── semantic-intelligence.rules.json       # Regras de análise e pesos
└── semantic-intelligence.report-template.json
```

## Entradas (Inputs)

A Engine consome dados normalizados de:
- **Knowledge Core** — conteúdos catalogados
- **Keywords** — palavras-chave e termos
- **SERP** — dados de resultados de busca
- **Inventory** — inventário de conteúdos
- **Research Packs** — pacotes de pesquisa
- **Drafts** — rascunhos em andamento
- **Visibility Reports** — relatórios de visibilidade
- **Sources** — fontes de dados
- **Facts** — fatos registrados

## Saídas (Outputs)

- **Semantic Intelligence Report** — relatório completo
- **Entity Coverage Report** — entidades identificadas
- **Topic Coverage Report** — tópicos mapeados
- **Question Coverage Report** — perguntas do público
- **Semantic Gap Report** — lacunas semânticas
- **Semantic Recommendations** — recomendações estruturadas

## Scores Calculados

| Score | Descrição | Fórmula |
|-------|-----------|---------|
| **Coverage** | Cobertura semântica geral | word_count + keywords + entities + topics + structure + links + readability |
| **Entity Coverage** | Cobertura de entidades | items_with_entities + total_entities + avg_per_item + diversity |
| **Topic Depth** | Profundidade temática | avg_depth + avg_coverage + topic_count + keyword_support |
| **Question Answering** | Capacidade de responder perguntas | avg_coverage + well_answered_ratio |
| **Topical Authority** | Autoridade temática | coverage_ratio + keyword_breadth + topic_count + avg_frequency |
| **Completeness** | Completude do conteúdo | word_count + links + headings + readability + keywords + entities |

## Funções Implementadas

| Função | Descrição |
|--------|-----------|
| `extractEntities()` | Extrai entidades de organizações, produtos, conceitos, localizações |
| `mapTopics()` | Mapeia tópicos a partir de keywords e conteúdo |
| `mapQuestions()` | Identifica perguntas do público no conteúdo |
| `detectSemanticGaps()` | Detecta lacunas semânticas (entidades, tópicos, perguntas, keywords) |
| `calculateScores()` | Calcula os 6 scores semânticos |
| `generateRecommendations()` | Gera recomendações baseadas nos gaps e scores |
| `analyzeSemanticCoverage()` | Pipeline completo de análise |

## Regras de Análise

| Regra | Condição | Ação | Prioridade |
|-------|----------|------|------------|
| Entidades baixas | entity_coverage < 30 | cover_entity | high |
| Tópicos rasos | topic_depth < 40 | deepen_topic | high |
| Perguntas sem resposta | question_answering < 30 | answer_question | critical |
| Keywords ausentes | keyword_count < 3 && word_count > 500 | add_keyword | medium |
| Conteúdo raso | word_count < 500 && type == 'post' | improve_depth | medium |
| Cluster incompleto | topic_frequency > 3 && items_in_cluster < 3 | expand_cluster | high |
| Lacuna de cobertura | impressions > 500 && coverage_score < 40 | create_content | high |
| Autoridade fraca | topical_authority < 30 && topic_count > 5 | deepen_topic | medium |

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/organic-os/engines/semantic-intelligence` | Status da última análise |
| POST | `/api/organic-os/engines/semantic-intelligence/analyze` | Rodar análise com dados |
| GET | `/api/organic-os/engines/semantic-intelligence/reports` | Histórico de análises |
| GET | `/api/organic-os/engines/semantic-intelligence/recommendations` | Listar recomendações |

## Painel

Acesse: `/organic-os/engines/semantic-intelligence`

- **Overview**: 6 gauges de scores + contadores (entidades, tópicos, perguntas, lacunas)
- **Entidades**: Lista de entidades com tipo, frequência e itens referenciados
- **Tópicos**: Tópicos mapeados com frequência, cobertura e itens
- **Perguntas**: Perguntas identificadas com topic e level de coverage
- **Lacunas**: Lacunas semânticas detectadas com tipo, prioridade e recomendação
- **Recomendações**: Lista priorizada com tipo, impacto e esforço
- **Análise**: Input JSON para rodar análise customizada ou mock

## Integração com Agents

A Semantic Intelligence Engine fornece dados para:
- **Discovery Agent**: identificar tópicos não cobertos
- **Planning Agent**: priorizar criação de conteúdo por lacunas semânticas
- **Research Agent**: aprofundar tópicos com baixa cobertura
- **Writer Agent**: orientar criação de conteúdo para responder perguntas
- **Review Agent**: validar cobertura semântica antes de publicar
- **Monitoring Agent**: rastrear mudanças na cobertura ao longo do tempo

## Fluxo de Análise

```
Connectors e dados normalizados
    ↓
extractItems() → SemanticItem[]
    ↓
extractEntities() → Entity[]
    ↓
mapTopics() → Topic[]
    ↓
mapQuestions() → SemanticQuestion[]
    ↓
detectSemanticGaps() → SemanticGap[]
    ↓
calculateScores() → SemanticScores (6 scores)
    ↓
generateRecommendations() → SemanticRecommendation[]
    ↓
Semantic Intelligence Report
    ↓
Disponível para todos os Agents
```

## Diferenças vs Content Intelligence Engine

| Aspecto | Content Intelligence | Semantic Intelligence |
|---------|---------------------|----------------------|
| Foco | Performance e métricas | Significado e cobertura |
| Scores | Health, Opportunity, Risk, etc. | Coverage, Entities, Topics, etc. |
| Inputs principais | GSC, GA4, Bing, RSS | Knowledge Core, Keywords, SERP |
| Entidades | Não | Sim |
| Tópicos | Não | Sim |
| Perguntas | Não | Sim |
| Lacunas | Oportunidades de conteúdo | Lacunas semânticas |

## Limitações

- Análise baseada em dados disponíveis (pode ter gaps)
- Extração de entidades usa padrões regex (não NLP avançado)
- Perguntas extraídas de padrões textuais (não análise semântica profunda)
- Scores são relativos ao conjunto analisado
- Regras são estáticas (podem ser customizadas no rules.json)
- Histórico de análises mantido (últimas 20)
- Recomendações são sugeridas (não executadas automaticamente)

## Próximos Passos

- Integrar com NLP real para extração de entidades
- Adicionar comparação entre análises (tendências de cobertura)
- Expandir detecção de perguntas com análise de SERP
- Integrar com Dashboard principal
- Adicionar alertas automáticos para scores críticos
- Conectar com Content Intelligence Engine para correlação
