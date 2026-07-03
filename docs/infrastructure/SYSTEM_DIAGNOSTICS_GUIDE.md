# System Diagnostics Guide

Este manual descreve o comportamento dos diagnósticos do sistema do Organic Traffic OS.

---

## 1. Módulos de Diagnóstico

Cada módulo cobre uma área sensível do sistema:

- **AI Layer**: Inspeciona a presença de pelo menos uma chave de modelo de linguagem de produção (OpenAI ou Gemini/Google).
- **Environment Variables**: Valida se todas as 32 chaves mapeadas no [.env.example](file:///c:/Users/User/OneDrive/Desktop/Organic%20Traffic%20OS/.env.example) estão preenchidas para o respectivo ambiente ativo.
- **Organic Bridge**: Mapeia se os blogs do portfólio (`passacumaru`, `qualoseguro`, etc.) possuem chaves cadastradas e endpoints configurados de forma manual.
- **Database & Storage**: Valida se o Supabase possui conexões persistentes mapeadas.

---

## 2. Rastreamento e Logs

Todos os diagnósticos salvam um log estruturado contendo a ação, timestamp e detalhes de auditoria, facilitando a depuração em caso de erros no deploy.
