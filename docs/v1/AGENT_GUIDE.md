# AGENT GUIDE — Organic Traffic OS v1.0

## O que são os Agents

Os Agents são módulos de IA especializados que executam tarefas específicas dentro de cada Missão. Cada agent tem um propósito único e não pode substituir o trabalho de outro.

## Agents Disponíveis

| Agent | Função | Dashboard |
|---|---|---|
| Discovery Agent | Identifica oportunidades de palavras-chave | `/organic-os/agents/discovery` |
| Planning Agent | Cria briefs estratégicos de conteúdo | `/organic-os/agents/planning` |
| Research Agent | Pesquisa profunda de tópicos e fontes | `/organic-os/agents/research` |
| Fact Agent | Verifica precisão factual do conteúdo | `/organic-os/agents/fact` |
| Writer Agent | Redige o conteúdo editorial | `/organic-os/agents/writer` |
| Review Agent | Revisa qualidade e SEO do rascunho | `/organic-os/agents/review` |
| Visibility Agent | Otimiza para busca e AI Visibility | `/organic-os/agents/visibility` |
| Publishing Agent | Prepara e publica o conteúdo aprovado | `/organic-os/agents/publishing` |
| Monitoring Agent | Monitora performance pós-publicação | `/organic-os/agents/monitoring` |

## Regras de Operação dos Agents

1. **Nenhum agent publica sem aprovação humana**
2. **O Fact Agent deve ser executado antes do Writer Agent em conteúdo técnico**
3. **O Review Agent deve sempre processar o output do Writer Agent**
4. **Agents podem ser pausados, retomados ou cancelados a qualquer momento**

## Monitorar Workers (Agents em Execução)

Acessar `/organic-os/orchestrator` para ver:
- Workers ativos
- Jobs em fila
- Histórico de execuções
- Logs de cada Worker
