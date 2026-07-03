# Schema Reference Manual

Este documento serve como referência técnica detalhada sobre as tabelas criadas no banco de dados e a divisão modular dos schemas.

---

## 1. Módulos e Schemas

O banco está dividido logicamente em 16 schemas para garantir isolamento e organização limpa de conceitos:

| Schema | Módulo | Descrição |
|---|---|---|
| `core` | Core OS | Cadastro de usuários, permissões globais e papéis. |
| `workspaces`| Workspaces | Configurações, perfis e regras individuais por blog. |
| `missions` | Mission Control| Orquestração de tarefas, planos de execução e histórico. |
| `agents` | Agentes | Registro de manifestos e sessões ativas (heartbeats). |
| `campaigns` | Campanhas | Agrupamento de tarefas promocionais e editoriais. |
| `publisher` | Publicador | Fila assíncrona de deploys e logs de postagem. |
| `knowledge` | Knowledge Core | Grafo de entidades e relacionamentos de nicho. |
| `memory` | Memória | Cache chave-valor dinâmico para agentes e workflows. |
| `playbooks` | Playbooks | Fluxos operacionais padrão (SOPS) dos robôs. |
| `business` | BI / Métricas | KPIs de conversão, custos e retorno do ecossistema. |
| `analytics` | Analytics | Registro de eventos operacionais da interface e worker. |
| `events` | Event Bus | Barramento imutável de eventos gerais (Event Sourcing). |
| `runtime` | Worker Runtime | Gerenciamento de filas de jobs e processos de segundo plano. |
| `audit` | Auditoria | Logs de auditoria forense por IP, ator e ação. |
| `security` | Segurança | Gerenciamento de API keys e incidentes de segurança. |
| `settings` | Configurações | Feature flags e configurações de sistema global. |

---

## 2. Padrão de Campos Comuns

Praticamente todas as tabelas implementam a seguinte estrutura de campos:

- `id`: Identificador único no formato `UUID`.
- `workspace_id`: Chave estrangeira referenciando o workspace proprietário (nulo para registros do sistema).
- `status`: String livre ou enum indicando o estado (`active`, `inactive`, `draft`, `pending`, etc).
- `created_at` / `updated_at`: Timestamps automáticos (com triggers de sincronização de updates).
- `created_by`: UUID do usuário criador.
- `version`: Inteiro incremental para controle de concorrência otimista.
- `metadata`: Objeto `JSONB` aberto para guardar dados estruturados variáveis sem quebrar o schema.
