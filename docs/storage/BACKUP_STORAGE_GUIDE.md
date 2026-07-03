# Backup Storage Guide

Este documento orienta sobre a retenção de cópias de segurança (backups), exportações e datasets estruturados no Supabase Storage.

---

## 1. Bucket `backups` (Privado)

- **Propósito**: Armazena backups compactados do banco de dados PostgreSQL e dos arquivos estáticos.
- **Acesso**: Restrito exclusivamente a conexões seguras e service role do administrador. Leitura externa é estritamente bloqueada.
- **Extensões**: `.zip`, `.sql`, `.json`.

---

## 2. Bucket `exports` & `imports` (Privados)

- **Propósito**: Guarda arquivos de exportação e importação manual de pautas, dados de performance ou leads (ex: `.csv`, `.xlsx`, `.json`).
- **Retenção**: Recomenda-se configurar uma regra de ciclo de vida (Life Cycle Rule) no Supabase para limpar arquivos do bucket `temporary` e `exports` com mais de 30 dias de criação para economizar armazenamento.
