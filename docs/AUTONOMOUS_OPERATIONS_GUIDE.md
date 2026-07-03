# Autonomous Operations Guide

## Visao Geral

O sistema Autonomous Operations Validation (AOV) permite validar a capacidade do Organic Traffic OS de operar de forma autonoma durante periodos prolongados.

## Cenarios de Simulacao

### Sandbox (Recomendado)
- 30 dias operacionais
- Sem intervencao humana
- Dados de teste
- Publicacoes simuladas

### Staging
- Validacao final antes de Producao
- Dados reais de teste
- Publicacoes nao enviadas

## Fluxo de Execucao

1. Configurar workspace(s) e periodo
2. Iniciar simulacao
3. Sistema executa ciclos diarios automaticamente
4. Cada dia gera missoes, executa workflows, atualiza BI
5. Relatorio consolidado apos conclusao

## Workspaces

| Workspace | Missoes/Dia | Foco |
|-----------|-------------|------|
| PassaCumaru | 2.5 | Concursos, Edital |
| Qual o Seguro | 3.0 | Seguros, Comparativo |
| UtilPro Brasil | 2.0 | Ferramentas, Review |
| Tabuometro | 3.5 | Analise, Editorial |
| AI Agency OS | 1.8 | IA, Estudo de Caso |

## Metricas

- Missoes executadas/concluidas
- Tempo medio por missao
- Custo total e por workspace
- Tokens utilizados
- Erros e retries
- Publicacoes simuladas

## Resiliencia

O sistema valida automaticamente:
- Retry com backoff exponencial
- Timeout por operacao
- Failover entre workspaces
- Circuit Breaker
- Dead Letter Queue
- Heartbeat
- Recuperacao automatica

## API

### Iniciar Simulacao
```bash
curl -X POST /api/organic-os/autonomous/start \
  -H "Content-Type: application/json" \
  -d '{"totalDays": 30, "mode": "sandbox"}'
```

### Verificar Health
```bash
curl /api/organic-os/autonomous/health
```

### Obter Relatorio
```bash
curl /api/organic-os/autonomous/report?id=<sim-id>
```
