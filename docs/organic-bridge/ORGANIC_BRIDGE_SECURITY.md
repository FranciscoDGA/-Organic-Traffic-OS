# Organic Bridge Security Specification

Este documento detalha os mecanismos e camadas de segurança implementados em cada endpoint do Organic Bridge para evitar ataques de força bruta, acessos não autorizados e injeção de dados maliciosos.

---

## 1. Headers de Autenticação Obrigatórios

Toda chamada efetuada em direção ao publicador dos blogs exige os seguintes cabeçalhos de segurança:

- **`x-organic-publisher-secret`**: Deve conter o valor correspondente à variável `ORGANIC_PUBLISHER_SECRET`. Caso seja diferente ou esteja ausente, o servidor retorna erro `401 Unauthorized`.
- **`x-organic-workspace-id`**: Deve conter o identificador único do workspace (ex: `passacumaru`). Chamadas enviando workspaces incorretos ou que não correspondam à variável local `ORGANIC_ALLOWED_WORKSPACE` serão negadas com o erro `403 Forbidden`.

---

## 2. Proteção de Origem (CORS)

- Caso a variável `ORGANIC_ALLOWED_ORIGIN` esteja configurada, a API rejeitará qualquer requisição vinda de domínios diferentes da origem informada, adicionando uma camada extra de proteção baseada no navegador contra ataques CSRF.

---

## 3. Modos Operacionais de Governança

Para evitar publicações indevidas ou automáticas sem governança editorial:
- Por padrão, a variável `ORGANIC_REQUIRE_APPROVAL` é definida como `true`. Qualquer tentativa de publicação direta (`status = "published"`) sem que a aprovação manual tenha sido registrada resultará em bloqueio.
