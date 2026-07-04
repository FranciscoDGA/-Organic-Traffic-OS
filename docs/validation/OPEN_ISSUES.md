# Open Issues

Este documento lista as pendências menores que não bloqueiam o lançamento da versão de produção mas requerem monitoramento contínuo.

---

## 1. Conexão com Google Search Console (GSC)
- **Status**: Funcionalidade em fallback ativo.
- **Problema**: Limite de requisições excedido com frequência devido ao polling diário de posições de palavras-chave.
- **Ação**: Implementar cache persistente local de 24 horas para evitar novos timeouts na próxima Sprint estratégica.

---

## 2. Limite SMTP do Resend
- **Status**: Crítico no plano gratuito.
- **Problema**: Envio de alertas de MQLs bloqueado após 100 envios/dia.
- **Ação**: Solicitar ao proprietário a troca da chave de produção para plano corporativo.
