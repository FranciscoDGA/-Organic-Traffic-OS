# Sprint 33 — Headless CMS Connectors V1

## O Que Foi Criado

O sétimo **Connector** do Organic Traffic OS: **Headless CMS Connector**.

Uma base segura de conectores para CMS Headless, com adapters para Strapi, Directus, Sanity e Mock, preparada para criar rascunhos, atualizar conteúdos e publicar manualmente.

## Arquitetura

```
organic-traffic-os/core/connectors/headless-cms/
├── headless-cms.types.ts          # Tipos: HeadlessProvider, HeadlessCollection, HeadlessContent
├── headless-cms.client.ts         # Factory de adapters (createAdapter)
├── headless-cms.mapper.ts         # Mapper: PublicationPackage → HeadlessCreatePayload
├── headless-cms.validator.ts      # Validação de URL, credenciais, payload
├── headless-cms.service.ts        # Service: connect, sync, createDraft, updateDraft, publish
├── headless-cms.connector.ts      # Implementação BaseConnector
├── headless-cms.manifest.json     # Metadata, capabilities, security rules
├── headless-cms.report-template.json
└── adapters/
    ├── headless-adapter.interface.ts  # Interface comum para todos os adapters
    ├── strapi-adapter.ts              # Adapter para Strapi (REST API)
    ├── directus-adapter.ts            # Adapter para Directus (REST API)
    ├── sanity-adapter.ts              # Adapter para Sanity (GROQ/REST)
    └── mock-headless-adapter.ts       # Adapter mock para desenvolvimento
```

## Adapters

| Adapter | Provider | Autenticação | API |
|---------|----------|--------------|-----|
| `StrapiAdapter` | strapi | Bearer Token | REST `/api` |
| `DirectusAdapter` | directus | Bearer Token | REST `/items` |
| `SanityAdapter` | sanity | Bearer Token | GROQ `/data` |
| `MockHeadlessAdapter` | mock | Nenhuma | Dados simulados |

## Mock Adapter

O mock adapter é usado para desenvolvimento e testes:
- 3 collections mock: articles, pages, posts
- 3 itens mock com títulos e slugs
- Criação, atualização e publicação simuladas
- Identificado na interface com badge "MODO MOCK"

## Autenticação

| Provider | Variáveis |
|----------|-----------|
| Strapi | `HEADLESS_CMS_API_URL`, `HEADLESS_CMS_API_TOKEN` |
| Directus | `HEADLESS_CMS_API_URL`, `HEADLESS_CMS_API_TOKEN` |
| Sanity | `HEADLESS_CMS_API_URL`, `HEADLESS_CMS_API_TOKEN`, `HEADLESS_CMS_PROJECT_ID` |
| Mock | Nenhuma |

## Mapper

Converte `PublicationPackage` para payload genérico CMS:

| Campo | Origem |
|-------|--------|
| title | pkg.title |
| slug | sanitizeSlug(pkg.slug) |
| content/body | pkg.content |
| excerpt | pkg.excerpt |
| status | 'draft' (padrão) |
| tags | pkg.tags |
| categories | pkg.categories |
| metadata | pkg.metadata |

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/organic-os/connectors/headless-cms/connect` | Conectar / desconectar / sync |
| POST | `/api/organic-os/connectors/headless-cms/create-draft` | Criar rascunho |
| POST | `/api/organic-os/connectors/headless-cms/update-draft` | Atualizar rascunho |
| POST | `/api/organic-os/connectors/headless-cms/publish` | Publicar (requer confirm=true) |
| GET | `/api/organic-os/connectors/headless-cms/status` | Status da conexão |
| GET | `/api/organic-os/connectors/headless-cms/collections` | Listar collections |
| GET | `/api/organic-os/connectors/headless-cms/content` | Listar conteúdo |

## Painel

Acesse: `/organic-os/connectors/headless-cms`

- Seleção de provider (Mock/Strapi/Directus/Sanity)
- Configuração de conexão
- Status da conexão
- Collections disponíveis
- Conteúdo por collection
- Formulário para criar rascunho
- Logs de operação
- Badge de aviso quando em modo Mock

## Seguranças Implementadas

1. **Publicação requer confirmação explícita** — `confirm=true` obrigatório
2. **Criação padrão é rascunho** — nunca publica automaticamente
3. **Slug duplicado bloqueado** — detecta conflito e sugere update
4. **Campos obrigatórios validados** — title, slug, content
5. **Todas as ações são logadas** — timestamp, action, message
6. **Credenciais apenas em env vars** — nunca no código

## Limitações

- Adapters são base — implementação completa depende da API de cada CMS
- Schema mapping é específico por provider
- Upload de mídia não suportado ainda
- SEO metadata varia por provider
- Mock adapter para desenvolvimento apenas

## Checklist

- ✅ Build passou (178 páginas, 0 erros)
- ✅ Nenhum Agent acessa CMS diretamente
- ✅ Publicação automática bloqueada por padrão
- ✅ Mock adapter identificado na interface
- ✅ WordPress Connector não foi quebrado
- ✅ API funciona com todas as rotas
- ✅ Painel funciona com 5 abas
