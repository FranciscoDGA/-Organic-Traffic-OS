# Organic Bridge Setup Guide

Este manual orienta a instalação e configuração da **Organic Bridge** em cada um dos blogs do portfólio.

---

## 1. Variáveis de Ambiente a Configurar na Vercel de Cada Blog

Defina as seguintes variáveis nas configurações do respectivo blog:

- `ORGANIC_PUBLISHER_SECRET`: Uma senha forte e única que autoriza chamadas de publicação vindo do painel central.
- `ORGANIC_ALLOWED_WORKSPACE`: ID do workspace correspondente àquele blog (ex: `passacumaru`).
- `ORGANIC_ALLOWED_ORIGIN`: Domínio ou URL do painel central (ex: `https://app.organic-os.com`) para segurança de CORS.
- `REVALIDATE_SECRET`: Senha para limpeza de cache estático das páginas (ISR).
- `ORGANIC_AUTO_PUBLISH`: `false` (inicia desativado por padrão).
- `ORGANIC_REQUIRE_APPROVAL`: `true` (força aprovação manual na primeira etapa).

---

## 2. Endpoints do Publicador

Cada blog deve implementar e expor as seguintes rotas de API:

- `POST /api/organic-publisher/publish`: Criação de rascunhos e envio do payload do post.
- `POST /api/organic-publisher/approve`: Mudança de status de rascunho para publicado.
- `POST /api/organic-publisher/update`: Atualizações de conteúdo.
- `POST /api/organic-publisher/delete`: Exclusão lógica (arquivamento).
- `GET /api/organic-publisher/status`: Consulta de status.
- `POST /api/revalidate`: Purga e recriação do cache estático das páginas.
