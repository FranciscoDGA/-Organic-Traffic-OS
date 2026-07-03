# Alert Policy Guide

## Politica de Alertas

### Niveis de Severidade

#### Info
- Descricao: Evento informativo
- Acao: Registrar
- Notificacao: Dashboard
- Retencao: 30 dias

#### Warning
- Descricao: Condicao que requer atencao
- Acao: Monitorar
- Notificacao: Dashboard + E-mail
- Retencao: 90 dias

#### High
- Descricao: Problema que afeta operacao
- Acao: Investigar
- Notificacao: Dashboard + E-mail + Slack
- Retencao: 180 dias

#### Critical
- Descricao: Problema critico
- Acao: Acao imediata
- Notificacao: Todos os canais
- Retencao: 1 ano

#### Emergency
- Descricao: Sistema comprometido
- Acao: Escalacao imediata
- Notificacao: Todos + SMS + Telefonica
- Retencao: Permanente

## Regras de Notificacao

### Horario Comercial (08:00-18:00)
- Info: Dashboard
- Warning: E-mail
- High: E-mail + Slack
- Critical: Todos
- Emergency: Todos + SMS

### Fora do Horario
- Info: Dashboard
- Warning: Dashboard
- High: E-mail
- Critical: E-mail + Slack
- Emergency: Todos + SMS

## Escalacao

### Nivel 1 (0-15 min)
- Operador responsavel

### Nivel 2 (15-30 min)
- Lider tecnico

### Nivel 3 (30-60 min)
- Gestor de operacoes

### Nivel 4 (60+ min)
- Diretoria

## Canais

### Ativos
- Dashboard interno
- E-mail
- Slack
- Microsoft Teams

### Planejados
- Discord
- SMS
- Telefonica
- Webhook customizado
