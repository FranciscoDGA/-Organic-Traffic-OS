# Sprint 26.4 — Research Agent V1

## O Que Foi Criado
O terceiro agente autônomo: o Research Agent, responsável por montar Research Packs completos.

## Arquitetura do Research Pack
Cada pack contém:
- **Resumo Executivo** — síntese do objetivo
- **Principais Tópicos** — estrutura de conteúdo sugerida
- **Fatos Conhecidos** — validados pelo Knowledge Core
- **Fatos Pendentes** — aguardam fonte primária
- **Entity Map** — entidades com tipo, importância e relacionamentos
- **Question Map** — perguntas com prioridade, origem e status
- **Reference List** — fontes com nível de confiança e status
- **Links Internos/Externos Sugeridos** — para SEO

## Fluxo de 5 Camadas
```
L1 Connectors  →  Mock/Manual (sem GSC real ainda)
L2 Knowledge   →  MOCK_FACTS, MOCK_ENTITIES, MOCK_QUESTIONS
L3 Engines     →  collectKnowledge(), collectFacts(), collectEntities()
L4 Agents      →  ResearchAgent.execute() → service.runResearch()
L5 Workflows   →  Preparado para pipeline futuro
```

## Regras de Qualidade
- Nunca remover histórico de fatos
- Registrar conflitos entre fontes
- Marcar dados sem confirmação como "pendente"
- Nunca inventar fatos sem origem identificável

## APIs
- `POST /api/organic-os/agents/research/run`
- `GET /api/organic-os/agents/research/packs`
- `GET /api/organic-os/agents/research/history`

## Limitações Atuais
- Knowledge Base em mock (arquivo estático)
- Sem scraping de SERP real
- Sem integração GSC/GA4

## Próximos Passos
- Sprint 26.5: Writer Agent — usa o Research Pack como base para rascunho
