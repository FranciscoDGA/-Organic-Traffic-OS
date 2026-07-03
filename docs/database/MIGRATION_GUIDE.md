# Database Migration Guide

Este guia explica como gerenciar, aplicar e reverter migrações de banco de dados do Organic Traffic OS no Supabase de maneira segura e idempotente.

---

## 1. Convenção de Versionamento

Todas as migrações em `supabase/migrations/` seguem a nomenclatura:
- `001_initial_schema.sql` (ou `YYYYMMDDHHMMSS_nome.sql`).

Isso garante que o Supabase CLI ou o executor SQL rode os arquivos em ordem estrita de numeração/data.

---

## 2. Processo de Rollback Seguro

Caso precise desfazer a instalação de uma migração específica para corrigir problemas ou voltar a um estado limpo:

1. Acesse o arquivo `supabase/rollback/rollback_initial_schema.sql`.
2. O script executa a exclusão de todas as views, tabelas, triggers e funções criados na migração `001_initial_schema.sql` na ordem inversa de suas dependências (views e tabelas filhas primeiro).
3. **Cuidado**: Executar o rollback excluirá permanentemente todos os dados das tabelas correspondentes. Realize backups antes de prosseguir em ambiente de staging ou produção.

---

## 3. Idempotência em Migrações Futuras

Ao escrever novas migrations:
- Sempre utilize cláusulas `IF NOT EXISTS` para criação de tabelas, índices e colunas.
- Utilize triggers idempotentes ou substitua-os usando `CREATE OR REPLACE TRIGGER` (ou drope o trigger antes de recriá-lo para evitar erros em duplicidade).
- Evite alterações destrutivas (como drop de colunas) sem coordenar primeiro com a versão correspondente no código da aplicação.
