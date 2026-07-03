# Supabase Database Setup Guide

Este documento orienta o processo de inicialização do banco de dados PostgreSQL do Organic Traffic OS no Supabase.

---

## 1. Ordem de Execução Recomendada

Para instalar e configurar o banco de dados do zero, execute os arquivos na seguinte ordem:

1. **`supabase/migrations/001_initial_schema.sql`**: Criação de todos os schemas, funções utilitárias, triggers de auditoria, tabelas base, índices, configurações de RLS e views operacionais.
2. **`supabase/seeds/001_seed_workspaces.sql`** (Opcional): Insere os workspaces iniciais do ecossistema (`passacumaru`, `qualoseguro`, `utilpro`, `tabuometro`, `aiagency`) com status inativos.
3. **`supabase/validation/validate_initial_schema.sql`**: Executa queries de validação sobre o catálogo do Postgres para auditar se todas as estruturas foram devidamente provisionadas.

---

## 2. Como Executar via Supabase SQL Editor

Se você optar por configurar manualmente usando o painel web do Supabase:

1. Acesse o console do [Supabase](https://supabase.com).
2. Selecione o projeto do **Organic Traffic OS**.
3. No menu lateral, clique em **SQL Editor**.
4. Clique em **New query**.
5. Abra o arquivo `supabase/migrations/001_initial_schema.sql`, copie todo o seu conteúdo e cole no SQL Editor.
6. Clique em **Run** e certifique-se de que a query executou sem erros.
7. (Opcional) Repita o processo com o arquivo de seeds (`supabase/seeds/001_seed_workspaces.sql`).

---

## 3. Como Executar via Supabase CLI (Local Development)

Caso esteja rodando o Supabase localmente através do Docker:

1. Certifique-se de que o CLI do Supabase está instalado e o Docker está rodando.
2. Execute o comando de inicialização caso não tenha feito:
   ```bash
   supabase init
   ```
3. Inicie os serviços locais:
   ```bash
   supabase start
   ```
4. Aplique a migração:
   ```bash
   supabase db reset
   ```
   (O CLI irá ler os arquivos dentro da pasta `supabase/migrations` e aplicá-los automaticamente na ordem correta).
