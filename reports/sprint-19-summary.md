# Sprint 19 - Content Quality Review Engine V1

## Resumo
A Sprint 19 consolidou o Validador Editorial principal do sistema. Uma vez que o `Draft Writer` finaliza o trabalho bruto, o `Quality Review Engine` realiza a auditoria literária e argumentativa (sem tocar no SEO final).

## Arquitetura de Validação
O motor consulta ativamente os objetos `Brief`, `Blueprint`, `Facts` e `Strategy`. 
A nota (`quality-scores.json`) é gerada avaliando critérios puramente humanos simulados:
- Clareza
- Aderência (se a IA fugiu do tema)
- Confiabilidade (uso exato das fontes oficiais)
- Coerência Narrativa

Textos que recebem `Score < 80` entram em `needs_review` ou `rejected` e forçam o Workflow Orchestrator a disparar um retrabalho no Draft Writer Engine, com base nas `recomendacoes` inseridas pelo Quality Review Engine.
