# Sprint 22 - Visibility Optimization Engine V1

## Resumo
A Sprint 22 entrega o estado da arte em distribuição de conteúdo: a otimização híbrida. O `Visibility Engine` atua pós-humanização injetando metadados e microformatando sintaxe não apenas para o GoogleBot (SEO), mas para Modelos de Linguagem Grande (LLMs) em sistemas RAG como o Perplexity e AI Overviews (GEO).

## Arquitetura de Visibilidade Híbrida
- `ai-visibility-rules.json`: Força o rascunho a ter blocos de Definição Explícita ("O que é X? X é..."), facilitando o scrape de LLMs na extração de respostas em *Zero-Click Searches*.
- `schema-rules.json`: Injeta código invisível (JSON-LD) para garantir a exibição de Estrelas, FAQs interativos e breadcrumbs visuais.
- `seo-rules.json`: Controle milimétrico sobre limite de caracteres em títulos e otimização da URL (Slug).

## Integração
O texto validado sai com 4 pontuações independentes mapeadas no Validador, garantindo que o SEO Clássico não estrague a Visibilidade em IA e vice-versa.
