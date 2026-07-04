# Sprint 92 — Organic Bridge: PassaCumaru V1

**Data:** 3-4 de Julho de 2026
**Status:** ✅ Concluída

---

## Entregáveis

### PassaCumaru — Organic Bridge Endpoints

Criados em `api/organic-publisher/`:

- **`publish.ts`** → `POST /api/organic-publisher/publish`
  - Valida secret, workspace, payload obrigatório, formato de slug
  - Bloqueia slug duplicado
  - Cria draft (nunca publica automaticamente)
  - Retorna id, slug, status e preview_url

- **`approve.ts`** → `POST /api/organic-publisher/approve`
  - Aprovação manual: draft → published
  - Valida secret e workspace
  - Registra published_at e retorna public_url

- **`logs.ts`** → `GET /api/organic-publisher/logs`
  - Trilha de auditoria de todas as ações do Organic Bridge

### PassaCumaru — Infraestrutura

- **`api/revalidate.ts`** → `POST /api/revalidate`
  - Registra revalidação com REVALIDATE_SECRET

- **`organic.config.ts`** — Configuração central do Organic Bridge
  - auto_publish: false, require_approval: true

- **`src/pages/OrganicPublisherAdminPage.tsx`**
  - Painel administrativo em `/admin/organic-publisher`
  - Autenticação por secret
  - Listagem de rascunhos com botão "Publicar Manualmente"
  - Aba de Logs de auditoria

- **`ORGANIC_BRIDGE_PASSACUMARU.md`** — Documentação completa do Bridge

### Organic Traffic OS — Adapter

- **`adapters/passacumaru-adapter.ts`** — Já criado na Sprint 91 para completar o ciclo

---

## Fluxo Implementado

```
Organic Traffic OS → POST passacumaru/api/organic-publisher/publish
  → Validação completa (secret, workspace, slug, campos)
  → Draft criado com status = 'draft'
  → preview_url retornado

Operador acessa /admin/organic-publisher
  → Revisa rascunho
  → Clica "Publicar Manualmente"
  → POST /api/organic-publisher/approve
  → Status = published | URL pública gerada
```

---

## Segurança Implementada

- [x] Bloqueio sem secret
- [x] Bloqueio workspace diferente de passacumaru
- [x] Bloqueio payload incompleto
- [x] Bloqueio slug duplicado
- [x] Auto-publicação desativada
- [x] Logs de toda tentativa inválida

---

## Próximo Passo Recomendado

Para persistência dos rascunhos além do restart da função serverless, integrar com tabela `organic_drafts` no Supabase do PassaCumaru na Sprint 93+.
