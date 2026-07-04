# Sprint 83 — Organizational Knowledge & Playbook System V1

Este documento descreve a arquitetura do sistema de Playbooks e gestão do patrimônio intelectual permanente de cada Workspace do Organic Traffic OS.

---

## 1. Arquitetura do Sistema de Playbooks

O **Organizational Knowledge & Playbook System** transforma erros e acertos operacionais coletados em guias de execução táticos permanentes para os agentes. O sistema está localizado no core operacional do sistema:

- [playbook.types.ts](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/src/core/playbooks/playbook.types.ts): Define a estrutura do Playbook, incluindo o versionamento e histórico de aprovação.
- [playbook.service.ts](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/src/core/playbooks/playbook.service.ts): Centraliza operações CRUD (`createPlaybook`, `updatePlaybook`, `approvePlaybook`, `searchPlaybooks`, `recommendPlaybooks`).
- **Regra de Governança Estrita**: Nenhum playbook é aceito na API ou no banco de dados sem uma evidência empírica preenchida.

---

## 2. Tipos de Playbooks Suportados

A engine suporta 12 tipos de procedimentos táticos:
- **SEO & Conteúdo**: Comprovação de melhorias de bounce rate e posicionamento SERP.
- **Campanhas & Jornadas**: Estruturação de fluxos de CTAs de alta conversão.
- **Agentes & Workflows**: Ajuste fino de prompts e regras operacionais.
- **Atendimento, Conversão, Publicação, Growth e Operação**.

---

## 3. Integração com Agentes Autônomos (Memory & Knowledge Graph)

Os agentes autônomos consultam Playbooks marcados como `status: "approved"` na base de conhecimento antes de iniciar Missões ou propor campanhas editoriais.
- **Ciclo de Atualização**: Toda nova pauta concluída com sucesso alimenta as métricas do Playbook original, atualizando a confiança do agente na recomendação (alimentando a Memory exclusiva e o Knowledge Graph).
