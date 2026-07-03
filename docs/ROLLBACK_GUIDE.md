# Rollback Guide

## Quando Executar Rollback

- Readiness Score cai abaixo de 70
- Taxa de erro acima de 5%
- Custo excedendo orcamento
- Perda de dados detectada
- Sistema instavel

## Passos de Rollback

### Imediato (0-5 minutos)
1. Desativar auto-publishing
2. Pausar todos os workflows
3. Notificar equipe de operacoes

### Curto Prazo (5-30 minutos)
1. Redirecionar workspaces para Sandbox
2. Desativar agents nao essenciais
3. Documentar motivo do rollback

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
