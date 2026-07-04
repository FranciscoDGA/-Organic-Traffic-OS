# SYSTEM ARCHITECTURE — Organic Traffic OS v1.0

## Visão Geral

```
┌─────────────────────────────────────────────────┐
│              ORGANIC TRAFFIC OS v1.0            │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Dashboard│  │   APIs   │  │   Services   │  │
│  │  (React) │  │ (Next.js)│  │  (TypeScript)│  │
│  └────┬─────┘  └────┬─────┘  └──────┬───────┘  │
│       │             │               │           │
│       └─────────────┼───────────────┘           │
│                     ▼                           │
│         ┌───────────────────────┐               │
│         │  Runtime Engine (ORE) │               │
│         │  + Mission Control    │               │
│         │  + Event Bus          │               │
│         │  + Worker Orchestrator│               │
│         └───────────┬───────────┘               │
│                     │                           │
│       ┌─────────────┼─────────────┐             │
│       ▼             ▼             ▼             │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐       │
│  │Supabase │  │AI Providers│ │Connectors│       │
│  │(Postgres)│ │(OAI/Ant/ │  │(GSC/GA4/ │       │
│  │          │ │ Gemini)   │  │WordPress)│       │
│  └─────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────┘
```

## Camadas

### 1. Apresentação (Dashboard)
- **Framework**: Next.js 16 App Router
- **UI**: React com CSS Vanilla + design tokens premium
- **Roteamento**: `/organic-os/**` para painel executivo

### 2. API Layer
- **Padrão**: REST via Next.js API Routes
- **Auth**: Token Bearer (ORGANIC_PUBLISHER_SECRET)
- **Quantidade**: 180+ endpoints documentados

### 3. Services Layer
- **Localização**: `src/services/` e `src/core/`
- **Padrão**: Classes TypeScript com singleton pattern
- **Isolamento**: Cada serviço encapsula um domínio específico

### 4. Runtime Engine (ORE)
- **Responsabilidade**: Orquestração assíncrona de Workers e Missões
- **Mecanismos**: Circuit Breakers, Retry Logic, Loop Detection
- **Estado**: Gerenciado em memória com persistência em Supabase

### 5. Data Layer
- **Banco**: Supabase (PostgreSQL)
- **Padrão**: Row Level Security por workspace
- **Backup**: Snapshots semanais recomendados

### 6. AI Integration
- **Providers**: OpenAI, Anthropic, Google Gemini
- **Roteamento**: Inteligente por tipo de tarefa e custo
- **Cache**: Context packages reutilizados entre chamadas similares
- **Limites**: Configuráveis por workspace por dia

## Princípios de Arquitetura

1. **Isolamento**: Cada workspace é um silo independente
2. **Governança**: Toda publicação exige aprovação humana
3. **Auditabilidade**: Toda ação é rastreável e imutável
4. **Resiliência**: Falhas isoladas não afetam outros workspaces
5. **Simplicidade**: Novas funcionalidades devem reduzir, não aumentar, a complexidade operacional
