# Monitoring Agent — Prompts

## Trend Analysis Prompt
Analise as métricas do conteúdo {content_id} no blog {blog_id}.
Compare o período atual com o histórico disponível ({history_points} pontos).
Detecte tendências: alta, queda, estabilidade, mudança brusca, perda de ranking, ganho de autoridade, decadência ou crescimento.

## Health Score Prompt
Calcule o Health Score do conteúdo {content_id} com base em:
- Performance (tráfego, cliques, CTR)
- Atualidade (última atualização)
- Qualidade (estrutura, profundidade)
- Engajamento (tempo médio, compartilhamentos)
- Visibilidade (impressões, posição média)
- Conversão (conversões, leads, downloads)
- Tendência (direção atual)

## Recommendation Prompt
Com base no Health Score {pontuacao_final} e tendência {trend_status}, gere recomendações priorizadas:
- prioridade alta: ações críticas para recuperação ou otimização
- prioridade média: ações de crescimento e expansão
- prioridade baixa: melhorias cosméticas ou complementares
