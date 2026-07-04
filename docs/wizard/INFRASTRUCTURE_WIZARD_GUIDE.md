# Infrastructure Wizard Guide

O **Infrastructure Wizard** é o assistente interativo inteligente projetado para acompanhar o administrador no provisionamento, conexão de APIs e deploy inicial do Organic Traffic OS.

---

## 1. Funcionamento Técnico

- **Leitura do Validator**: O Wizard consome a API do `InfrastructureValidatorService` em tempo real para detectar automaticamente o preenchimento correto de chaves e endpoints.
- **Marcação Manual**: Etapas de verificação humana (ex: checklist de lançamento ou confirmação de domínio) podem ser marcadas como resolvidas no painel, salvando o progresso de forma persistente em memória.
- **Manifest do Assistente**: O arquivo [wizard.manifest.json](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/src/infrastructure/wizard/wizard.manifest.json) define os metadados do fluxo (ex: total de passos e tempo estimado).
- **APIs de Status**:
  - `GET /api/setup`: Status geral contendo readiness scores.
  - `GET /api/setup/steps`: Relação de etapas do wizard.
  - `POST /api/setup/complete-step`: Conclui manualmente um item de checklist.
