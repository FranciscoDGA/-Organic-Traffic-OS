# AI Agency OS - Architecture V2

## Overview
A arquitetura V2 marca a transição do Organic Traffic OS de um projeto independente para um módulo (plugin) dentro do **AI Agency OS**.

O objetivo dessa refatoração é evitar a duplicação de lógicas de orquestração de IA, garantindo que futuros módulos (como CRM OS, Sales OS, Finance OS) possam aproveitar o mesmo motor.

## Componentes

### 1. Camada Shared (`/shared`)
A infraestrutura base, completamente agnóstica ao contexto de SEO ou Tráfego.

- **Shared Runtime (`/shared/runtime`)**: O motor principal da aplicação. Responsável por inicializar os módulos carregados e manter o status geral do sistema.
- **Shared Dispatcher e Executor (`/shared/dispatcher`, `/shared/executor`)**: Encarregados de rotear os `intents` e disparar a execução de qualquer agente registrado.
- **Shared Agent Registry (`/shared/registry`)**: Registro central onde cada módulo cadastra seus agentes compatíveis usando o `AgentManifest`.
- **Shared AI Provider (`/shared/providers`)**: Camada de abstração que esconde a implementação específica das APIs (OpenAI, Gemini).
- **Knowledge Core (`/shared/knowledge`)**: O cérebro da agência, permitindo que as personas, regras da empresa, tom de voz e dados sobre os produtos sejam compartilhados por todos os módulos.

### 2. Módulo Específico (`/organic-traffic-os`)
A camada de domínio. Tudo aqui é focado puramente em gerar e gerenciar Tráfego Orgânico.

- **`module.json`**: Manifesto que declara as dependências e o conteúdo do módulo (agentes, workflows, rotas exigidas e permissões).
- **Domínios (Research, SEO, Content, Analytics)**: Contêm os agentes especializados (ex: `Discovery Agent`), prompts específicos, validadores e lógicas de negócios.

## Fluxo de Dados

1. **AI Agency OS (Next.js App Router)**: O usuário dispara uma ação através das rotas `/organic-os/...` ou das APIs (`/api/organic-os/...`).
2. **Shared Runtime**: As requisições interagem diretamente com o `SharedRuntime` ou com o `SharedAgentDispatcher`.
3. **Agent Executor**: Identifica a qual módulo o agente pertence no `SharedAgentRegistry` e dispara a execução validando o Input Schema.
4. **Shared AI Provider**: O executor solicita uma geração passando o Prompt e o provedor escolhido (`default_provider`), devolvendo a resposta estruturada.
5. **Módulo de Tráfego**: A resposta retorna para as funções específicas de domínio (`organic-traffic-os`), onde é consumida pela lógica de SEO e repassada ao frontend.

## Benefícios Alcançados
- **Reusabilidade Absoluta**: Criar o `CRM OS` amanhã será apenas uma questão de criar a pasta `/crm-os`, definir um `module.json` e registrar novos agentes.
- **Padronização**: Todos os agentes agora respeitam o `AgentManifest`, unificando a forma como timeout, fallback e dependências são gerenciados.
- **Escalabilidade Técnica**: O código base da orquestração está 100% isolado de regras de SEO, o que facilita manutenções e auditorias na infraestrutura de IA.
