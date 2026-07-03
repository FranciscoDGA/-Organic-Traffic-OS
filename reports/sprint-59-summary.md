# Sprint 59 — AI Chief of Staff V1

## Objetivo
Implementar o AI Chief of Staff — coordenador operacional que transforma objetivos estrategicos em planos operacionais diarios.

## O que foi criado

### Core: `organic-traffic-os/core/chief-of-staff/`
| Arquivo | Descricao |
|---------|-----------|
| `chief.types.ts` | DailyPlan, PriorityTask, CapacityReport, ExecutiveSummary |
| `priority-engine.ts` | prioritizeTask com 5 pesos, sortTasksByPriority |
| `capacity-planner.ts` | estimateCapacity, detectBottlenecks |
| `task-distributor.ts` | distributeTasks por agent |
| `workload-balancer.ts` | balanceWorkload por agent |
| `chief-of-staff.ts` | Service com createDailyPlan/plans/priorities/capacity/summary |
| `chief-validator.ts` | Validacao |

### API: 6 endpoints
| Rota | Descricao |
|------|-----------|
| `POST /api/organic-os/chief` | Criar plano diario |
| `GET /api/organic-os/chief` | Listar planos |
| `POST /api/organic-os/chief/daily-plan` | Criar plano diario |
| `GET /api/organic-os/chief/priorities` | Tarefas priorizadas |
| `GET /api/organic-os/chief/capacity` | Capacidade + workload |
| `GET /api/organic-os/chief/summary` | Resumo executivo |

### Dashboard: `/organic-os/chief`
- Resumo Executivo (prioridades, risco, oportunidade, recomendacao)
- Metricas (tempo, custo, utilizacao)
- Tarefas Prioritarias com badge
- Workflows Programados com horario
- Capacidade (Runtime, Scheduler, Agents, IA)
- Workload por Agent
- Riscos e Oportunidades

### Sidebar
Chief of Staff adicionado em Orchestration (18 items agora)

### Priority Engine
5 pesos: urgencia (0.25), impacto (0.3), risco (0.2), dependencias (0.15), orcamento (0.1)

### Pre-loaded tasks
5 tasks distribuidas entre Writer, Review, Publishing, Research, Monitoring Agents
