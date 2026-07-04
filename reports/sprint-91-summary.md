# Sprint 91 — Universal Publisher & Publishing Modes V1

**Data:** 3 de Julho de 2026
**Status:** ✅ Concluída

---

## Entregáveis

### Core: Universal Publisher (`src/core/universal-publisher/`)
- `publisher.types.ts` — Tipos de publicação: modos, status, payload, validação, configs
- `publisher-validator.ts` — Validação completa pré-publicação (campos, palavras, estrutura HTML, slug)
- `publisher-security.ts` — Segurança: autenticação por secret, workspace e origem
- `publisher.service.ts` — Serviço principal com fila, modos manual/automático e retry
- `adapters/passacumaru-adapter.ts` — Adapter Organic Bridge do PassaCumaru
- `publisher.manifest.json` — Manifest do módulo

### APIs (`/api/organic-os/publisher/`)
- `GET /api/organic-os/publisher` — Configurações dos workspaces
- `POST /api/organic-os/publisher/publish` — Enfileirar conteúdo
- `POST /api/organic-os/publisher/mode` — Alternar modo Manual/Automático
- `GET /api/organic-os/publisher/queue` — Fila de publicação
- `GET /api/organic-os/publisher/history` — Logs de auditoria
- `POST /api/organic-os/publisher/schedule` — Agendar publicação

### Dashboard: `/organic-os/publisher`
- Aba Workspaces com configuração de modo e botões de alternância
- Aba Fila com status e contagem de tentativas
- Aba Logs com trilha de auditoria por ação

### Documentação
- `UNIVERSAL_PUBLISHER_GUIDE.md` — Guia de uso do módulo
- `BLOG_ENDPOINT_CONTRACT.md` — Contrato de API para novos blogs

---

## Critérios Implementados

- [x] Mínimo de palavras configurável por workspace
- [x] Estrutura HTML (H1, H2, parágrafos) verificada
- [x] SEO Title, Meta Description e Canonical obrigatórios
- [x] Slug validado (formato kebab-case)
- [x] Autor obrigatório
- [x] Modo Manual: nunca publica sem clique humano
- [x] Modo Automático: publica apenas se todos os gates aprovarem
- [x] Falhas registradas em logs com retry count
- [x] Segurança por secret e workspace_id
