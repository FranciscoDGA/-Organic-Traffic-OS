# BLOG ENDPOINT CONTRACT — Organic Traffic OS v1.0

## Introdução

Este documento define o contrato de API que cada blog deve implementar para receber publicações do Organic Traffic OS via **Organic Bridge**.

---

## Endpoints Obrigatórios

### 1. Receber Conteúdo (Draft)
```
POST /api/organic-publisher/publish
```

**Headers obrigatórios:**
```
Content-Type: application/json
x-organic-secret: {ORGANIC_PUBLISHER_SECRET}
x-workspace-id: {workspace_id}
```

**Payload:**
```json
{
  "workspace_id": "passacumaru",
  "content_id": "c-001",
  "title": "Título do Artigo",
  "slug": "titulo-do-artigo",
  "excerpt": "Resumo breve do artigo",
  "html": "<h1>Título</h1><p>Conteúdo...</p>",
  "markdown": "# Título\n\nConteúdo...",
  "seo": {
    "title": "SEO Title | Blog Nome",
    "description": "Meta description do artigo.",
    "canonical": "https://www.blog.com.br/artigo/titulo-do-artigo"
  },
  "schema": {},
  "category": "Nome da Categoria",
  "tags": ["tag1", "tag2"],
  "status": "draft",
  "author": "Organic Traffic OS"
}
```

**Resposta esperada (sucesso):**
```json
{
  "id": "draft-c-001",
  "slug": "titulo-do-artigo",
  "status": "draft",
  "preview_url": "https://www.blog.com.br/preview/titulo-do-artigo"
}
```

---

### 2. Aprovação Manual
```
POST /api/organic-publisher/approve
```

**Payload:**
```json
{
  "content_id": "c-001",
  "workspace_id": "passacumaru"
}
```

**Resposta esperada:**
```json
{
  "status": "published",
  "public_url": "https://www.blog.com.br/artigo/titulo-do-artigo"
}
```

---

### 3. Revalidação Vercel
```
POST /api/revalidate
```

**Payload:**
```json
{
  "secret": "{REVALIDATE_SECRET}",
  "path": "/artigo/titulo-do-artigo"
}
```

---

## Segurança Obrigatória

Todo endpoint do blog deve:
1. Rejeitar requisições sem `x-organic-secret` válido
2. Validar que `workspace_id` corresponde ao blog
3. Bloquear slugs duplicados sem confirmação explícita
4. Nunca publicar automaticamente — somente criar draft
5. Registrar toda tentativa inválida nos logs

---

## Variáveis de Ambiente

```env
ORGANIC_PUBLISHER_SECRET=seu-secret-aqui
ORGANIC_ALLOWED_WORKSPACE=passacumaru
ORGANIC_ALLOWED_ORIGIN=https://organic-traffic-os.vercel.app
REVALIDATE_SECRET=seu-revalidate-secret
```

---

## Adicionando a um Novo Blog

1. Criar arquivo `organic.config.ts` na raiz do projeto
2. Criar endpoint `src/app/api/organic-publisher/publish/route.ts`
3. Criar endpoint `src/app/api/organic-publisher/approve/route.ts`
4. Criar endpoint `src/app/api/revalidate/route.ts`
5. Criar rota de preview `/app/preview/[slug]/page.tsx`
6. Configurar variáveis de ambiente no projeto (Vercel)
7. Informar as URLs dos endpoints nas variáveis de ambiente do Organic Traffic OS
