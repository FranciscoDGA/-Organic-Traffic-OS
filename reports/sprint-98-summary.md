# Sprint 98 — Opportunity Discovery & Content Intelligence (ODCI)

**Status:** ✅ Concluída

---

## Entregáveis no Organic Traffic OS

### 1. ODCI Service
Criado `src/core/content-intelligence/odci.service.ts` contendo:
- Sistema de pontuação baseado em (Impacto x Esforço x Confiança).
- Geração de relatórios por Workspace.
- Conversão de oportunidades em "Missões sugeridas" para o Mission Control.

### 2. Endpoints da API
Criados em `src/app/api/organic-os/opportunities/`:
- `GET /`
- `GET /workspace/[id]`
- `POST /create-mission`
- `GET /report`

### 3. Dashboard
- Criado painel em `/organic-os/opportunities`.
- Interface focada em cartões (cards) de oportunidades evidenciando o ROI esperado.
- Ações rápidas de "Sugerir Missão" conectando ao fluxo natural de aprovação humana.

### 4. Integração Arquitetural
- Este sistema alimenta a camada estratégica superior, impedindo que o Content Factory fique ocioso. Ele age como um curador ativo da performance de todas as propriedades.
