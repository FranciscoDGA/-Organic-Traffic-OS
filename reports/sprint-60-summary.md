# Sprint 60 — Autonomous Opportunity Manager V1

## Objetivo
Implementar o Autonomous Opportunity Manager — elo entre inteligencia e Mission Control que detecta oportunidades e gera propostas de Missao.

## O que foi criado

### Core: `organic-traffic-os/core/opportunity-manager/`
| Arquivo | Descricao |
|---------|-----------|
| `opportunity.types.ts` | Opportunity, OpportunityScores, MissionProposal, 12 OpportunityTypes |
| `opportunity-detector.ts` | 6 oportunidades pre-carregadas |
| `opportunity-analyzer.ts` | 8 scores por oportunidade |
| `opportunity-scorer.ts` | rankOpportunities por finalPriorityScore |
| `mission-proposal-builder.ts` | buildMissionProposal |
| `opportunity-validator.ts` | Validacao |
| `opportunity.service.ts` | Service com detect/ranking/proposals/approve/reject/analyzeAndPropose |

### API: 7 endpoints
| Rota | Descricao |
|------|-----------|
| `GET /api/organic-os/opportunities` | Listar oportunidades |
| `POST /api/organic-os/opportunities/analyze` | Analisar e gerar propostas |
| `GET /api/organic-os/opportunities/ranking` | Ranking por prioridade |
| `GET /api/organic-os/opportunities/proposals` | Propostas de missao |
| `POST /api/organic-os/opportunities/[id]/approve` | Aprovar proposta |
| `POST /api/organic-os/opportunities/[id]/reject` | Rejeitar proposta |

### Dashboard: `/organic-os/opportunities`
- Ranking de oportunidades com score
- Detalhes com 8 scores (Impact, Effort, Strategic, Revenue, AI, Organic, Priority)
- Missao sugerida
- Propostas de missao com status

### Sidebar
Opportunities adicionado em Orchestration (20 items agora)

### 12 Opportunity Types
new-cluster, content-update, authority-expansion, seasonal-content, emerging-trend, ctr-improvement, conversion-improvement, traffic-recovery, ai-optimization, digital-asset, new-newsletter, new-pillar-page

### 6 pre-loaded opportunities
- Cluster Gastronomia Nordestina (PassaCumaru, score: 82)
- Atualizar artigos viagens (PassaCumaru, score: 75)
- Turismo Regenerativo (PassaCumaru, score: 80)
- Pagina Pilar Ferramentas (Garimpei, score: 72)
- Otimizar AI Overview (Garimpei, score: 70)
- Recuperar trafego sazonal (PassaCumaru, score: 65)
