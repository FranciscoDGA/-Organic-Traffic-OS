# Technical Debt

Este documento lista os débitos técnicos e refatorações planejadas para futuras sprints de estabilização da plataforma.

---

## 1. Centralização de Tipagens
- **Débito**: Tipagens duplicadas nos serviços de BI e recomendações executivas.
- **Melhoria**: Consolidar todas as tipagens em `@types/organic-os` para simplificar importações profundas.

---

## 2. Testes Unitários Físicos
- **Débito**: A maioria das validações utiliza simulações integradas.
- **Melhoria**: Aumentar a cobertura de testes unitários com mocks do SDK do Vercel e Supabase na Epic 13.
