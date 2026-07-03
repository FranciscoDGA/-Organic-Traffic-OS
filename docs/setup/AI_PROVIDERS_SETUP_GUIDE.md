# AI Providers Setup Guide

Este manual orienta a ativação dos provedores de inteligência artificial.

---

## 1. Onde Obter Chaves de API

- **OpenAI**: Acesse a platform da OpenAI, crie a chave na aba **API Keys** e adicione fundos para poder utilizar modelos de produção (GPT-4o).
- **Google Gemini**: Acesse o **Google AI Studio**, clique em **Get API Key** e copie o token gerado.
- **Anthropic (Claude)**: Crie uma conta no console da Anthropic e vá em **API Keys**.

---

## 2. Escolhendo os Modelos Padrão

Defina no seu `.env` o provedor padrão para carregar no robô de escrita:
```env
DEFAULT_AI_PROVIDER="gemini"
DEFAULT_AI_MODEL="gemini-1.5-pro"
```
Recomendamos o `gemini-1.5-pro` pelo excelente custo/benefício e suporte a contextos longos de até 2 milhões de tokens.
