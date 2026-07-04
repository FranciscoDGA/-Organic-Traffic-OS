$docs = @{
  "AGENT_REGISTRY.md" = @"
# Agent Registry

O Agent Registry é o diretório global da Força de Trabalho Autônoma do Organic Traffic OS.
Ele documenta 35 agentes projetados na arquitetura distribuídos em 7 grupos funcionais:
1. Strategy
2. Research & Intelligence
3. Content Production
4. Publishing
5. Monitoring & Learning
6. Operations
7. Workspace

Cada agente é isolado e possui missões e permissões específicas de escopo restrito.
"@
  "AGENT_OPERATING_MANUAL.md" = @"
# Agent Operating Manual

Este manual rege a operação da IA no ecossistema:
- Nenhum agente roda sem registro no Manifesto.
- Nenhum agente auto-publica sem passar pelas camadas de Governance e PIC.
- Qualquer agente pego burlando as restrições de Workspace (Workspace Isolation) será encerrado pelo Resilience Agent.
"@
  "AGENT_PERMISSIONS_MATRIX.md" = @"
# Agent Permissions Matrix

A Matriz de Permissões define direitos binários (true/false) para as principais ações de risco:
- `can_create_content`: Ex: Writing Agent (sim), Publishing Agent (não).
- `can_publish`: Ex: Universal Publisher Agent (sim), QA Agent (não).
- `can_use_external_ai`: Limita acessos à API paga da OpenAI/Anthropic.
- `requires_human_approval`: Define quem pode rodar em "Auto Mode".
"@
  "AGENT_WORKFLOW_MAP.md" = @"
# Agent Workflow Map

O fluxo é sequencial e dependente:
1. Strategy Agents criam diretrizes.
2. Research Agents geram Briefings.
3. Content Agents escrevem e revisam.
4. QA & Governance bloqueiam ou aprovam.
5. Publishing Agents enviam via Organic Bridge.
6. Monitoring Agents coletam os resultados e geram aprendizados.
"@
  "AGENT_KPI_MAP.md" = @"
# Agent KPI Map

Como medimos o sucesso dos nossos Agentes:
1. **Success Rate:** Taxa de execuções perfeitas sem retry.
2. **Failure Rate:** Taxa de falhas irrecuperáveis.
3. **Avg Cost:** Custo médio por ciclo da API do modelo.
4. **Token Consumption:** Eficiência de Prompt.
5. **Quality Score:** Pontuação dada pela camada de QA/Review.
"@
}

foreach ($doc in $docs.Keys) {
  $path = Join-Path "docs" $doc
  Set-Content -Path $path -Value $docs[$doc]
}
