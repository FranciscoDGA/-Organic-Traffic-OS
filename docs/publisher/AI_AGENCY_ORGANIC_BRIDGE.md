# AI Agency OS — Organic Bridge Protocol

**Versão:** 1.0 (Sprint 96)

## Escopo e Foco
Integração focada em **autoridade da agência, estudos de caso e geração de leads**.

## Regras de Payload
O payload foi desenhado para nutrir a aba "Conhecimento" do site da agência:
- `content_type`, `cluster`, `case_study`
- `related_service`, `related_video`, `related_ebook`
- `cta`, `lead_journey`, `funnel_level`
- `ai_visibility`

## Segurança e Governança
- Um conteúdo publicado na área de Conhecimento tem a missão de captar leads. Por isso, a validação de segurança bloqueia o disparo do Bridge se o payload não contiver um bloco `cta` (Call-To-Action) válido e formatado.
- Prioriza-se também o mapeamento do nível de funil (`ToFu`, `MoFu`, `BoFu`).

## Integração Futura
No site da AI Agency OS, será preciso criar os hooks do Organic Publisher que receberão esses ativos, persistindo no banco e associando dinamicamente às Landing Pages de Serviços que o CTA recomendar.
