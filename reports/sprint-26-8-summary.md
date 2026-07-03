# Sprint 26.8 — Visibility Agent V1

## O Que Foi Criado
O sétimo agente da arquitetura: **Visibility Agent**. Sua função é otimizar o rascunho aprovado para máxima indexação e descoberta, tanto por crawlers tradicionais (Googlebot) quanto por AI Overviews (SGE, ChatGPT, Claude).

## Arquitetura do Visibility Report
O Agente consome o `Draft Pack` aprovado e o `Review Report`, gerando o **Visibility Report**, que contém:
- **Visibility Score**: Pontuação dividida em métricas como SEO Técnico, AI Readability, Schema Readiness e Cobertura Semântica.
- **Schema & Metadata**: Geração autônoma do JSON-LD correto (Article, FAQ, Breadcrumb) e de todas as Open Graph / Meta tags essenciais.
- **Entities Coverage**: Validação de entidades no formato compreendido pelo Knowledge Graph (NLP-friendly).
- **Snippets Readiness**: Sugestões de resumos prontos para a "Posição Zero" do Google e para sumários de IAs generativas.

## O Pipeline Atual
A cadeia contínua e autônoma está expandida para:
```
Discovery → Planning → Research → Fact → Writer → Review → Visibility Agent
```

## Próximos Passos
O conteúdo nasceu de uma oportunidade (Discovery), virou pauta (Planning), foi embasado (Research), blindado de fakes (Fact), escrito (Writer), validado (Review) e finalmente empacotado para o mundo (Visibility). O próximo e último agente da cadeia deve ser o **Publishing Agent** (Sprint 26.9), que empurrará o payload JSON final para o CMS (ex: WordPress, Webflow, Contentful).
