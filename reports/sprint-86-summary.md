# Sprint 86 — Executive Weekly Review & Continuous Operations V1

Este documento descreve a arquitetura do ciclo de revisão semanal e auditoria contínua de operações do Organic Traffic OS.

---

## 1. Arquitetura do Ciclo Semanal (Weekly Review)

A engine de revisão semanal consolida os resultados obtidos por cada blog isoladamente no final da semana ativa. Ela reside no core analítico da aplicação:

- [weekly-review.service.ts](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/src/services/weekly-review.service.ts): Serviço central de consolidação de relatórios e telemetria operacional semanal.
- **Isolamento de Dados**: Garante que os dados de tráfego, leads, custos de IA e orçamentos remanescentes de cada Workspace (AI Agency OS, PassaCumaru, UtilPro, Qual o Seguro, Tabuômetro) sejam exibidos e comparados lado a lado, sem misturar chaves ou dados internos proprietários de cada inquilino (Workspace).

---

## 2. Operação Contínua (Continuous Operations)

O motor do Weekly Review valida o andamento contínuo da infraestrutura:
- **Retomada de Missões**: Detecta missões interrompidas devido a timeouts de conectores e efetua a retomada automática de execução.
- **Workers & Orçamentos**: Exibe a contagem de workers ativos e o orçamento restante em moeda nacional (BRL) e em tokens (USD) consumidos nas APIs de IA para garantir a continuidade operacional.
