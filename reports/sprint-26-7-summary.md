# Sprint 26.7 — Review Agent V1

## O Que Foi Criado
O sexto agente da arquitetura: **Review Agent**. Sua função é atuar como o editor final, verificando a qualidade gramatical, coesão, tom de voz e aderência aos dados dos agentes anteriores antes que qualquer coisa possa ser publicada.

## Arquitetura do Review Report
O Agente consome o `Draft Pack` e gera o **Review Report**, composto por:
- **Quality Score**: Uma métrica detalhada de 0 a 100 baseada em Clareza, Didática, Cobertura, Uso de Fatos e Tom de Voz.
- **Checklist Editorial**: Uma matriz de validação rígida (H2 presentes, CTA, FAQ, Conclusão).
- **Warnings & Recommendations**: Avisos bloqueantes (como a falta de um FAQ obrigatório) e sugestões de melhoria textual.
- **Status**: `approved` ou `revision_requested`.

## O Pipeline Expandido
Agora a cadeia é capaz de ir da ideia até a revisão de forma autônoma:
```
Discovery → Planning → Research → Fact → Writer → Review Agent
```
*Se a revisão falhar, o status do Draft volta com warnings para que o Writer corrija na próxima iteração (isso será feito no Workflow Agent posteriormente).*

## UI Premium
O painel Dark Mode conta com 3 abas focadas em dados e validação:
1. **Quality Score**: Radial com nota final em destaque e barras de progresso para cada métrica individual.
2. **Checklist Editorial**: Painel de conferência em formato "grid" exibindo os checkboxes.
3. **Recomendações**: Painel de alertas que exibe `warnings` vermelhos se houverem bloqueios e dicas úteis em azul/cinza.

## Próximos Passos
Toda a cadeia de produção de conteúdo está completa. O rascunho nasce seguro (Fact Agent) e sai polido (Review Agent). O próximo passo (Sprint 26.8) será o **Publisher Agent**, responsável por colocar o post aprovado no ar via Webhook ou API do CMS.
