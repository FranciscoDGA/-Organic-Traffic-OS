# Sprint 87 — Platform Hardening, Resilience & Recovery V1

Este documento descreve a arquitetura de resiliência e auto-recuperação da plataforma Organic Traffic OS.

---

## 1. Arquitetura de Resiliência

A resiliência física do sistema baseia-se em monitorar barramentos, loops e integridade semântica de dados, contendo falhas operacionais antes que elas interrompam execuções do barramento:

- [resilience.service.ts](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/src/services/resilience.service.ts): Centraliza telemetria de saúde de subsistemas, circuit breakers ativos e detecção de loops de execução.
- **Detector de Execução Duplicada**: Impede que a mesma missão de escrita ou publicação seja submetida paralelamente, bloqueando requisições duplicadas.
- **Circuit Breaker**: Chaves com limites de falhas que cortam conexões com APIs externas instáveis (como Search Console), respondendo de forma segura com fallback de dados locais em cache.

---

## 2. Registro de Incidentes

Todos os incidentes capturados pelo sistema são adicionados ao registro de incidentes com id, severidade, componente afetado, causa primária, ação de contenção tomada e tempo médio de recuperação (MTTR).

---

## 3. Mecanismo de Recuperação Ativa (Recovery)

Ao disparar a API `/api/organic-os/system/recovery`, a engine:
1. Realiza um handshake com os Workers ativos.
2. Limpa filas de mensagens bloqueadas.
3. Altera o status dos incidentes pendentes para `resolved`.
