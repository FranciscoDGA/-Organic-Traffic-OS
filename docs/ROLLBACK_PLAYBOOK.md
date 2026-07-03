# Rollback Playbook

## Quando Executar Rollback

- Score cai abaixo de 70
- Taxa de erro acima de 5%
- Custo excedendo orcamento
- Perda de dados detectada
- Sistema instavel
- Incidente critico nao resolvido

## Processo de Rollback

### Imediato (0-5 minutos)
1. Desativar auto-publishing
2. Pausar todos os workflows
3. Notificar equipe de operacoes
4. Registrar inicio do rollback

### Curto Prazo (5-30 minutos)
1. Redirecionar workspaces para Sandbox
2. Desativar agents nao essenciais
3. Documentar motivo do rollback
4. Coletar logs e metricas

### Medio Prazo (30min - 2h)
1. Analisar logs de erro
2. Identificar causa raiz
3. Corrigir problema
4. Testar em Sandbox

### Retomada
1. Validar correcao
2. Executar testes
3. Reativar gradualmente
4. Monitorar por 24h

## Comunicacao

### Equipe
- Notificar via canal de operacoes
- Reportar motivo e acoes
- Definir proximo check-in

### Documentacao
- Log do incidente
- Causa raiz
- Acoes tomadas
- Resultado

## Prevencao

- Monitoramento continuo
- Alertas configurados
- Backup automatico
- Testes regulares
- Documentacao atualizada

## Checklist de Rollback

- [ ] Auto-publishing desativado
- [ ] Workflows pausados
- [ ] Equipe notificada
- [ ] Motivo documentado
- [ ] Logs coletados
- [ ] Causa raiz identificada
- [ ] Correcao implementada
- [ ] Testes executados
- [ ] Retomada planejada
