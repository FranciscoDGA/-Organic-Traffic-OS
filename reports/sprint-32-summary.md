# Sprint 32 — WordPress Publishing Connector V1

## O Que Foi Criado

O sexto **Connector** do Organic Traffic OS: **WordPress Publishing Connector**.

Ele permite criar rascunhos, atualizar rascunhos e publicar manualmente conteúdos via WordPress REST API com segurança, logs e validações.

## Arquitetura

```
organic-traffic-os/core/connectors/wordpress/
├── wordpress.types.ts        # Tipos: WpPost, WpCategory, WpTag, PublicationPackage, etc.
├── wordpress.client.ts       # Cliente HTTP WordPress REST API (Application Password)
├── wordpress.mapper.ts       # Mapper: PublicationPackage → WpCreatePostPayload
├── wordpress.validator.ts    # Validação de URL, credenciais, payload
├── wordpress.service.ts      # Service: connect, sync, createDraft, updateDraft, publish
├── wordpress.connector.ts    # Implementação BaseConnector
├── wordpress.manifest.json   # Metadata, capabilities, security rules
└── wordpress.report-template.json
```

## Autenticação

- **Application Password** (recomendado pelo WordPress)
- Basic Auth via header `Authorization: Basic base64(username:password)`
- Variáveis de ambiente: `WP_SITE_URL`, `WP_USERNAME`, `WP_APP_PASSWORD`
- Nunca armazenar credenciais no código
- Validação de conexão antes de operações

## Seguranças Implementadas

1. **Publicação requer confirmação explícita** — `confirm=true` obrigatório
2. **Criação padrão é rascunho** — nunca publica automaticamente
3. **Slug duplicado bloqueado** — detecta conflito e sugere update
4. **Campos obrigatórios validados** — title, slug, content
5. **Todas as ações são logadas** — timestamp, action, message

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/organic-os/connectors/wordpress/connect` | Conectar / desconectar / sync |
| POST | `/api/organic-os/connectors/wordpress/create-draft` | Criar rascunho |
| POST | `/api/organic-os/connectors/wordpress/update-draft` | Atualizar rascunho |
| POST | `/api/organic-os/connectors/wordpress/publish` | Publicar (requer confirm=true) |
| GET | `/api/organic-os/connectors/wordpress/status` | Status da conexão |
| GET | `/api/organic-os/connectors/wordpress/posts` | Listar posts |
| GET | `/api/organic-os/connectors/wordpress/categories` | Listar categorias |
| GET | `/api/organic-os/connectors/wordpress/tags` | Listar tags |

## Mapper

Converte `PublicationPackage` do Organic Traffic OS para payload WordPress:

| Campo WP | Origem |
|----------|--------|
| title | pkg.title |
| content | pkg.content |
| excerpt | pkg.excerpt |
| slug | sanitizeSlug(pkg.slug) |
| status | 'draft' (padrão) |
| meta | pkg.metadata |

## Painel

Acesse: `/organic-os/connectors/wordpress`

- Status da conexão e site conectado
- Posts recentes com status (publish/draft/pending)
- Formulário seguro para criar rascunho
- Categorias e tags com contagem
- Logs de operação
- Link direto para ver no WordPress

## Publicação Segura

```
POST /api/organic-os/connectors/wordpress/publish
{
  "postId": 123,
  "confirm": true   // OBRIGATÓRIO — sem isso, retorna erro
}
```

## Limitações

- Requer WordPress com REST API habilitada
- Requer Application Password configurado
- Upload de imagem destacada não suportado ainda
- Integração com metadados SEO não suportada ainda
- Edição de posts existentes requer update explícito

## Checklist

- ✅ Build passou (168 páginas, 0 erros)
- ✅ Nenhum Agent acessa WordPress diretamente
- ✅ Publicação automática bloqueada por padrão
- ✅ Criação de rascunho funciona com mock ou conexão real
- ✅ API funciona com todas as rotas
- ✅ Painel funciona com 5 abas
- ✅ Sprints anteriores não foram quebradas
