# Tabuômetro — Organic Bridge Protocol

**Versão:** 1.0 (Sprint 95)

## Escopo e Foco
Integração focada em **jornalismo, opinião e curadoria editorial**.

## Regras de Payload
O payload foi estendido com campos editoriais chave:
- `editorial_category`, `subtitle`, `featured`
- `gallery`, `references`
- `estimated_read_time_minutes`, `editorial_series`

## Segurança e Governança
- A publicação no Tabuômetro exige explicitamente que o conteúdo seja classificado sob uma Categoria Editorial válida.
- O Bridge força a revisão manual na maioria dos casos (auto-publish: false por padrão) para prevenir conteúdos sensacionalistas ou que violem regras de publisher (AdSense).

## Integração Futura
No lado do projeto `tabuometro.vercel.app`, é necessário implementar as mesmas APIs (`/api/organic-publisher/publish`, etc.) que aceitem este payload estendido e o salvem num banco de dados, retornando a URL de preview para o painel do Organic OS.
