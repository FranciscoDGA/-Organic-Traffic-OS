# Organic Bridge Integration Guide

Este manual descreve a conexão entre o painel central do Organic Traffic OS e os blogs externos.

---

## 1. Variáveis no Blog de Destino

Cada blog deve ter cadastrado em seu painel:
- `ORGANIC_PUBLISHER_SECRET`: Segredo de autenticação.
- `ORGANIC_ALLOWED_WORKSPACE`: ID do blog (ex: `passacumaru`).
- `ORGANIC_ALLOWED_ORIGIN`: Origem autorizada de CORS.
- `REVALIDATE_SECRET`: Senha para limpeza de cache ISR.

---

## 2. Testando a Conexão Manualmente

Use o utilitário `curl` para testar se os endpoints estão ativos antes de liberar deploys de produção dos robôs:

```bash
curl -X GET http://localhost:3000/api/organic-publisher/status \
  -H "x-organic-publisher-secret: mock_secret_bridge_123"
```
Isso validará a conexão e retornará o status de governança operacional do blog.
