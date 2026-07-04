# Sprint 84 — Strategic Portfolio Planner V1

Este documento descreve o funcionamento e a modelagem do módulo **Strategic Portfolio Planner** implementado no Organic Traffic OS.

---

## 1. Arquitetura do Strategic Portfolio Planner

O **Strategic Portfolio Planner** fornece a lógica de orquestração e governança para desdobrar metas corporativas de longo prazo em planos de ação de curto prazo. Ele está estruturado da seguinte forma:

- [portfolio.types.ts](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/src/core/portfolio-planner/portfolio.types.ts): Define a interface do plano estratégico contendo horizontes, orçamentos, capacidades, prioridades semanais e riscos.
- [portfolio.service.ts](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/src/core/portfolio-planner/portfolio.service.ts): Oferece as funções operacionais:
  - `createAnnualPlan()`
  - `buildQuarterlyPlan()`
  - `generateMonthlyPlan()`
  - `prioritizeWeek()`
  - `reviewResults()`
  - `adjustPortfolio()` (Realiza readequação e preserva o histórico de replanejamento).
  - `forecastGoals()` (Gera previsões preditivas).

---

## 2. Horizontes de Planejamento

A engine realiza o planejamento através de 4 horizontes temporais estruturados:
- **Anual**: Direcionamento macro e objetivos corporativos (ex: Faturamento de R$ 500k).
- **Trimestral (Quarterly)**: Desdobramento das metas e orçamento reservado (Q1, Q2, Q3, Q4).
- **Mensal**: Organização de campanhas editoriais e atração de MQLs.
- **Semanal**: Prioridades micro das tarefas e alinhamento de recursos.

---

## 3. Preservação de Histórico de Alterações

Por regra estrita de negócio, todo ajuste ou replanejamento aciona o método `adjustPortfolio()`, que altera o status do plano para `replanned`, incrementa o orçamento/capacidade e anexa um registro contendo a descrição da alteração e data no campo de histórico (`history`).
