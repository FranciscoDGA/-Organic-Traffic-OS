# Resumo da Sprint 01.8 - Arquitetura do Exército de Agentes

## O que foi construído
Nesta sprint, implementamos a fundação para o **Organic Traffic OS** orquestrar múltiplos agentes de IA. A arquitetura central foi desenhada para permitir a adição escalável de novos agentes de forma organizada e rastreável.

A arquitetura engloba os seguintes componentes:

1. **Agent Registry**: Um registro central (`organic-traffic-os/lib/agent-registry.ts`) que lista todos os agentes do sistema, definindo seu ID, função, descrição, schemas e provider de IA padrão.
2. **Agent Dispatcher**: O roteador (`organic-traffic-os/lib/agent-dispatcher.ts`) que recebe uma intenção (`intent`) e decide qual agente no registro deve executá-la.
3. **Agent Executor**: O motor de execução (`organic-traffic-os/lib/agent-executor.ts`) que gerencia a chamada ao agente (simulado nesta fase) e centraliza a gravação de logs e resultados.
4. **Workflow Engine**: Uma máquina de fluxos (`organic-traffic-os/lib/workflow-engine.ts`) que permite compor múltiplos agentes em sequência (como o `organic_content_pipeline_v1`).

## Execução Simulada
Para respeitar as diretrizes da sprint, toda a execução está sendo simulada com mockups assíncronos no momento. **Nenhuma IA real está sendo chamada**. Isso permitiu focar inteiramente na comunicação de arquitetura e na estrutura de dados (tipagens globais em `organic-traffic-os/types.ts`).

## Endpoints e Painel
Criamos as seguintes APIs para expor a arquitetura para o frontend:
- `GET /api/organic-os/agents`: Lista os agentes.
- `POST /api/organic-os/agents/dispatch`: Dispara um agente único.
- `POST /api/organic-os/workflows/run`: Executa um pipeline sequencial completo.

O frontend (`/organic-os`) foi criado com Tailwind e React Hooks para exibir a frota ativa e permitir o acionamento do simulador de workflow.

## Próximos Passos
- Conectar Supabase no Dispatcher/Executor para salvar e consultar filas de tarefas (`tasks`).
- Integrar APIs reais de LLM (ex: Google Gemini, OpenAI) no Executor de acordo com o `default_provider` do Agente.
- Iniciar o desenvolvimento de lógicas reais para agentes específicos (como o Discovery Agent na Sprint 26.2).
