# Supabase Provisioning Guide

Este manual descreve como provisionar e auditar seu banco de dados e buckets no Supabase.

---

## 1. Passo a Passo do Setup do Banco

1. Crie uma conta ou acesse o [Supabase](https://supabase.com).
2. Clique em **New Project**, dê um nome e crie uma senha forte para o banco de dados Postgres.
3. Vá em **Project Settings** > **API** e copie os valores de:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY`
4. Vá em **SQL Editor** > **New Query**, cole as instruções de [001_initial_schema.sql](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/supabase/migrations/001_initial_schema.sql) e clique em **Run**.

---

## 2. Configurando Buckets de Storage

1. Vá na aba **Storage** no menu lateral do Supabase.
2. Crie os 15 buckets listados no guia de Storage respeitando a propriedade público/privado:
   - **Public**: `images`, `generated-images`, `workspace-assets`.
   - **Private**: `articles`, `drafts`, `reports`, `playbooks`, `logs`, `backups`, `exports`, `imports`, `temporary`, `videos`, `ebooks`, `datasets`.
3. Para criar os buckets e aplicar as políticas de RLS de uma só vez via SQL Editor, você pode executar o script de criação [buckets.sql](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/supabase/storage/buckets.sql) e o script de políticas [storage_policies.sql](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/supabase/storage/policies/storage_policies.sql).
