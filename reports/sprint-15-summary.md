# Sprint 15 - Content Workflow Orchestrator V1

## Resumo
A Sprint 15 uniu todas as Engines previamente desenvolvidas debaixo do guarda-chuva do **Content Workflow Orchestrator**. Nenhuma Engine opera sozinha mais; todas respondem ao Maestro.

## Arquitetura
Localizado em `organic-traffic-os/orchestrator/`, o orquestrador possui uma Máquina de Estados (Pending, Running, Paused, etc.) e um modelo rígido de Pipeline sequencial com as 12 etapas do projeto.

## Tratamento de Erros
Se uma Engine falhar, a política de retries (`retry-policy.json`) entrará em ação, aplicando repetições antes de marcar o Pipeline como `Failed`. Os fluxos podem ser pausados, retomados ou cancelados diretamente pelas APIs recém criadas.
