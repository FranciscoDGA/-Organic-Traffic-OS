# Manual SQL Execution Guide

Este documento fornece orientações práticas para administradores executarem scripts SQL diretamente no console do Supabase em cenários de emergência ou deploy manual simplificado.

---

## 1. Copiar & Colar Sem Erros

Ao copiar blocos SQL longos para colar no SQL Editor do Supabase, siga as seguintes dicas:

1. **Ajuste de Timeout**: Queries longas podem exceder o tempo limite padrão. Execute scripts em transações separadas caso o banco esteja sob carga.
2. **Checar Conflitos**: Certifique-se de que nenhum outro desenvolvedor esteja alterando as tabelas simultaneamente para evitar deadlocks.
3. **Limpeza de Cache**: O Supabase mantém cache do catálogo de esquemas. Após criar views ou tabelas, pode ser necessário recarregar a interface do painel web para visualizar as novas tabelas.

---

## 2. Monitoramento de Execução

Você pode auditar se as tabelas foram criadas com sucesso rodando a seguinte consulta rápida:
```sql
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_schema IN (
  'core', 'workspaces', 'agents', 'missions', 'campaigns', 
  'publisher', 'knowledge', 'memory', 'playbooks', 'business', 
  'analytics', 'events', 'runtime', 'audit', 'security', 'settings'
) AND table_type = 'BASE TABLE';
```

Isso listará todas as 28 tabelas base criadas na Sprint.
