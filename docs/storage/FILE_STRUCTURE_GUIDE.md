# File Structure Guide

Este guia padroniza a organização interna de diretórios e arquivos dentro de todos os buckets do Organic Traffic OS.

---

## 1. Padrão de Caminho de Arquivos

Para garantir isolamento rigoroso entre múltiplos workspaces e facilidade de depuração, todo arquivo deve seguir este padrão de subpastas:

```
[workspace_id]/[content_id]/[file_name].[extension]
```

### Exemplos Práticos:

- **Imagem Destacada no blog PassaCumaru**:
  `passacumaru/artigo-001/featured-image.webp`
- **Rascunho de Conteúdo no UtilPro**:
  `utilpro/artigo-102/draft.md`
- **Relatório de SEO gerado em Staging**:
  `passacumaru/artigo-001/seo-audit-report.json`

---

## 2. Padrões de Extensões Permitidas por Categoria

- **Imagens**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`
- **Documentos**: `.pdf`, `.md`, `.txt`, `.json`
- **Vídeos**: `.mp4`, `.webm`
- **Exports**: `.csv`, `.xlsx`, `.json`
- **Backups**: `.zip`, `.sql`, `.json`
