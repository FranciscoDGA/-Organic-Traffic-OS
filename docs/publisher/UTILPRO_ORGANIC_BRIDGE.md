# UtilPro Brasil — Organic Bridge Protocol

**Versão:** 1.0 (Sprint 94)

## Escopo e Foco
Integração focada em **monetização, reviews e comparativos**.

## Regras de Payload
O payload para este Workspace possui campos exclusivos:
- `product_name`, `brand`, `price_range`
- `pros`, `cons`, `rating`
- `affiliate_links`

## Segurança e Transparência
- Qualquer conteúdo enviado contendo `affiliate_links` tem validação obrigatória de um `disclaimer` (aviso de transparência sobre ganho de comissão). Caso ausente, o Adapter do Organic OS insere um disclaimer padrão automaticamente antes do envio.

## Integração Futura
A estrutura deve ser espelhada no código-fonte do projeto alvo (UtilPro Brasil) sob a pasta `api/organic-publisher`, recebendo o conteúdo, validando o `x-organic-secret` correspondente a `UTILPRO_PUBLISH_SECRET`, e persistindo no banco de dados.
