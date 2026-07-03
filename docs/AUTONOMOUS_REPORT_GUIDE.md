# Autonomous Report Guide

## Estrutura do Relatorio

### Cabecalho
- ID da simulacao
- Status (idle/running/completed/failed)
- Periodo simulado

### Disponibilidade
- Percentual de dias concluidos com sucesso
- Meta: >95%

### Confiabilidade
- Percentual de missoes concluidas
- Meta: >90%

### Performance
- Tempo medio por dia
- Total de missoes
- Taxa de conclusao

### Consumo
- Total de tokens
- Custo total
- Custo medio por dia

### Problemas
- Lista de erros encontrados
- Severidade
- Modulos afetados

### Sugestoes
- Recomendacoes de melhoria
- Proximos passos

### Modulos Criticos
- Modulos que necessitam atencao
- Prioridade de correcao

## Exemplo de Relatorio

```json
{
  "simulationId": "sim-xxx",
  "status": "completed",
  "totalDays": 30,
  "availability": 96.7,
  "reliability": 92.3,
  "performance": {
    "avgDayMs": 8500,
    "totalMissions": 375,
    "completionRate": "92.3%"
  },
  "consumption": {
    "totalTokens": 225000,
    "totalCost": 2.25,
    "avgCostPerDay": 0.075
  },
  "problems": [],
  "suggestions": [
    "Sistema pronto para Producao"
  ]
}
```
