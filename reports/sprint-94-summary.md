# Sprint 94 — Organic Bridge: UtilPro Brasil V1

**Status:** ✅ Concluída

---

## Entregáveis no Organic Traffic OS

### 1. Adapter: UtilPro
Criado `src/core/universal-publisher/adapters/utilpro-adapter.ts` contendo:
- Payload estendido (`product_name`, `brand`, `price_range`, `pros`, `cons`, `rating`, `affiliate_links`, `comparison_table`, `faq`, `cta`, `disclaimer`).
- Validação automática obrigando disclaimer em casos de links de afiliado.

### 2. Endpoints da API (Organic OS Side)
Criados em `src/app/api/organic-os/utilpro/`:
- `GET /products`
- `GET /reviews`
- `GET /comparisons`
- `POST /publish`

### 3. Integração com Universal Publisher
- O Workspace "UtilPro Brasil" já consta nativamente na lista do painel `publisher`, permitindo troca de modo (Automático/Manual).

---

## Observações de Segurança e Compliance

- O envio só é feito caso exista `x-organic-secret` válido e endpoint configurado no `.env` do Organic Traffic OS (`UTILPRO_PUBLISH_ENDPOINT`, `UTILPRO_PUBLISH_SECRET`).
- O disclaimer obrigatório de afiliação garante que nenhum artigo seja publicado contra as diretrizes de transparência e políticas do Google AdSense e programas de afiliados.
