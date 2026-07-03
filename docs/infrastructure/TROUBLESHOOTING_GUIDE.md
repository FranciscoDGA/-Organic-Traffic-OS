# Troubleshooting Guide

Este guia ajuda administradores a corrigirem rapidamente erros comuns de infraestrutura detectados pelo validator.

---

## 1. Variável de Ambiente Ausente (`ENV_ERR`)
- **Problema**: O validador acusa erro de variável obrigatória vazia.
- **Correção**: Acesse o painel da Vercel (aba *Settings* > *Environment Variables*), preencha o valor correspondente e execute um novo deploy. Certifique-se de que a variável foi associada ao ambiente correto (Production/Preview).

---

## 2. Nenhum Provedor de IA Configurado (`AI_CRITICAL_NO_PROVIDERS`)
- **Problema**: A pontuação de inteligência caiu para crítico devido à ausência de chaves de IA.
- **Correção**: Crie uma conta no OpenAI Platform ou Google AI Studio, gere a chave de API correspondente e insira nas variáveis `OPENAI_API_KEY` ou `GEMINI_API_KEY` da Vercel.

---

## 3. Blog Externo Desconectado (`WORKSPACE_WARN`)
- **Problema**: O blog cadastrado (ex: `qualoseguro`) não responde ao deploy.
- **Correção**: Acesse o painel do respectivo blog, certifique-se de que a API da Organic Bridge foi implantada e que a variável `ORGANIC_PUBLISHER_SECRET` compartilhada com o painel central é idêntica à chave cadastrada no blog de destino.
