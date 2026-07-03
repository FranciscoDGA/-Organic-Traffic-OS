# ORGANIC BRIDGE — SETUP GUIDE FOR BLOGS

Este guia descreve como configurar os endpoints e segredos da **Organic Bridge** em cada blog individual conectado ao Organic Traffic OS.

---

## 1. Endpoints Criados

Cada blog precisa expor as seguintes rotas da API em seu respectivo domínio (ex: `https://meublog.com/api/...`):

### 1. `POST /api/organic-publisher/publish`
- **Função**: Recebe o payload do artigo contendo o HTML, metadados SEO, esquemas de dados (JSON-LD) e informações de imagem destacada e internas.
- **Comportamento**: Salva o artigo como um rascunho (`draft`) em modo manual por padrão.
- **Validações**:
  - Exige o header `x-organic-publisher-secret` correto.
  - Exige o header `x-organic-workspace-id` correspondente.
  - Valida se `featured_image` (url e alt) está presente no payload. Se não estiver, a publicação é bloqueada.
  - Valida se todas as imagens na lista `images` possuem o campo `alt` preenchido.

### 2. `POST /api/organic-publisher/approve`
- **Função**: Aprova e altera o status do artigo de rascunho (`draft`) para publicado (`published`).
- **Comportamento**: Altera o status no banco de dados e opcionalmente dispara a revalidação de caminhos estáticos.

### 3. `GET /api/organic-publisher/status`
- **Função**: Retorna o status atual do post nos blogs.
- **Parâmetros**: `?content_id=...`

### 4. `POST /api/revalidate`
- **Função**: Limpa o cache estático do Next.js (Incremental Static Regeneration) para forçar o artigo a aparecer online imediatamente.
- **Parâmetros**: Exige o header ou query `x-revalidate-secret` ou `secret`.

---

## 2. Variáveis de Ambiente a Configurar na Vercel (ou Hospedagem do Blog)

Configure as seguintes variáveis de ambiente nas configurações do painel da Vercel de cada blog individual:

```env
ORGANIC_PUBLISHER_SECRET="sua_chave_secreta_super_segura"
ORGANIC_ALLOWED_WORKSPACE="slug_do_workspace_no_organic_os" # Ex: passacumaru
ORGANIC_ALLOWED_ORIGIN="https://seu-organic-os.vercel.app" # URL do painel central
REVALIDATE_SECRET="sua_chave_de_revalidacao"
```

---

## 3. Segurança e Regras Operacionais

- **Modo Inicial**: Todos os blogs são configurados para iniciar com `auto_publish=false`, `require_approval=true` e `mode=manual`. Nenhum conteúdo vindo da API será publicado diretamente na web sem intervenção manual no painel do blog.
- **Origem Bloqueada**: Requisições de origens que não batam com a `ORGANIC_ALLOWED_ORIGIN` serão rejeitadas com erro `403 Forbidden` (CORS).
- **Tratamento de Imagens**: 
  - A imagem destacada (`featured_image`) é **obrigatória**. A API rejeitará o artigo se ela não for fornecida.
  - Toda imagem interna (no array `images`) deve conter texto alternativo (`alt`) para acessibilidade e SEO. Caso contrário, a postagem falha.
  - Recomendamos de 2 a 3 imagens internas por artigo longo.

---

## 4. Testando os Endpoints (Exemplo de CURL)

### Enviar Artigo (Publish):
```bash
curl -X POST https://seu-blog.com/api/organic-publisher/publish \
  -H "Content-Type: application/json" \
  -H "x-organic-publisher-secret: sua_chave_secreta_super_segura" \
  -H "x-organic-workspace-id: passacumaru" \
  -d '{
    "title": "Novo Concurso Cumaru do Norte 2026",
    "slug": "concurso-cumaru-norte-2026",
    "excerpt": "Detalhes sobre o edital de 2026.",
    "html": "<p>Conteúdo completo do artigo...</p>",
    "markdown": "# Novo Concurso Cumaru do Norte 2026\n\nDetalhes...",
    "workspace_id": "passacumaru",
    "content_id": "cid-00123",
    "featured_image": {
      "url": "https://imagens.com/destacada.jpg",
      "alt": "Foto da Prefeitura de Cumaru do Norte"
    },
    "images": [
      {
        "url": "https://imagens.com/interna1.jpg",
        "alt": "Candidatos realizando prova",
        "placement": "middle"
      }
    ]
  }'
```

Se o teste for bem-sucedido, o endpoint retornará `status: 200` com uma mensagem informando que o rascunho foi criado.
