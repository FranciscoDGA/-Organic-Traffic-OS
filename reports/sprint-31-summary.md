# Sprint 31 — RSS & Sitemap Connector V1

## O Que Foi Criado

O quinto **Connector** do Organic Traffic OS: **RSS & Sitemap Connector**.

Ele descobre, lê e normaliza URLs, posts, páginas, datas, categorias e conteúdos publicados a partir de feeds RSS, Atom, sitemaps.xml e robots.txt.

## Arquitetura

```
organic-traffic-os/core/connectors/rss-sitemap/
├── rss-sitemap.types.ts        # Tipos: RssFeedItem, SitemapUrl, InternalRssUrl, etc.
├── rss-sitemap.client.ts       # Cliente HTTP com cache e discovery de feeds
├── rss-sitemap.mapper.ts       # Mapper: RSS/Atom/Sitemap → InternalRssUrl
├── rss-sitemap.validator.ts    # Validação de domínio, URLs, config
├── rss-sitemap.service.ts      # Service: connect, sync, fetch*, parse XML
├── rss-sitemap.connector.ts    # Implementação BaseConnector
├── rss-sitemap.manifest.json   # Metadata, capabilities, limitations
└── rss-sitemap.report-template.json
```

## Sem Autenticação

Diferente dos conectores Google/Bing, este connector NÃO requer autenticação:
- Feeds RSS/Atom são públicos
- Sitemaps são públicos
- robots.txt é público
- Apenas o domínio é necessário

## Discovery Automático

O service descobre automaticamente:
1. `/feed/`, `/rss/`, `/atom/` — feeds comuns
2. `/sitemap.xml`, `/sitemap_index.xml` — sitemaps
3. `robots.txt` — extrai URLs de sitemaps listados
4. Sitemap Index — segue sub-sitemaps recursivamente

## Parsing XML

Implementado parser manual (sem dependências externas):
- RSS 2.0: `<item>`, `<channel>`, `<title>`, `<link>`, `<pubDate>`, `<category>`
- Atom: `<entry>`, `<link>`, `<published>`, `<updated>`, `<category term="">`
- Sitemap: `<url>`, `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`
- Sitemap Index: `<sitemap>`, `<loc>`, `<lastmod>`
- CDATA suportado

## Classificação de URLs

| Padrão URL | Tipo |
|------------|------|
| `/YYYY/MM/...` ou `/post/...` | post |
| `/page/...` | page |
| `/category/...` | category |
| `/tag/...` | tag |
| Outros | page |

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/organic-os/connectors/rss-sitemap/feeds` | Conectar & descobrir feeds |
| POST | `/api/organic-os/connectors/rss-sitemap/sync` | Sincronizar dados |
| GET | `/api/organic-os/connectors/rss-sitemap/status` | Status da conexão |
| GET | `/api/organic-os/connectors/rss-sitemap/urls` | URLs descobertas |

## Painel

Acesse: `/organic-os/connectors/rss-sitemap`

- Status da conexão e domínio
- Feed principal encontrado
- Sitemaps descobertos
- Total de URLs, posts, páginas, categorias
- Tabela de URLs com tipo, fonte, prioridade
- Logs de operação

## Cache

- Cache em memória com TTL de 15 minutos
- Evita requisições repetidas ao mesmo XML
- `clearCache()` disponível no service

## Limitações

- Somente leitura (não modifica feeds ou sitemaps)
- Dependente da disponibilidade pública
- Alguns sites podem bloquear requests automatizados
- Sitemaps grandes podem exigir paginação
- Sem autenticação (feeds públicos apenas)

## Checklist

- ✅ Build passou (163 páginas, 0 erros)
- ✅ Nenhum Agent acessa RSS/Sitemap diretamente
- ✅ API funciona com domínio como parâmetro
- ✅ Painel funciona com abas Status/Feeds/URLs/Logs
- ✅ Sprints anteriores não foram quebradas
