# Supabase Storage Setup Guide

Este guia detalha o processo de provisionamento dos buckets de armazenamento necessários para o Organic Traffic OS no Supabase Storage.

---

## 1. Ordem de Instalação dos Scripts

1. **`supabase/storage/buckets.sql`**: Insere todos os 15 buckets na tabela `storage.buckets` com seus respectivos limites de tamanho e restrições de tipos MIME permitidos.
2. **`supabase/storage/policies/storage_policies.sql`**: Habilita o RLS e provisiona as políticas de segurança padrão.
3. **`supabase/storage/validation/validate_storage.sql`**: Roda testes de catálogo para checar se a estrutura foi criada devidamente.

---

## 2. Como Criar Manualmente no Console Supabase

Se você optar por criar os buckets manualmente pelo painel:

1. Acesse o dashboard do [Supabase](https://supabase.com).
2. Clique no ícone de **Storage** no menu lateral.
3. Clique em **New Bucket** e crie os buckets respeitando a propriedade público/privado:
   - **Public**: `images`, `generated-images`, `workspace-assets`.
   - **Private**: `articles`, `drafts`, `reports`, `playbooks`, `logs`, `backups`, `exports`, `imports`, `temporary`, `videos`, `ebooks`, `datasets`.
4. Defina os limites de tamanho de upload recomendados no guia de políticas.
