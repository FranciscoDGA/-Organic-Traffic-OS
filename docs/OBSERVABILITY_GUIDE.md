# Observability Guide

## Pilares de Observabilidade

### 1. Metricas
- Numeros quantificaveis
- Taxas, contadores, gauges
- Exemplos: requests/s, erro rate, latencia

### 2. Logs
- Eventos textuais
- Detalhes de operacoes
- Exemplos: access log, error log, audit log

### 3. Traces
- Rastro de requisicoes
- Fluxo entre componentes
- Exemplos: request trace, distributed trace

## Implementacao

### Metricas
- Prometheus format
- Exportacao para dashboards
- Alertas baseados em metricas

### Logs
- JSON estruturado
- Niveis: debug, info, warn, error, fatal
- Correlacao por request ID

### Traces
- OpenTelemetry
- Context propagation
- Sampling inteligente

## Navegacao

### Visao Geral
- Dashboard consolidado
- Metricas principais
- Alertas ativos

### Detalhe por Componente
- Health individual
- Metricas especificas
- Logs recentes

### Detalhe por Requisicao
- Trace completo
- Timeline
- Logs correlacionados

## Ferramentas

### Dashboards
- Grafana
- Next.js Dashboard
- Custom pages

### Logs
- Structured logging
- Log aggregation
- Search e filtro

### Traces
- Jaeger
- Zipkin
- Custom visualization
