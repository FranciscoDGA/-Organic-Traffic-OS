# API Keys Security Guide

Este guia apresenta as diretivas obrigatórias de segurança para gerenciamento de chaves de API externas no Organic Traffic OS.

---

## 1. Regra de Ouro: Sem Chaves em Código

- **Nunca** escreva chaves de API, segredos, senhas ou tokens diretamente nos arquivos `.ts`, `.tsx`, `.json` ou qualquer outro arquivo rastreado pelo Git.
- Todos os segredos devem ser carregados estritamente através do `process.env`.
- Caso descubra uma chave vazada no repositório, faça a revogação (rotate) imediata na plataforma do provedor correspondente e exclua o commit usando `git filter-branch` ou ferramentas equivalentes.

---

## 2. Rotação de Segredos Recomendada

Recomenda-se realizar a rotação das seguintes chaves críticas a cada 90 dias:
- `SUPABASE_SERVICE_ROLE_KEY`
- `GITHUB_TOKEN`
- `VERCEL_TOKEN`
- `ORGANIC_BRIDGE_SECRET`

---

## 3. Logs Limpos

Nenhum arquivo de log operacional do worker runtime ou dos agents pode imprimir valores de variáveis de ambiente contendo o sufixo `KEY`, `SECRET` ou `TOKEN`. O validador de conexões foi construído especificamente para validar a *presença* da chave, retornando apenas `configured: true` ou `false`, nunca o seu conteúdo.
