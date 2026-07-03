# RLS (Row Level Security) Guide

O Organic Traffic OS utiliza **Row Level Security (RLS)** de forma estrita em todas as tabelas para garantir o isolamento absoluto de dados entre diferentes workspaces e segurança contra vazamento de informações.

---

## 1. Comportamento Padrão

Por padrão, a instrução `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` é executada em todas as tabelas. Isso significa que:

- Toda consulta ou escrita efetuada sem uma política explícita de acesso será **rejeitada por padrão** pelo Postgres.
- Usuários anônimos ou conexões externas sem chaves adequadas não conseguirão ler nenhuma linha das tabelas.

---

## 2. Acesso via Service Role (Admin)

Para simplificar a integração inicial com engines e agentes locais rodando em segundo plano:

- Criamos uma política global chamada `service_role_access` que concede privilégios totais (`ALL`) para conexões usando a chave **Service Role** do Supabase.
- A chave Service Role deve ser utilizada exclusivamente pelos workers internos, cron jobs e APIs seguras sob a proteção de rede e autenticação de servidor.

---

## 3. Preparando Políticas Futuras por Workspace

Para preparar o sistema para controle multi-tenant futuro por ID do Workspace:

- O sistema utilizará políticas baseadas em JWT contendo metadados personalizados da sessão do usuário.
- Exemplo de política futura a ser aplicada:
  ```sql
  CREATE POLICY workspace_isolation_policy ON workspaces.workspace_profiles
  FOR ALL
  USING (
    workspace_id = (auth.jwt() -> 'user_metadata' ->> 'workspace_id')::uuid
  );
  ```
  Isso garantirá que operadores logados em um workspace específico nunca visualizem logs, playbooks ou dados de outros blogs.
