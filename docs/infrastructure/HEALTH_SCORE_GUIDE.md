# Health Score Guide

Este guia detalha os critérios e pesos de cálculo utilizados pelo validador de saúde de infraestrutura.

---

## 1. Critérios de Escala de Saúde (0 a 100)

O **Overall Health Score** (Pontuação Geral de Saúde) penaliza o sistema de forma proporcional aos riscos operacionais encontrados:

- **CRITICAL (Gravidade Crítica)**: -25 pontos por item. Erros como chaves de IA ausentes ou falha de conexão na URL do banco de dados que inviabilizam o uso do sistema por completo.
- **ERROR (Erro Comum)**: -10 pontos por item. Variáveis obrigatórias ausentes ou formato incorreto.
- **WARNING (Aviso)**: -3 pontos por item. Workspaces ou blogs sem endpoints de deploy configurados (sinaliza que parte da funcionalidade de publicação está limitada).

---

## 2. Divisão de Sub-Scores

A saúde é calculada de forma isolada por área, permitindo detectar gargalos específicos:
- **Database Score**: 0 ou 100 (presença de string de conexão ativa).
- **Storage Score**: Mapeamento dos buckets de armazenamento.
- **Publishing Score**: Estado de criptografia das chaves do publicador.
- **Workspace Score**: Percentual de blogs com Organic Bridge ativa e conectada.
- **Security Score**: Presença e robustez das regras de RLS e service_role.
