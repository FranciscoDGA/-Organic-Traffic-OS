# Sprint 95 — Organic Bridge: Tabuômetro V1

**Status:** ✅ Concluída

---

## Entregáveis no Organic Traffic OS

### 1. Adapter: Tabuômetro
Criado `src/core/universal-publisher/adapters/tabuometro-adapter.ts` contendo:
- Payload estendido focado em editoriais (`editorial_category`, `subtitle`, `featured`, `featured_image`, `gallery`, `faq`, `cta`, `references`, `estimated_read_time_minutes`, `editorial_series`).
- Validação automática obrigando a inclusão de uma categoria editorial.

### 2. Endpoints da API (Organic OS Side)
Criados em `src/app/api/organic-os/tabuometro/`:
- `GET /editorials`
- `GET /series`
- `GET /categories`
- `POST /publish`

### 3. Integração
- Workspace integrado no Universal Publisher, com configuração manual ou automática (por padrão Manual) visando resguardar a identidade editorial.
