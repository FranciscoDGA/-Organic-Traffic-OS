# Operations Center Guide

## Visao Geral

O Organic Operations Center (OOC) monitora continuamente toda a plataforma em tempo real.

## Componentes Monitorados

### Infraestrutura
- Next.js Server
- Database (Supabase)
- Storage (Supabase)

### Runtime
- ORE (Runtime Engine)
- OWO (Workflow Orchestrator)
- OMP (Mission Planner)
- OEB (Event Bus)
- Scheduler & Jobs

### Conectores
- OCH (Connector Hub)
- Google Search Console
- Google Analytics 4
- Google Trends
- Bing Webmaster
- WordPress
- Headless CMS
- Newsletter

### IA
- AIL (AI Intelligence Layer)
- Content Intelligence
- Semantic Intelligence
- Authority Intelligence
- Opportunity Intelligence
- Predictive Intelligence

## Health Center

Cada componente reporta:
- Status (healthy/degraded/unhealthy/offline)
- Disponibilidade (%)
- Uptime (segundos)
- Latencia (ms)
- Utilizacao (%)
- Versao
- Ambiente

## Alertas

### Classificacao
- **Info**: Informativo
- **Warning**: Atencao
- **High**: Alto
- **Critical**: Critico
- **Emergency**: Emergencia

### Fontes Comuns
- Agent parado
- Worker offline
- Queue congestionada
- Connector indisponivel
- API com erro
- Publicacao falhou
- Alto consumo de IA
- Crescimento de custos

## Incidentes

### Prioridades
- Low
- Medium
- High
- Critical

### Estados
- Open
- Investigating
- Resolved
- Closed

## API

### Status
```bash
curl /api/organic-os/operations/status
```

### Health
```bash
curl /api/organic-os/operations/health
```

### Alertas
```bash
curl /api/organic-os/operations/alerts
```

### Incidentes
```bash
curl /api/organic-os/operations/incidents
```

### Recheck
```bash
curl -X POST /api/organic-os/operations/recheck
```
