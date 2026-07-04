# UNIVERSAL PUBLISHER GUIDE — Organic Traffic OS v1.0

## O que é o Universal Publisher

O Universal Publisher é o módulo responsável por enviar conteúdos aprovados do Organic Traffic OS para os blogs via API segura (Organic Bridge).

Ele suporta dois modos de operação por workspace:
- **Manual**: Nenhuma publicação acontece sem clique humano explícito
- **Automático**: Publica somente se todos os gates de qualidade forem aprovados

---

## Como Publicar um Conteúdo

### 1. Enfileirar para Revisão
```http
POST /api/organic-os/publisher/publish
Content-Type: application/json

{
  "workspace_id": "passacumaru",
  "content_id": "c-001",
  "title": "Como estudar para concursos municipais",
  "slug": "como-estudar-para-concursos-municipais",
  "excerpt": "...",
  "html": "<h1>...</h1>...",
  "markdown": "# ...",
  "seo": { "title": "...", "description": "...", "canonical": "..." },
  "category": "Concursos",
  "tags": ["concurso", "estudo"],
  "status": "draft",
  "author": "Organic Traffic OS"
}
```

### 2. Verificar a Fila
```http
GET /api/organic-os/publisher/queue?workspace_id=passacumaru
```

### 3. Alterar o Modo de Publicação
```http
POST /api/organic-os/publisher/mode
{ "workspace_id": "passacumaru", "mode": "manual" }
```

---

## Critérios Mínimos de Publicação

Todo conteúdo deve atender **obrigatoriamente**:
- Título presente
- Slug válido (letras minúsculas, números e hífens)
- HTML com H1
- Categoria definida
- SEO Title + Meta Description + Canonical
- Mínimo de palavras configurado por workspace

---

## Adicionar o Organic Bridge a um Novo Blog

Ver: [BLOG_ENDPOINT_CONTRACT.md](./BLOG_ENDPOINT_CONTRACT.md)
