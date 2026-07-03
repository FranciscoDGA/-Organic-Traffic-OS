# Sprint 34 — Newsletter Connector V1

## O Que Foi Criado

O oitavo **Connector** do Organic Traffic OS: **Newsletter Connector**.

Transforma conteúdos aprovados em versões para e-mail/newsletter como rascunhos, com adapters para provedores populares e envio real bloqueado por padrão.

## Arquitetura

```
organic-traffic-os/core/connectors/newsletter/
├── newsletter.types.ts        # Tipos: NewsletterProvider, NewsletterPackage, etc.
├── newsletter.client.ts       # Factory de adapters (createAdapter)
├── newsletter.mapper.ts       # Mapper: PublicationPackage → NewsletterPackage
├── newsletter.validator.ts    # Validação de credenciais, payload
├── newsletter.service.ts      # Service: connect, sync, createDraft, updateDraft
├── newsletter.connector.ts    # Implementação BaseConnector
├── newsletter.manifest.json   # Metadata, capabilities, security rules
├── newsletter.report-template.json
└── adapters/
    ├── newsletter-adapter.interface.ts  # Interface comum
    ├── brevo-adapter.ts                # Adapter para Brevo
    ├── mailchimp-adapter.ts            # Adapter para Mailchimp
    ├── resend-adapter.ts               # Adapter para Resend
    ├── convertkit-adapter.ts           # Adapter para ConvertKit
    └── mock-newsletter-adapter.ts      # Adapter mock
```

## Adapters

| Adapter | Provider | Autenticação |
|---------|----------|--------------|
| `BrevoAdapter` | brevo | API Key |
| `MailchimpAdapter` | mailchimp | API Key (com datacenter) |
| `ResendAdapter` | resend | Bearer Token |
| `ConvertkitAdapter` | convertkit | API Key |
| `MockNewsletterAdapter` | mock | Nenhuma |

## Mapper

Converte `PublicationPackage` para `NewsletterPackage`:

| Campo | Origem |
|-------|--------|
| subject | pub.title |
| preheader | pub.excerpt (100 chars) |
| title | pub.title |
| intro | pub.excerpt |
| body_html | Template HTML com título + conteúdo |
| body_text | Texto puro do conteúdo |
| cta | { label: "Ler mais", url: slug } |
| status | 'draft' |

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/organic-os/connectors/newsletter/connect` | Conectar / desconectar / sync |
| POST | `/api/organic-os/connectors/newsletter/create-draft` | Criar rascunho de campanha |
| POST | `/api/organic-os/connectors/newsletter/update-draft` | Atualizar rascunho |
| GET | `/api/organic-os/connectors/newsletter/status` | Status da conexão |
| GET | `/api/organic-os/connectors/newsletter/audiences` | Listar audiências |
| GET | `/api/organic-os/connectors/newsletter/campaigns` | Listar campanhas |

## Painel

Acesse: `/organic-os/connectors/newsletter`

- Seleção de provider (Mock/Brevo/Mailchimp/Resend/ConvertKit)
- Status da conexão
- Audiências / listas com contagem de contatos
- Campanhas recentes com status
- Formulário para criar rascunho (subject, preheader, HTML, texto, CTA)
- Badge de aviso "Envio Bloqueado"
- Logs de operação

## Seguranças Implementadas

1. **Envio real bloqueado** — impossível enviar e-mails nesta versão
2. **Apenas rascunhos** — padrão é criar draft
3. **Campos obrigatórios** — subject, preheader, body_html, body_text, cta
4. **Todas as ações são logadas** — timestamp, action, message
5. **Credenciais apenas em env vars** — nunca no código

## Limitações

- Envio real não implementado (bloqueado por design)
- Agendamento não implementado
- Resend não suporta drafts (apenas envio direto)
- Mock adapter para desenvolvimento apenas
- Templates de e-mail são básicos

## Checklist

- ✅ Build passou (185 páginas, 0 erros)
- ✅ Nenhum Agent envia e-mail diretamente
- ✅ Envio real bloqueado por padrão
- ✅ Mock adapter identificado na interface
- ✅ APIs funcionam com todas as rotas
- ✅ Painel funciona com 5 abas
- ✅ Sprints anteriores não foram quebradas
