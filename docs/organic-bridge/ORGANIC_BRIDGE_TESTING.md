# Organic Bridge Testing Guide

Este documento contém exemplos de comandos `curl` e scripts para testar localmente todos os endpoints da **Organic Bridge**.

---

## 1. Testar Recebimento de Rascunho (Publish Draft)

```bash
curl -X POST http://localhost:3000/api/organic-publisher/publish \
  -H "Content-Type: application/json" \
  -H "x-organic-publisher-secret: mock_secret_bridge_123" \
  -H "x-organic-workspace-id: passacumaru" \
  -d '{
    "workspace_id": "passacumaru",
    "content_id": "uuid-artigo-102",
    "title": "Artigo Teste Local",
    "slug": "artigo-teste-local",
    "excerpt": "Excerpt de teste",
    "html": "<p>Conteúdo de teste</p>",
    "markdown": "# Conteúdo de teste",
    "status": "draft",
    "featured_image": {
      "url": "https://images/concurso.webp",
      "alt": "Imagem Concurso"
    }
  }'
```

---

## 2. Testar Atualização de Conteúdo (Update)

```bash
curl -X POST http://localhost:3000/api/organic-publisher/update \
  -H "Content-Type: application/json" \
  -H "x-organic-publisher-secret: mock_secret_bridge_123" \
  -d '{
    "workspace_id": "passacumaru",
    "content_id": "uuid-artigo-102",
    "title": "Artigo Teste Local Atualizado",
    "html": "<p>HTML atualizado</p>",
    "markdown": "# Markdown atualizado"
  }'
```

---

## 3. Testar Exclusão Lógica (Delete/Archive)

```bash
curl -X POST http://localhost:3000/api/organic-publisher/delete \
  -H "Content-Type: application/json" \
  -H "x-organic-publisher-secret: mock_secret_bridge_123" \
  -d '{
    "workspace_id": "passacumaru",
    "content_id": "uuid-artigo-102"
  }'
```

---

## 4. Testar Revalidação de Cache (Revalidate)

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: mock_revalidate_secret_123" \
  -d '{
    "path": "/organic-publisher/preview/artigo-teste-local",
    "revalidate_home": true
  }'
```
