# Bucket Policy Guide

Este documento detalha o funcionamento e a aplicação das políticas de segurança dos buckets do Supabase Storage.

---

## 1. Buckets Públicos vs Privados

### Buckets Públicos (Imagens, Ativos Visuais)
- Permitem leitura pública anônima.
- Os URLs de arquivos gerados são estáticos e acessíveis por qualquer visitante externo.
- **Buckets**: `images`, `generated-images`, `workspace-assets`.

### Buckets Privados (Dados Operacionais, Relatórios, Backups)
- Bloqueiam acesso público.
- Exigem autenticação ou links assinados com expiração de tempo.
- **Buckets**: `articles`, `drafts`, `reports`, `playbooks`, `logs`, `backups`, `exports`, `imports`, `temporary`, `videos`, `ebooks`, `datasets`.

---

## 2. Regras de Tamanho Máximo de Arquivos (Tabela)

| Bucket | Limite Recomendado | Allowed MIME Types |
|---|---|---|
| `images` | 5 MB | `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg` |
| `generated-images`| 10 MB | `.jpg`, `.jpeg`, `.webp` |
| `articles` / `drafts`| 1 MB | `.md`, `.html`, `.json` |
| `logs` / `reports` | 10 MB | `.txt`, `.json`, `.pdf` |
| `backups` | 100 MB | `.zip`, `.sql`, `.json` |
| `exports` / `imports`| 50 MB | `.csv`, `.xlsx`, `.json` |
| `videos` | 100 MB | `.mp4`, `.webm` |
| `ebooks` | 200 MB | `.pdf`, `.epub` |
